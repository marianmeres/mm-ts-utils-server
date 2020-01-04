import { _initDb } from './init';
import { SqlUtil } from '../mm-sql/SqlUtil';

export interface DbConfig {
    host?: string;
    user?: string;
    password?: string;
    database?: string;
    port?: number;
    logger?: (msg) => void;
    initSqls?: string[];
}

export interface PgDbConfig extends DbConfig {
    // number of milliseconds to wait before timing out when connecting a new client
    // by default this is 0 which means no timeout
    connectionTimeoutMillis?: number;

    // number of milliseconds a client must sit idle in the pool and not be checked out
    // before it is disconnected from the backend and discarded
    // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
    idleTimeoutMillis?: number;

    // maximum number of clients the pool should contain
    // by default this is set to 10.
    max?: number;
}

export interface MysqlDbConfig extends DbConfig {
    // https://github.com/mysqljs/mysql#connection-options
}

export interface MysqlPoolDbConfig extends MysqlDbConfig {
    // https://github.com/mysqljs/mysql#pool-options
    multipleStatements?: boolean;
}

export const testSuiteFactorySqlUtilDialectBased = (
    db: SqlUtil,
    testsAll,
    shouldSkipResolver,
    _beforeEach?
) => {
    let testsFactoryMap = Object.keys(testsAll);

    describe(db.dialect, () => {
        beforeEach(async () => {
            if (typeof _beforeEach === 'function') {
                return _beforeEach();
            }
            return shouldSkipResolver() ? void 0 : _initDb(db);
        });

        for (let i = 0; i < testsFactoryMap.length; i++) {
            let key = testsFactoryMap[i];
            let testFactory = testsAll[key];

            let testFn = async () => {
                if (!shouldSkipResolver()) {
                    await testFactory(db);
                }
            };

            if (shouldSkipResolver()) {
                key = `skip.${key}`;
            }

            // skip
            if (/^skip\./i.test(key)) {
                test.skip(key, testFn);
            }
            // only
            else if (/^only\./i.test(key)) {
                test.only(key, testFn);
            }
            // normal
            else {
                test(key, testFn);
            }
        }
    });
};
