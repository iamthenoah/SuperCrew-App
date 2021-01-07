import { MemoryDataType as MemDT } from './enums/MemoryDataType';
import { EncodingType as Encoding } from './enums/EncodingType';

import { ProcessObject, ModuleObject, DataType, readMemory, readBuffer, openProcess, findModule } from 'memoryjs';


export default class MemoryReader {

    private amongUs: ProcessObject | null = null;
    private gameAssembly: ModuleObject | null = null;

    constructor() {
        this.checkProcess();
    }

    public checkProcess(): boolean {
        try {
            this.amongUs = openProcess('Among Us.exe');
            this.gameAssembly = findModule('GameAssembly.dll', this.amongUs.th32ProcessID);
            return true;
        } catch (e) {
            this.amongUs = null;
            this.gameAssembly = null;            
            return false;
        }
    }

    public read<T>(dataType: DataType, offsets: number[], address: number = this.gameAssembly.modBaseAddr, defaultParam?: T): T {
        if (!this.amongUs) return defaultParam as T;
		if (address === 0) return defaultParam as T;
		const { address: addr, last } = this.offset(address, offsets);
		if (addr === 0) return defaultParam as T;
        let data = readMemory<T>(
			this.amongUs.handle,
			addr + last,
			dataType
		);  
        return data;
    }

	public offset(address: number, offsets: number[]): { address: number, last: number } {
		address = address & 0xffffffff;
		for (let i = 0; i < offsets.length - 1; i++) {
			address = readMemory<number>(this.amongUs.handle, address + offsets[i], MemDT.UINT32);
			if (address == 0) break;
		}
		const last = offsets.length > 0 ? offsets[offsets.length - 1] : 0;
		return { address, last };
    }
    
    public readString(address: number): string {
		if (address === 0 || !this.amongUs) return '';
		const length = readMemory<number>(this.amongUs.handle, address + 0x8, MemDT.INT);
		const buffer = readBuffer(this.amongUs.handle, address + 0xC, length << 1);
		return buffer.toString(Encoding.UTF8).replace(/\0/g, '');
    }
    
    public fromBuffer(address: number, offset: number): Buffer {
        return readBuffer(this.amongUs.handle, address, offset)
    }
}