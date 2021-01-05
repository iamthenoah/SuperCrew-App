import { DiscussionState } from "./enums/DiscussionState";
import { GameState } from "./enums/GameState";
import { IPlayer } from "./interfaces/IPlayer";

export interface AmongUsGameData {
    players: IPlayer[];
    lobbyCode: string;
    state: {
        game: GameState;
        discussion: DiscussionState;
    };
}