import { SqlUtil } from '../SqlUtil';
export declare const _sqlUtilTestsAll: {
    'buildWhere works': (db: SqlUtil) => Promise<void>;
    'sign parsing works': (db: SqlUtil) => Promise<void>;
    'building addons works': (db: SqlUtil) => Promise<void>;
    '`fetchRow` works': (db: SqlUtil) => Promise<void>;
    '`fetchOne` works': (db: SqlUtil) => Promise<void>;
    '`fetchOne` works (nonexisting record)': (db: SqlUtil) => Promise<void>;
    '`fetchAll` works': (db: SqlUtil) => Promise<void>;
    '`fetchCount` works': (db: SqlUtil) => Promise<void>;
    '`insert` works': (db: SqlUtil) => Promise<void>;
    '`insert` works (undefined values are converted to nulls)': (db: SqlUtil) => Promise<void>;
    '`update` works': (db: SqlUtil) => Promise<void>;
    '`update` works (undefined values are converted to nulls)': (db: SqlUtil) => Promise<void>;
    'PG ONLY: `update` works (with `col=` sign notation)': (db: SqlUtil) => Promise<void>;
    '`delete` works': (db: SqlUtil) => Promise<void>;
    '`lastInsertId` works': (db: SqlUtil) => Promise<void>;
};
