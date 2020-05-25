export interface SqlUtilFetchOptions {
    group_by?: string;
    order_by?: string;
    limit?: number;
    offset?: number;
}
export declare class SqlUtil {
    readonly initSqls?: string[];
    static readonly DIALECT_PG = "pg";
    static readonly DIALECT_MYSQL = "mysql";
    static readonly DIALECT_SQLITE = "sqlite";
    /**
     *
     */
    protected static readonly _dialectNormalizeMap: {
        pg: RegExp;
        mysql: RegExp;
        sqlite: RegExp;
    };
    /**
     *
     */
    readonly dialect: string;
    /**
     * Injectnutelny "pool" or "client" instance... primarne tu ide o to, aby som mohol
     * vyuzivat transakcie a teda injectnut konkretnu instanciu klienta...
     */
    protected _db: any;
    /**
     * lazy initiate just once helper flag
     */
    protected _initiated: boolean;
    /**
     * @param dialect
     * @param db
     * @param initSqls
     */
    constructor(dialect: string, db?: any, initSqls?: string[]);
    /**
     * @private
     */
    _lazyInitOnce(): Promise<void>;
    static normalizeDialectName(dialect: any): any;
    /**
     * @param driverProxy
     */
    set db(driverProxy: any);
    /**
     * @returns {any}
     */
    get db(): any;
    /**
     * @param driverProxy
     * @param initSqls
     */
    static pg(driverProxy?: any, initSqls?: string[]): SqlUtil;
    /**
     * @param driverProxy
     * @param initSqls
     */
    static mysql(driverProxy?: any, initSqls?: string[]): SqlUtil;
    /**
     * @param driverProxy
     * @param initSqls
     */
    static sqlite(driverProxy?: any, initSqls?: string[]): SqlUtil;
    /**
     * @returns {boolean}
     */
    isPg(): boolean;
    /**
     * @returns {boolean}
     */
    isMysql(): boolean;
    /**
     *
     */
    isSqlite(): boolean;
    /**
     * @param {string} column
     * @param {boolean} forceNOT
     * @returns {{column: string; sign: string}}
     * @private
     */
    protected _getOptionalSignFromColNotation(column: string, forceNOT?: boolean): {
        column: string;
        sign: string;
    };
    /**
     * @param columnMaybeWithSign
     * @returns {{column: string; sign: string}}
     */
    getSignFromColNotation(columnMaybeWithSign: any): {
        column: string;
        sign: string;
    };
    /**
     * Toto vysklada z where "AND $k = $v" podmienku... s tym, ze pozna rozne
     * notacie a aj nejake carovne stringy... pridana hodnota oproti rucnemu
     * vyskladaniu je automaticke quotovanie (ak $where je pole)... mozne pouzitie:
     *
     * where                  ---> sql
     * ------------------------------------------------------
     * "id = 1"               ---> id = 1
     * {"id":   1}            ---> id = '1'
     * {"id" :  [1,2]}        ---> id IN ('1','2')
     * {"id!":  1}            ---> id <> '1'
     * {"id<":  1}            ---> id < '1'
     * {"id<=": 1}            ---> id <= '1'
     * {"id!":  [1,2]}        ---> id NOT IN ('1','2')
     * {"id~":  'abc'}        ---> id ILIKE 'abc'
     * {"id!~": 'abc'}        ---> id NOT ILIKE 'abc'
     * {"=":    "untouched"}  ---> untouched
     *
     * @param {string | Object} where
     * @param {string} operator
     * @returns {string}
     */
    buildWhere(where: string | object, operator?: string): string;
    /**
     * @param addons
     * @returns {string}
     */
    buildAddons(addons?: SqlUtilFetchOptions): string;
    /**
     * qoute value in postgres dialect
     * https://github.com/segmentio/pg-escape
     * @param val
     * @returns {any}
     * @private
     */
    protected _qvPg(val: any): any;
    /**
     * @param val
     * @returns {any}
     * @private
     */
    protected _qvMysql(val: any): any;
    /**
     * @param val
     * @private
     */
    protected _qvSqlite(val: any): string;
    /**
     * "qv" = quote value
     * @param val
     * @returns {string}
     */
    qv(val: any): any;
    /**
     * quote identifier in postgres dialect
     * https://github.com/segmentio/pg-escape
     * @param id
     * @returns {string}
     * @private
     */
    protected _qiPg(id: any): string;
    /**
     * @param id
     * @returns {any}
     * @private
     */
    protected _qiMysql(id: any): any;
    /**
     * @param id
     * @private
     */
    protected _qiSqlite(id: any): string;
    /**
     * "qi" = quote identifier
     * @param val
     * @returns {string}
     */
    qi(val: any): any;
    /**
     * execute "raw" query
     * @param query
     * @param params
     * @param {boolean} debug
     * @returns {Promise<void>}
     */
    query(query: any, params?: any, debug?: boolean): Promise<any>;
    /**
     * @param {string} fields
     * @param {string} table
     * @param where
     * @param options
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    fetchRow(fields: string, table: string, where?: any, options?: SqlUtilFetchOptions, debug?: boolean): Promise<any>;
    /**
     * First col (via Object.keys...) of first row
     * @param {string} field
     * @param {string} table
     * @param where
     * @param options
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    fetchOne(field: string, table: string, where?: any, options?: SqlUtilFetchOptions, debug?: boolean): Promise<any>;
    /**
     * @param {string} fields
     * @param {string} table
     * @param where
     * @param options
     * @param {boolean} debug
     * @returns {Promise<any[]>}
     */
    fetchAll(fields: string, table: string, where?: any, options?: SqlUtilFetchOptions, debug?: boolean): Promise<any>;
    /**
     * @param {string} fields
     * @param {string} table
     * @param where
     * @param options
     * @param {boolean} debug
     * @returns {Promise<any[]>}
     * @private
     */
    protected _fetchAll(fields: string, table: string, where?: any, options?: SqlUtilFetchOptions, debug?: boolean): Promise<any>;
    /**
     * @param {string} table
     * @param where
     * @param {boolean} debug
     * @returns {Promise<number>}
     */
    fetchCount(table: string, where?: any, debug?: boolean): Promise<number>;
    /**
     * WARNING: return value depends on the driver...
     * @param {string} table
     * @param data
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    insert(table: string, data: any, debug?: boolean): Promise<any>;
    /**
     * WARNING: return value depends on the driver...
     * @param {string} table
     * @param data
     * @param where
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    update(table: string, data: any, where: any, debug?: boolean): Promise<any>;
    /**
     * @param {string} table
     * @param where
     * @param options
     * @param {boolean} debug
     * @returns {Promise<boolean>}
     */
    delete(table: string, where: any, options?: SqlUtilFetchOptions, debug?: boolean): Promise<any>;
    /**
     * @param {any} name
     * @returns {Promise<any>}
     */
    lastInsertId(name?: any): Promise<number>;
}
