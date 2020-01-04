import * as fs from 'fs';
import { getSqlSchema } from './get-sql-schema';
import * as path from 'path';
import { SqlUtil } from '../mm-sql/SqlUtil';

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
export const _splitAsMultipleStatements = (sql: string) => {
    return `${sql}`.split(';').filter((v) => v.trim() !== '');
};

export const _queryMultipleStatements = async (sqls: string[], db: SqlUtil, debug?) => {
    for (let sql of sqls) {
        await db.query(sql, void 0, debug);
    }
};

export async function _importData(DATA_DIR, db: SqlUtil) {
    _assertExists(DATA_DIR);
    const sqlFile = path.join(DATA_DIR, `testing.sql`); // hard

    if (fs.existsSync(sqlFile)) {
        let sql = fs.readFileSync(sqlFile).toString();

        if (db.isSqlite()) {
            await _queryMultipleStatements(_splitAsMultipleStatements(sql), db);
        } else {
            return db.query(sql);
        }
    }
}

export const _initDb = async (db: SqlUtil, debug?, withData = true) => {
    const SCHEMA_DIR = path.resolve(process.cwd(), 'data', db.dialect, 'schema');
    _assertExists(SCHEMA_DIR);

    const sql = getSqlSchema(SCHEMA_DIR);
    // console.log(sqlSchema);

    try {
        // import schema
        if (db.isSqlite()) {
            await _queryMultipleStatements(_splitAsMultipleStatements(sql), db);
        } else {
            await db.query(sql, void 0, debug);
        }

        if (withData) {
            const DATA_DIR = path.resolve(process.cwd(), 'data', db.dialect, 'data');
            await _importData(DATA_DIR, db);
        }
    } catch (e) {
        console.error(e.toString());
    }
};
