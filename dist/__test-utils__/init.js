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
const fs = require("fs");
const get_sql_schema_1 = require("./get-sql-schema");
const path = require("path");
const _assertExists = (file) => {
    if (!fs.existsSync(file)) {
        throw new Error(`'${file}' not found`);
    }
};
/**
 * WARNING: NAIVE AND INSECURE FOR USERLAND INPUT
 * @param sql
 * @private
 */
exports._splitAsMultipleStatements = (sql) => {
    return `${sql}`.split(';').filter((v) => v.trim() !== '');
};
exports._queryMultipleStatements = (sqls, db, debug) => __awaiter(void 0, void 0, void 0, function* () {
    for (let sql of sqls) {
        yield db.query(sql, void 0, debug);
    }
});
function _importData(DATA_DIR, db) {
    return __awaiter(this, void 0, void 0, function* () {
        _assertExists(DATA_DIR);
        const sqlFile = path.join(DATA_DIR, `testing.sql`); // hard
        if (fs.existsSync(sqlFile)) {
            let sql = fs.readFileSync(sqlFile).toString();
            if (db.isSqlite()) {
                yield exports._queryMultipleStatements(exports._splitAsMultipleStatements(sql), db);
            }
            else {
                return db.query(sql);
            }
        }
    });
}
exports._importData = _importData;
exports._initDb = (db, debug, withData = true) => __awaiter(void 0, void 0, void 0, function* () {
    const SCHEMA_DIR = path.resolve(process.cwd(), 'data', db.dialect, 'schema');
    _assertExists(SCHEMA_DIR);
    const sql = get_sql_schema_1.getSqlSchema(SCHEMA_DIR);
    // console.log(sqlSchema);
    try {
        // import schema
        if (db.isSqlite()) {
            yield exports._queryMultipleStatements(exports._splitAsMultipleStatements(sql), db);
        }
        else {
            yield db.query(sql, void 0, debug);
        }
        if (withData) {
            const DATA_DIR = path.resolve(process.cwd(), 'data', db.dialect, 'data');
            yield _importData(DATA_DIR, db);
        }
    }
    catch (e) {
        console.error(e.toString());
    }
});
