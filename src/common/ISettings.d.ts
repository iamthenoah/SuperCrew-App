import { IOffsets } from "./proxy/interfaces/IOffsets";

export type Favortie = {
    name: string,
    id: number,
    count: number
}

export interface ISettingsSchema {
    offsets: IOffsets | null;
    server: string;
    perifs: {
        input: string | null;
        output: string | null;
    };
    shortcuts: {
        pushToTalk: string;
        deafen: string,
    };
    configs: {
        pushToTalk: boolean;
        hideCode: boolean;
        darkTheme: boolean;  
    };
    stats: {
        score: number;
        kills: number;
        wins: number;
        lost: number;
        impostor: number;
        crewmate: number;
        favorites: {
            color: Favortie | null;
            skin: Favortie | null;
            hat: Favortie | null;
        };
    }
}