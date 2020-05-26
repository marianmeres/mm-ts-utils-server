import { DbConfig } from '../../__test-utils__/misc';
import * as _pg from 'pg';
export declare const factoryPgDriverProxy: (config: DbConfig) => {
    driver: string;
    query: (text: any, params: any) => Promise<_pg.QueryArrayResult<any[]>>;
    client: () => Promise<_pg.PoolClient>;
    clientRelease: (_client: any) => Promise<void>;
    config: DbConfig;
    poolEnd: () => Promise<void>;
    raw: typeof _pg;
};
