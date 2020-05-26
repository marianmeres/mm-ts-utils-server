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
exports.factoryMysqlDriverProxy = void 0;
const _mysql = require("mysql");
const util = require("util");
exports.factoryMysqlDriverProxy = (config) => {
    const mysqlPool = _mysql.createPool(Object.assign({}, config, {
        // force same behavior as pg
        multipleStatements: true,
    }));
    /**
     * @param text
     * @param params
     * @returns {Promise<any>}
     */
    const query = (text, params) => __awaiter(void 0, void 0, void 0, function* () {
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
    const client = () => __awaiter(void 0, void 0, void 0, function* () {
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
    const clientRelease = (_client) => __awaiter(void 0, void 0, void 0, function* () {
        _client.release();
        _client = null;
    });
    /**
     * @returns {Promise<void>}
     */
    const poolEnd = () => __awaiter(void 0, void 0, void 0, function* () { return mysqlPool.end(); });
    // prettier-ignore
    return {
        driver: 'mysql', query, client, clientRelease, config, poolEnd, raw: _mysql,
    };
};
