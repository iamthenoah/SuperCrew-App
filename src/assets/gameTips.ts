import { IGameTip } from '@/common/interfaces/IGameTip';

/**
 * Game tips to add to be displayed when game is not opened
 * 
 * crewmate -> tips for crewmates to follow
 * 
 * imposter -> tips for imposters to follow 
 */
export const GameTips: IGameTip[] = [
    {
        role: 'crewmate',
        tip: 'Check for task animations not playing to spot imposters faking tasks.'
    },
    {
        role: 'imposter',
        tip: 'Downloading a file takes around 6-7 seconds.'
    }
]