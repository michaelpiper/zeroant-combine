import { type DBClientOptions } from 'zeroant-constant';
import { AddonConfig } from 'zeroant-factory/addon.config';
export type DBOptions = DBClientOptions;
export declare class DBConfig extends AddonConfig {
    get development(): DBOptions;
    get production(): DBOptions;
    get test(): DBOptions;
    get options(): DBOptions;
}
