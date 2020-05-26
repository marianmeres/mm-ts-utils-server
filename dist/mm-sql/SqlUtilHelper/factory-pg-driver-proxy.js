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
exports.factoryPgDriverProxy = void 0;
const _pg = require("pg");
exports.factoryPgDriverProxy = (config) => {
    const { Pool } = _pg;
    const pgPool = new Pool(config);
    pgPool.on('error', (err, _client) => console.error(`pgPool error: ${err.toString()}`));
    /**
     * @param text
     * @param params
     */
    const query = (text, params) => __awaiter(void 0, void 0, void 0, function* () { return pgPool.query(text, params); });
    /**
     *
     */
    const client = () => __awaiter(void 0, void 0, void 0, function* () { return yield pgPool.connect(); });
    /**
     * @param _client
     */
    const clientRelease = (_client) => __awaiter(void 0, void 0, void 0, function* () {
        _client.release(true);
        _client = null;
    });
    /**
     *
     */
    const poolEnd = () => __awaiter(void 0, void 0, void 0, function* () { return pgPool.end(); });
    // prettier-ignore
    return {
        driver: 'pg', query, client, clientRelease, config, poolEnd, raw: _pg,
    };
};
