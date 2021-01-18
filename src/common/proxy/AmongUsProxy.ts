import { MemoryDataType as MemDT } from './enums/MemoryDataType';

import { IOffsets } from './interfaces/IOffsets';
import { IPlayer } from './interfaces/IPlayer';
import { IPlayerBuffer } from './interfaces/IPlayerBuffer';
import { GameState } from './enums/GameState';
import { DiscussionState } from './enums/DiscussionState';

import { NotificationType } from '@/common/NotificationType';

import Struct from 'structron';
import MemoryReader from './MemoryReader';
import Util from './Util';

export default class AmongUsProxy {

    private renderer: (event: string, ...args: unknown[]) => void;

    private Memory: MemoryReader;
    private PlayerStruct: Struct;
    private offsets: IOffsets;

    public discussionState: DiscussionState = DiscussionState.NONE;
    public gameState: GameState = GameState.UNKNOWN;
    
    private previousGameState: boolean | null = null;

    public gameCode: string | null = null;
    public players: Array<IPlayer>;
    public inGame: boolean;

    constructor(renderer: (event: string, ...args: unknown[]) => void, offsets: IOffsets) {
        this.renderer = renderer;

        this.Memory = new MemoryReader();

        this.players = [];
        this.offsets = offsets;
        this.inGame = false;

        this.PlayerStruct = new Struct();
        for (const member of offsets.player.struct)
            (member.type === 'SKIP' && member.skip) 
                ? this.PlayerStruct.addMember(Struct.TYPES.SKIP(member.skip), member.name)
			    : this.PlayerStruct.addMember(Struct.TYPES[member.type.toString()], member.name);
    }

    public operate(): void {
        const processRunState = this.Memory.checkProcess();

        if (this.previousGameState != processRunState) {
            this.previousGameState = processRunState;
            this.renderer('game-opened', processRunState);
            const version = Util.getCurrentVersion();
            if (processRunState) this.renderer('notify', `Among Us running on version ${version}...`, NotificationType.SUCCESS)
        }
        
        if (processRunState) {

            const meetingHud = this.Memory.read<number>(MemDT.POINTER, this.offsets.meetingHud);
            const meetingHud_cachePtr = meetingHud === 0 ? 0 : this.Memory.read<number>(MemDT.UINT32, this.offsets.meetingHudCachePtr, meetingHud);
            const meetingHudState = meetingHud_cachePtr === 0 ? 4 : this.Memory.read(MemDT.INT, this.offsets.meetingHudState, meetingHud, 4);

            const gameStateCode = this.Memory.read<number>(MemDT.INT, this.offsets.gameState);
            const allPlayersPtr = this.Memory.read<number>(MemDT.PTR, this.offsets.allPlayersPtr) & 0xffffffff;
            const allPlayers = this.Memory.read<number>(MemDT.PTR, this.offsets.allPlayers, allPlayersPtr);
            const playerCount: number = gameStateCode !== 0 ? this.Memory.read(MemDT.INT as const, this.offsets.playerCount, allPlayersPtr) : 0;

            this.discussionState = DiscussionState[DiscussionState[meetingHudState]];
            this.gameState = this.discussionState == 4 
                ? GameState[GameState[gameStateCode]] 
                : GameState.DISCUSSION;
            this.inGame = (this.gameState != GameState.MENU && this.gameState != GameState.UNKNOWN);
            this.gameCode = this.inGame ? this.getGameCode() : this.gameCode;

            var playerAddrPtr = allPlayers + this.offsets.playerAddrPtr;
            var impostors = 0, crewmates = 0;
            this.players = [];

            for (let i = 0; i < playerCount; i++, playerAddrPtr += 4) {
                const { address, last } = this.Memory.offset(playerAddrPtr, this.offsets.player.offsets);
                const playerData: Buffer = this.Memory.fromBuffer(address + last, this.offsets.player.bufferLength);
                const player = this.parsePlayer(address + last, playerData);
                player.properties.isImpostor ? impostors++ : crewmates++;
                this.players.push(player);
            }

            /*
                const player = this.players[i];
                let o = [
                    me.coordinates.x - player.coordinates.x,
                    me.coordinates.y - player.coordinates.y
                ];
                let d = Math.sqrt(o[0] * o[0] + o[1] * o[1]).toFixed(2);
                let name = player.properties.isDead ? `(${player.name})` : player.name;
            */
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