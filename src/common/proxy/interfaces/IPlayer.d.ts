export interface IPlayer {
    ptr: number;
    id: number;
    name: string;
    taskPtr: number;
    objectPtr: number;
    appearance: {
        colorId: number;
        hatId: number;
        petId: number;
        skinId: number;
    },
    properties: {
        isConnected: boolean;
        isImpostor: boolean;
        isDead: boolean;
        isLocal: boolean;
        isInVent: boolean;
    },
    coordinates: {
        x: number;
        y: number;
    }
}