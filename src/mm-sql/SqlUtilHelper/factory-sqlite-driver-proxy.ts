import { DbConfig } from '../../__test-utils__/misc';
import * as genericPool from 'generic-pool';
import * as sqlite3 from 'sqlite3';

export const factorySqliteDriverProxy = (config: DbConfig) => {
    const log = (msg) => (config.logger ? config.logger(msg) : null);

    if (!config.database) {
        throw new Error("Missing 'database' config entry");
    }

    // create pool so we have similar interface with other drivers
    const _myPool = genericPool.createPool(
        {
            create: (): Promise<sqlite3.Database> => {
                return new Promise((resolve, reject) => {
                    let _client = new (sqlite3.verbose().Database)(
                        config.database,
                        (err) => {
                            err && reject(err);
                        }
                    );
                    _client.once('open', () => {
                        log(`sqlite: open ${config.database}`);
                        resolve(_client);
                    });
                    _client.once('close', () =>
                        log(`sqlite: close ${config.database}`)
                    );
                    // _client.on('error', (e) => log(`sqlite: error ${e}`));
                });
            },
            destroy: (_client: sqlite3.Database): Promise<void> => {
                return new Promise((resolve, reject) => {
                    _client.close((err) => (err ? reject(err) : resolve()));
                });
            },
        },
        // intentionally just size 1... (reported issues on multiple clients with sqlite)
        {
            min: 1,
            max: 1,
        }
    );

    const _clientQuery = (_client: sqlite3.Database, text, params) => {
        return new Promise((resolve, reject) => {
            _client.serialize(() => {
                _client.all(text, params, async (err, rows) => {
                    await _myPool.release(_client);
                    if (err) {
                        return reject(err);
                    }
                    log(`sqlite: query finished, releasing client`);
                    resolve(rows);
                });
            });
        });
    };

    const query = async (text, params) => {
        return new Promise((resolve, reject) => {
            (_myPool as any)
                .acquire()
                .then((_client: sqlite3.Database) => {
                    log(`sqlite: client acquired (query)`);
                    return resolve(_clientQuery(_client, text, params));
                })
                .catch(reject);
        });
    };

    const client = async () => {
        return new Promise((resolve, reject) => {
            (_myPool as any) // ts wtf?
                .acquire()
                .then((_client: sqlite3.Database) => {
                    log(`sqlite: client acquired (client)`);

                    // uff... monkey patch so we have normalized api across drivers...
                    (_client as any).query = async (text, params) =>
                        _clientQuery(_client, text, params);

                    resolve(_client);
                })
                .catch(reject);
        });
    };

    const clientRelease = async (_client) => {
        await _myPool.release(_client);
        _client = null;
    };

    const poolEnd = async () => {
        return new Promise((resolve, reject) => {
            (_myPool as any) // ts wtf?
                .drain()
                .then(async () => {
                    await _myPool.clear();
                    resolve();
                })
                .catch(reject);
        });
    };

    // prettier-ignore
    return {
        driver: 'sqlite', config, query, client, clientRelease, poolEnd, raw: sqlite3,
    };
}
