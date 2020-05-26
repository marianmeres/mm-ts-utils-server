import { DbConfig } from '../../__test-utils__/misc';
import * as sqlite3 from 'sqlite3';
export declare const factorySqliteDriverProxy: (config: DbConfig) => {
    driver: string;
    config: DbConfig;
    query: (text: any, params: any) => Promise<unknown>;
    client: () => Promise<unknown>;
    clientRelease: (_client: any) => Promise<void>;
    poolEnd: () => Promise<unknown>;
    raw: typeof sqlite3;
};
