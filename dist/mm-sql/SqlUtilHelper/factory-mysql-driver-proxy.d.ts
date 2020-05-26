import { DbConfig } from '../../__test-utils__/misc';
import * as _mysql from 'mysql';
export declare const factoryMysqlDriverProxy: (config: DbConfig) => {
    driver: string;
    query: (text: any, params: any) => Promise<unknown>;
    client: () => Promise<unknown>;
    clientRelease: (_client: any) => Promise<void>;
    config: DbConfig;
    poolEnd: () => Promise<void>;
    raw: typeof _mysql;
};
