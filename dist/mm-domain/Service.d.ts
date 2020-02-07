import { BaseModel, BaseModelData } from 'mm-ts-utils';
import { TableDao, TableDaoOptions } from '../mm-sql/TableDao';
import { SqlUtil } from '../mm-sql/SqlUtil';
export declare const assertWhereNotString: (where: any) => void;
/**
 * takes care of common usual use-cases... it's ok to overwrite if special case
 * is needed, and is also OK not to be tied up with the usual cases...
 */
export declare class Service<TModel extends BaseModel<BaseModelData>> {
    protected _db?: SqlUtil;
    protected _tableName: string;
    protected _daoOptions: TableDaoOptions;
    protected _modelCtor: any;
    protected _isDeletedColName: null | string;
    constructor(_db?: SqlUtil);
    set db(db: SqlUtil | null);
    get db(): SqlUtil | null;
    get dao(): TableDao;
    /**
     * low level fetcher - to be overridden for custom needs
     * @param pk
     * @param assert
     * @param debug
     * @private
     */
    protected _fetchRow(pk: any, assert: any, debug: any): Promise<any>;
    /**
     * @param id
     * @param assert
     * @param debug
     */
    find(id: any, assert?: boolean, debug?: any): Promise<TModel>;
    /**
     * @param where
     * @param assert
     * @param debug
     */
    findWhere(where: any, assert?: boolean, debug?: any): Promise<TModel>;
    /**
     * @param where
     * @param options
     * @param debug
     */
    fetchAll(where?: any, options?: any, debug?: any): Promise<TModel[]>;
    /**
     * @param where
     * @returns {Promise<number>}
     */
    fetchCount(where?: any): Promise<number>;
    /**
     * @param model
     * @param debug
     */
    save(model: TModel, debug?: any): Promise<TModel>;
    /**
     * @todo: implement + test for composite PK
     * @param idOrModel
     * @param {boolean} hard
     * @param debug
     * @returns {Promise<any>}
     */
    delete(idOrModel: any, hard?: boolean, debug?: any): Promise<any>;
}
