"use strict";
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
exports._queryMultipleStatements = async (sqls, db, debug) => {
    for (let sql of sqls) {
        await db.query(sql, void 0, debug);
    }
};
async function _importData(DATA_DIR, db) {
    _assertExists(DATA_DIR);
    const sqlFile = path.join(DATA_DIR, `testing.sql`); // hard
    if (fs.existsSync(sqlFile)) {
        let sql = fs.readFileSync(sqlFile).toString();
        if (db.isSqlite()) {
            await exports._queryMultipleStatements(exports._splitAsMultipleStatements(sql), db);
        }
        else {
            return db.query(sql);
        }
    }
}
exports._importData = _importData;
exports._initDb = async (db, debug, withData = true) => {
    const SCHEMA_DIR = path.resolve(process.cwd(), 'data', db.dialect, 'schema');
    _assertExists(SCHEMA_DIR);
    const sql = get_sql_schema_1.getSqlSchema(SCHEMA_DIR);
    // console.log(sqlSchema);
    try {
        // import schema
        if (db.isSqlite()) {
            await exports._queryMultipleStatements(exports._splitAsMultipleStatements(sql), db);
        }
        else {
            await db.query(sql, void 0, debug);
        }
        if (withData) {
            const DATA_DIR = path.resolve(process.cwd(), 'data', db.dialect, 'data');
            await _importData(DATA_DIR, db);
        }
    }
    catch (e) {
        console.error(e.toString());
    }
};
