import { DbConfig } from '../../__test-utils__/misc';
import * as _pg from 'pg';

export const factoryPgDriverProxy = (config: DbConfig) => {
    const { Pool } = _pg;
    const pgPool = new Pool(config);
    pgPool.on('error', (err, _client) =>
        console.error(`pgPool error: ${err.toString()}`)
    );

    /**
     * @param text
     * @param params
     */
    const query = async (text, params) => pgPool.query(text, params);

    /**
     *
     */
    const client = async () => await pgPool.connect();

    /**
     * @param _client
     */
    const clientRelease = async (_client) => {
        _client.release(true);
        _client = null;
    };

    /**
     *
     */
    const poolEnd = async () => pgPool.end();

    // prettier-ignore
    return {
        driver: 'pg', query, client, clientRelease, config, poolEnd, raw: _pg,
    };
}
