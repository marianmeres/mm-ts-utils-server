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
exports.factorySqliteDriverProxy = void 0;
const genericPool = require("generic-pool");
const sqlite3 = require("sqlite3");
exports.factorySqliteDriverProxy = (config) => {
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
                _client.all(text, params, (err, rows) => __awaiter(void 0, void 0, void 0, function* () {
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
    const query = (text, params) => __awaiter(void 0, void 0, void 0, function* () {
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
    const client = () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            _myPool // ts wtf?
                .acquire()
                .then((_client) => {
                log(`sqlite: client acquired (client)`);
                // uff... monkey patch so we have normalized api across drivers...
                _client.query = (text, params) => __awaiter(void 0, void 0, void 0, function* () { return _clientQuery(_client, text, params); });
                resolve(_client);
            })
                .catch(reject);
        });
    });
    const clientRelease = (_client) => __awaiter(void 0, void 0, void 0, function* () {
        yield _myPool.release(_client);
        _client = null;
    });
    const poolEnd = () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            _myPool // ts wtf?
                .drain()
                .then(() => __awaiter(void 0, void 0, void 0, function* () {
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
};
