import { SqlUtil } from './SqlUtil';
export interface TableDaoOptions {
    idCol?: string | string[];
    db?: SqlUtil;
    autoIncrement?: boolean;
}
/**
 * adds sugar on top of SqlUtil...:
 *  - PK resolutions
 *  - assertions for existing rows...
 */
export declare class TableDao {
    tableName: string;
    protected _options: TableDaoOptions;
    /**
     * Injectable sqlUtil instance (for connection sharing needs, e.g. for transactions)
     */
    protected _db: SqlUtil;
    /**
     * @type {{idCol: string}}
     * @private
     */
    protected _defaultOptions: TableDaoOptions;
    /**
     * @param {string} tableName
     * @param {TableDaoOptions} options
     */
    constructor(tableName: string, options?: TableDaoOptions);
    /**
     * @param {SqlUtil} sqlUtil
     */
    set db(sqlUtil: SqlUtil);
    /**
     * @returns {SqlUtil}
     */
    get db(): SqlUtil;
    /**
     * @param data
     * @returns {{}}
     * @private
     */
    protected _buildPkWhereFrom(data: any): {};
    /**
     * v principe getter na db, akurat o 1 uroven abstrahovany...
     *
     * @param query
     * @param params
     * @param debug
     * @returns {Promise<any>}
     */
    query(query: any, params: any, debug?: any): Promise<any>;
    /**
     * @param field
     * @param where
     * @param options
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    fetchOne(field: any, where?: any, options?: any, debug?: boolean): Promise<any>;
    /**
     * @param id
     * @param {boolean} assert
     * @param {boolean} debug
     * @returns {Promise<Promise<any>>}
     */
    find(id: any, assert?: boolean, debug?: boolean): Promise<any>;
    /**
     * @param where
     * @param {boolean} assert
     * @param {boolean} debug
     * @returns {Promise<void>}
     */
    fetchRow(where: any, assert?: boolean, debug?: boolean): Promise<any>;
    /**
     * @param where
     * @param options
     * @param {boolean} debug
     * @returns {Promise<any[]>}
     */
    fetchAll(where?: any, options?: any, debug?: boolean): Promise<any>;
    /**
     * @param where
     * @param {boolean} debug
     * @returns {Promise<number>}
     */
    fetchCount(where?: any, debug?: boolean): Promise<number>;
    /**
     * @param data
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    save(data: any, debug?: boolean): Promise<any>;
    /**
     * @param data
     * @param where
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    update(data: any, where: any, debug?: boolean): Promise<any>;
    /**
     * @param data
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    insert(data: any, debug?: boolean): Promise<any>;
    /**
     * @param pkData
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    delete(pkData: any, debug?: boolean): Promise<any>;
}
