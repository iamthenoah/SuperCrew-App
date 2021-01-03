import { MemoryDataType as MemDT } from './enums/MemoryDataType';

import { IOffsets } from './interfaces/IOffsets';
import { IPlayer } from './interfaces/IPlayer';
import { IPlayerBuffer } from './interfaces/IPlayerBuffer';
import { GameState } from './enums/GameState';
import { DiscussionState } from './enums/DiscussionState';

import Struct from 'structron';
import MemoryReader from './MemoryReader';

export default class AmongUsProxy {

    private Memory: MemoryReader;
    private PlayerStruct: Struct;
    private offsets: IOffsets;

    public discussionState: DiscussionState = DiscussionState.NONE;
    public gameState: GameState = GameState.UNKNOWN;
    
    public gameCode: string | null = null;
    public players: Array<IPlayer>;
    public inGame: Boolean;

    constructor(offsets: IOffsets) {
        this.Memory = new MemoryReader();

        this.players = [];
        this.offsets = offsets;
        this.inGame = false;
        
        this.PlayerStruct = new Struct();
        for (const member of offsets.player.struct)
            this.PlayerStruct = (member.type === 'SKIP' && member.skip) 
                ? this.PlayerStruct.addMember(Struct.TYPES.SKIP(member.skip), member.name)
			    : this.PlayerStruct = this.PlayerStruct.addMember(Struct.TYPES[member.type.toString()], member.name);
    }

    public operate(): void {
        console.clear();
        if (this.Memory.checkProcess()) {

            let meetingHud = this.Memory.read<number>(MemDT.POINTER, this.offsets.meetingHud);
            let meetingHud_cachePtr = meetingHud === 0 ? 0 : this.Memory.read<number>(MemDT.UINT32, this.offsets.meetingHudCachePtr, meetingHud);
            let meetingHudState = meetingHud_cachePtr === 0 ? 4 : this.Memory.read(MemDT.INT, this.offsets.meetingHudState, meetingHud, 4);

            let gameStateCode = this.Memory.read<number>(MemDT.INT, this.offsets.gameState);
            let allPlayersPtr = this.Memory.read<number>(MemDT.PTR, this.offsets.allPlayersPtr) & 0xffffffff;
            let allPlayers = this.Memory.read<number>(MemDT.PTR, this.offsets.allPlayers, allPlayersPtr);
            let playerCount: number = gameStateCode !== 0 ? this.Memory.read(MemDT.INT as const, this.offsets.playerCount, allPlayersPtr) : 0;

            this.discussionState = DiscussionState[DiscussionState[meetingHudState]];
            this.gameState = this.discussionState == 4 
                ? GameState[GameState[gameStateCode]] 
                : GameState.DISCUSSION;
            this.inGame = (this.gameState != GameState.MENU && this.gameState != GameState.UNKNOWN);
            this.gameCode = this.inGame ? this.getGameCode() : this.gameCode;

            let playerAddrPtr = allPlayers + this.offsets.playerAddrPtr;
            var impostors = 0, crewmates = 0;
            var me: IPlayer | null = null;
            this.players = [];

            for (let i = 0; i < playerCount; i++, playerAddrPtr += 4) {
                let { address, last } = this.Memory.offset(playerAddrPtr, this.offsets.player.offsets);
                let playerData: Buffer = this.Memory.fromBuffer(address + last, this.offsets.player.bufferLength);
                let player = this.parsePlayer(address + last, playerData);
                player.properties.isImpostor ? impostors++ : crewmates++;
                if (player.properties.isLocal) me = player;
                else this.players.push(player);
            }

            if (me) {
                for (let i = 0; i < this.players.length; i++) {
                    const player = this.players[i];
                    let o = [
                        me.coordinates.x - player.coordinates.x,
                        me.coordinates.y - player.coordinates.y
                    ];
                    let d = Math.sqrt(o[0] * o[0] + o[1] * o[1]).toFixed(2);
                    let name = player.properties.isDead ? `(${player.name})` : player.name;
                }
            }
        }
    }

    private getGameCode(): string | null {
        var code = this.inGame ? this.Memory.readString(this.Memory.read<number>(MemDT.INT32, this.offsets.gameCode)).split('\r\n') : 'null';
        return code.length === 2 ? !/^[A-Z]{6}$/.test(code[1]) || code[1] === 'MENU' ? 'null' : code[1] : 'null';
    }

	parsePlayer(ptr: number, buffer: Buffer): IPlayer {
        const { data } = this.PlayerStruct.report(buffer, 0, { monitorUsage: false });
        const playerData = <IPlayerBuffer>data;

		const isLocal = this.Memory.read<number>(MemDT.INT, this.offsets.player.isLocal, playerData.objectPtr) !== 0;

		const positionOffsets = isLocal ? [
			this.offsets.player.localX,
			this.offsets.player.localY
		] : [
			this.offsets.player.remoteX,
			this.offsets.player.remoteY
        ];
        
		const x = this.Memory.read<number>(MemDT.FLOAT, positionOffsets[0], playerData.objectPtr);
        const y = this.Memory.read<number>(MemDT.FLOAT, positionOffsets[1], playerData.objectPtr);

		return {
			ptr,
			id: playerData.id,
			name: this.Memory.readString(playerData.name).trim(),
			taskPtr: playerData.taskPtr,
            objectPtr: playerData.objectPtr,
            appearance: {
                colorId: playerData.color,
                hatId: playerData.hat,
                petId: playerData.pet,
                skinId: playerData.skin,
            },
            properties: {
                isConnected: playerData.disconnected <= 0,
                isImpostor: playerData.impostor > 0,
                isDead: playerData.dead > 0,
                isInVent: this.Memory.read<number>(MemDT.BYTE, this.offsets.player.inVent, playerData.objectPtr) > 0,
                isLocal,
            },
            coordinates: { x, y }
        };
    }
}