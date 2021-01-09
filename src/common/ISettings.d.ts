import { IOffsets } from "./proxy/interfaces/IOffsets";

export type Favortie = {
    name: string,
    id: number,
    count: number
}

export interface ISettings {
    offsets: IOffsets | null;
    server: string;
    perifs: {
        input: string;
        output: string;
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
        favorites: {
            color: Favortie;
            skin: Favortie;
            hat: Favortie
        };
        wins: number;
        lost: number;
        impostor: number;
        crewmate: number;
    }
}