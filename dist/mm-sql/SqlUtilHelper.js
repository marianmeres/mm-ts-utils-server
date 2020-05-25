"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlUtilHelper = void 0;
const _mysql = require("mysql");
const _pg = require("pg");
const util = require("util");
const sqlite3 = require("sqlite3");
const genericPool = require("generic-pool");
let SqlUtilHelper = /** @class */ (() => {
    class SqlUtilHelper {
        /**
         * @param config
         */
        static factoryMysqlDriverProxy(config) {
            const mysqlPool = _mysql.createPool(Object.assign({}, config, {
                // force same behavior as pg
                multipleStatements: true,
            }));
            /**
             * @param text
             * @param params
             * @returns {Promise<any>}
             */
            const query = (text, params) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    mysqlPool.getConnection((err, conn) => {
                        if (err) {
                            return reject(err);
                        }
                        conn.query(text, params || [], (error, results, fields) => {
                            conn.release();
                            // error will be an Error if one occurred during the query
                            if (error) {
                                return reject(error);
                            }
                            // results will contain the results of the query
                            return resolve(results);
                            // fields will contain information about the returned results fields (if any)
                        });
                    });
                });
            });
            /**
             * WARNING: EXPERIMENTAL!!!
             * @returns {Promise<any>}
             */
            const client = () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    mysqlPool.getConnection((err, conn) => {
                        if (err) {
                            return reject(err);
                        }
                        // uff... monkey patch so we have normalized api across drivers...
                        conn.query = util.promisify(conn.query);
                        return resolve(conn);
                    });
                });
            });
            /**
             * @param _client
             * @returns {Promise<void>}
             */
            const clientRelease = (_client) => __awaiter(this, void 0, void 0, function* () {
                _client.release();
                _client = null;
            });
            /**
             * @returns {Promise<void>}
             */
            const poolEnd = () => __awaiter(this, void 0, void 0, function* () { return mysqlPool.end(); });
            // prettier-ignore
            return {
                driver: 'mysql', query, client, clientRelease, config, poolEnd, raw: _mysql,
            };
        }
        /**
         * @param config
         */
        static factoryPgDriverProxy(config) {
            const { Pool } = _pg;
            const pgPool = new Pool(config);
            pgPool.on('error', (err, _client) => console.error(`pgPool error: ${err.toString()}`));
            /**
             * @param text
             * @param params
             */
            const query = (text, params) => __awaiter(this, void 0, void 0, function* () { return pgPool.query(text, params); });
            /**
             *
             */
            const client = () => __awaiter(this, void 0, void 0, function* () { return yield pgPool.connect(); });
            /**
             * @param _client
             */
            const clientRelease = (_client) => __awaiter(this, void 0, void 0, function* () {
                _client.release(true);
                _client = null;
            });
            /**
             *
             */
            const poolEnd = () => __awaiter(this, void 0, void 0, function* () { return pgPool.end(); });
            // prettier-ignore
            return {
                driver: 'pg', query, client, clientRelease, config, poolEnd, raw: _pg,
            };
        }
        /**
         * @param config
         */
        static factorySqliteDriverProxy(config) {
            const log = (msg) => (config.logger ? config.logger(msg) : null);
            if (!config.database) {
                throw new Error("Missing 'database' config entry");
            }
            // create pool so we have similar interface with other drivers
            const _myPool = genericPool.createPool({
                create: () => {
                    return new Promise((resolve, reject) => {
                        let _client = new (sqlite3.verbose().Database)(config.database, (err) => {
                            err && reject(err);
                        });
                        _client.once('open', () => {
                            log(`sqlite: open ${config.database}`);
                            resolve(_client);
                        });
                        _client.once('close', () => log(`sqlite: close ${config.database}`));
                        // _client.on('error', (e) => log(`sqlite: error ${e}`));
                    });
                },
                destroy: (_client) => {
                    return new Promise((resolve, reject) => {
                        _client.close((err) => (err ? reject(err) : resolve()));
                    });
                },
            }, 
            // intentionally just size 1... (reported issues on multiple clients with sqlite)
            {
                min: 1,
                max: 1,
            });
            const _clientQuery = (_client, text, params) => {
                return new Promise((resolve, reject) => {
                    _client.serialize(() => {
                        _client.all(text, params, (err, rows) => __awaiter(this, void 0, void 0, function* () {
                            yield _myPool.release(_client);
                            if (err) {
                                return reject(err);
                            }
                            log(`sqlite: query finished, releasing client`);
                            resolve(rows);
                        }));
                    });
                });
            };
            const query = (text, params) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    _myPool
                        .acquire()
                        .then((_client) => {
                        log(`sqlite: client acquired (query)`);
                        return resolve(_clientQuery(_client, text, params));
                    })
                        .catch(reject);
                });
            });
            const client = () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    _myPool // ts wtf?
                        .acquire()
                        .then((_client) => {
                        log(`sqlite: client acquired (client)`);
                        // uff... monkey patch so we have normalized api across drivers...
                        _client.query = (text, params) => __awaiter(this, void 0, void 0, function* () { return _clientQuery(_client, text, params); });
                        resolve(_client);
                    })
                        .catch(reject);
                });
            });
            const clientRelease = (_client) => __awaiter(this, void 0, void 0, function* () {
                yield _myPool.release(_client);
                _client = null;
            });
            const poolEnd = () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    _myPool // ts wtf?
                        .drain()
                        .then(() => __awaiter(this, void 0, void 0, function* () {
                        yield _myPool.clear();
                        resolve();
                    }))
                        .catch(reject);
                });
            });
            // prettier-ignore
            return {
                driver: 'sqlite', config, query, client, clientRelease, poolEnd, raw: sqlite3,
            };
        }
        /**
         * Simple helper to replace special placeholders with correct dialect
         * @param sql
         * @param dialect
         */
        static dialectize(sql, dialect) {
            return sql.replace(/(__[A-Z_]+__)/g, (k) => {
                const rep = (SqlUtilHelper.SQL_REPLACE_MAP[k] || {})[dialect];
                return rep !== void 0 ? rep : k;
            });
        }
    }
    /**
     * map of special placeholders with their correct dialect form
     */
    SqlUtilHelper.SQL_REPLACE_MAP = {
        __SERIAL_PRIMARY_KEY__: {
            pg: `SERIAL PRIMARY KEY`,
            sqlite: `INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT`,
            mysql: `INTEGER UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY`,
        },
        __SMALLSERIAL_PRIMARY_KEY__: {
            pg: `SMALLSERIAL PRIMARY KEY`,
            // General error: 1 AUTOINCREMENT is only allowed on an INTEGER PRIMARY KEY
            sqlite: `SMALLINT NOT NULL PRIMARY KEY AUTOINCREMENT`,
            mysql: `INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY`,
        },
        __BIGSERIAL_PRIMARY_KEY__: {
            pg: `BIGSERIAL PRIMARY KEY`,
            // General error: 1 AUTOINCREMENT is only allowed on an INTEGER PRIMARY KEY
            sqlite: `INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT`,
            mysql: `BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY`,
        },
        __UNSIGNED__: {
            pg: ``,
            sqlite: ``,
            mysql: `UNSIGNED`,
        },
        __SIGNED__: {
            pg: ``,
            sqlite: ``,
            mysql: `SIGNED`,
        },
        __TIMESTAMP__: {
            pg: `TIMESTAMP WITH TIME ZONE`,
            sqlite: `TIMESTAMP`,
            mysql: `DATETIME`,
        },
        __TIMESTAMP_DEFAULT_NOW__: {
            pg: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`,
            sqlite: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
            mysql: `DATETIME DEFAULT CURRENT_TIMESTAMP`,
        },
        __BOOL__: {
            pg: `SMALLINT`,
            sqlite: `INTEGER`,
            mysql: `TINYINT UNSIGNED`,
        },
        __TINYINT__: {
            pg: `SMALLINT`,
            sqlite: `INTEGER`,
            mysql: `TINYINT`,
        },
        __MEDIUMTEXT__: {
            pg: `TEXT`,
            sqlite: `TEXT`,
            mysql: `MEDIUMTEXT`,
        },
        __LONGTEXT__: {
            pg: `TEXT`,
            sqlite: `TEXT`,
            mysql: `LONGTEXT`,
        },
        __BLOB__: {
            pg: `BYTEA`,
            sqlite: `BLOB`,
            mysql: `BLOB`,
        },
        __LONGBLOB__: {
            pg: `BYTEA`,
            sqlite: `BLOB`,
            mysql: `LONGBLOB`,
        },
        __ENGINE_INNODB__: {
            pg: ``,
            sqlite: ``,
            mysql: ` ENGINE=InnoDb `,
        },
        __ENGINE_MYISAM__: {
            pg: ``,
            sqlite: ``,
            mysql: ` ENGINE=MyISAM `,
        },
        __DROP_TABLE_CASCADE__: {
            pg: `CASCADE`,
            sqlite: ``,
            mysql: `CASCADE`,
        },
        __DEFAULT_CHARSET_UTF8__: {
            pg: ``,
            sqlite: ``,
            mysql: ` DEFAULT CHARSET=utf8 `,
        },
        __CHARSET_UTF8_PER_COL__: {
            pg: ``,
            sqlite: ``,
            mysql: ` CHARACTER SET utf8 `,
        },
        __COLLATION_UTF8_BIN__: {
            pg: ``,
            sqlite: ``,
            mysql: ` COLLATE=utf8_bin `,
        },
        __COLLATION_UTF8_BIN_PER_COL__: {
            pg: ``,
            sqlite: ``,
            mysql: ` COLLATE utf8_bin `,
        },
        __ZERO_TIMESTAMP__: {
            pg: `1970-01-01 00:00:00+00`,
            sqlite: `0000-00-00 00:00:00`,
            mysql: `0000-00-00 00:00:00`,
        },
        __QI__: {
            pg: `"`,
            sqlite: `"`,
            mysql: '`',
        },
        __XML__: {
            pg: `XML`,
            sqlite: `TEXT`,
            mysql: `TEXT`,
        },
        __JSON__: {
            pg: `JSONB`,
            sqlite: `TEXT`,
            mysql: `TEXT`,
        },
        __COMMENT_EXCEPT_PG__: {
            pg: ``,
            sqlite: `-- `,
            mysql: `-- `,
        },
        __COMMENT_EXCEPT_SQLITE__: {
            pg: `-- `,
            sqlite: ``,
            mysql: `-- `,
        },
        __COMMENT_EXCEPT_MYSQL__: {
            pg: `-- `,
            sqlite: `-- `,
            mysql: ``,
        },
    };
    return SqlUtilHelper;
})();
exports.SqlUtilHelper = SqlUtilHelper;
