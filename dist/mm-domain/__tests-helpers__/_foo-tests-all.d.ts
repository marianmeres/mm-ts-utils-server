import { SqlUtil } from '../../mm-sql/SqlUtil';
export declare const _sqlUtilTestsAll: {
    '`find` works': (db: SqlUtil) => Promise<void>;
    '`findWhere` works': (db: SqlUtil) => Promise<void>;
    '`fetchAll` works': (db: SqlUtil) => Promise<void>;
    '`fetchCount` works': (db: SqlUtil) => Promise<void>;
    '`save` (insert) works': (db: SqlUtil) => Promise<void>;
    '`save` (update) works': (db: SqlUtil) => Promise<void>;
    '`delete` works': (db: SqlUtil) => Promise<void>;
    'only.`delete` with `is_deleted` works': (db: SqlUtil) => Promise<void>;
};
