'use strict'

import Store from 'electron-store';
import { ISettingsSchema } from '@/common/ISettings';

const schema = {
    offsets: {
        type: 'object',
        default: {}
    },
    server: {
        type: 'string',
        default: 'https://supercrew.herokuapp.com'
    },
    perifs: {
        input: {
            type: 'string',
            default: ''
        },
        output: {
            type: 'string',
            default: ''
        },
    },
    shortcuts: {
        pushToTalk: {
            type: 'string',
            default: 'v'
        },
        deafen: {
            type: 'string',
            default: 'b'
        },
    },
    configs: {
        pushToTalk: {
            type: 'boolean',
            default: true
        },
        hideCode: {
            type: 'boolean',
            default: false
        },
        darkTheme: {
            type: 'boolean',
            default: true
        },  
    },
    stats: {
        score: {
            type: 'number',
            default: 0
        },
        kills: {
            type: 'number',
            default: 0
        },
        win: {
            type: 'number',
            default: 0
        },
        lost: {
            type: 'number',
            default: 0
        },
        impostor: {
            type: 'number',
            default: 0
        },
        crewmate: {
            type: 'number',
            default: 0
        },
        favorites: {
            color: {
                type: 'object',
                default: {}
            },
            skin: {
                type: 'object',
                default: {}
            },
            hat: {
                type: 'object',
                default: {}
            }
        },
    }
};

const store = new Store<ISettingsSchema>();
