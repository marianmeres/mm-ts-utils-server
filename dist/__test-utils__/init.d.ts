import { SqlUtil } from '../mm-sql/SqlUtil';
/**
 * WARNING: NAIVE AND INSECURE FOR USERLAND INPUT
 * @param sql
 * @private
 */
export declare const _splitAsMultipleStatements: (sql: string) => string[];
export declare const _queryMultipleStatements: (sqls: string[], db: SqlUtil, debug?: any) => Promise<void>;
export declare function _importData(DATA_DIR: any, db: SqlUtil): Promise<any>;
export declare const _initDb: (db: SqlUtil, debug?: any, withData?: boolean) => Promise<void>;
