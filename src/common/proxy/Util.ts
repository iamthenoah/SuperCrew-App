import { EncodingType as Encoding } from './enums/EncodingType';
import { IOffsets } from './interfaces/IOffsets';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import axios from 'axios';


export default class Util {

    public static getCurrentVersion(): string | null {
        let valuesFile = resolve((process.env.LOCALAPPDATA || '') + 'Low', 'Innersloth/Among Us/Unity/6b8b0d91-4a20-4a00-a3e4-4da4a883a5f0/Analytics/values');
        return JSON.parse(readFileSync(valuesFile, Encoding.UTF8)).app_ver;
    }

    public static async getOffsetSchema(version: string): Promise<IOffsets | null> {
        console.log(version);
        let data = await axios.get(`https://dripdrip.herokuapp.com/offsets/${version}.json`).then(res => res.data);
        return data as IOffsets;
    }
}