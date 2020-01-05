import { BaseModel, BaseModelData } from 'mm-ts-utils';
import { TableDao, TableDaoOptions } from '../mm-sql/TableDao';
import { SqlUtil } from '../mm-sql/SqlUtil';

export const assertWhereNotString = (where) => {
    if (typeof where === 'string') {
        throw new Error('`where` as string is not supported at model level');
    }
};

/**
 * takes care of common usual use-cases... it's ok to overwrite if special case
 * is needed, and is also OK not to be tied up with the usual cases...
 */
export class Service<TModel extends BaseModel<BaseModelData>> {
    protected _tableName: string;

    protected _daoOptions: TableDaoOptions;

    protected _modelCtor: any;

    protected _isDeletedColName: null | string;

    constructor(protected _db?: SqlUtil) {}

    set db(db: SqlUtil | null) {
        this._db = db;
    }

    get db() {
        if (!this._db) {
            throw new Error('SqlUtil instance not provided');
        }
        return this._db;
    }

    get dao() {
        return new TableDao(
            this._tableName,
            Object.assign({}, { db: this.db }, this._daoOptions || {})
        );
    }

    /**
     * low level fetcher - to be overridden for custom needs
     * @param pk
     * @param assert
     * @param debug
     * @private
     */
    protected async _fetchRow(pk, assert, debug) {
        return this.dao.fetchRow(pk, assert, debug);
    }

    /**
     * @param id
     * @param {boolean} assert
     * @param debug
     * @returns {Promise<TModel extends BaseModel>}
     */
    async find(id, assert: boolean = true, debug?): Promise<TModel> {
        let pk = { id };
        if (this._isDeletedColName) {
            pk = { ...pk, [this._isDeletedColName]: 0 };
        }
        const row = await this._fetchRow(pk, assert, debug);
        return row ? new this._modelCtor(row) : null;
    }

    /**
     * @param where
     * @param {boolean} assert
     * @param debug
     * @returns {Promise<TModel extends BaseModel>}
     */
    async findWhere(where, assert: boolean = false, debug?): Promise<TModel> {
        assertWhereNotString(where);
        if (this._isDeletedColName) {
            where = { ...where, [this._isDeletedColName]: 0 };
        }
        const row = await this._fetchRow(where, assert, debug);
        return row ? new this._modelCtor(row) : null;
    }

    /**
     * @param where
     * @param options
     * @param debug
     * @returns {Promise<TModel[]>}
     */
    async fetchAll(where?, options?, debug?): Promise<TModel[]> {
        assertWhereNotString(where);
        if (this._isDeletedColName) {
            where = { ...where, [this._isDeletedColName]: 0 };
        }
        let rows = await this.dao.fetchAll(where, options, debug);
        return (rows as any[]).map((row) => new this._modelCtor(row));
    }

    /**
     * @param where
     * @returns {Promise<number>}
     */
    async fetchCount(where?): Promise<number> {
        assertWhereNotString(where);
        return this.dao.fetchCount(where);
    }

    /**
     * @param {TModel} model
     * @param debug
     * @returns {Promise<TModel extends BaseModel>}
     */
    async save(model: TModel, debug?): Promise<TModel> {
        if (!model.isDirty()) {
            return model;
        }
        let data = await this.dao.save(model.toJSONSerialized(), debug);
        model.populate(data);

        // model was just saved...
        model.resetDirty();

        return model;
    }

    /**
     * @param id
     * @param {boolean} hard
     * @param debug
     * @returns {Promise<any>}
     */
    async delete(id, hard: boolean = false, debug?): Promise<any> {
        if (hard || !this._isDeletedColName) {
            return this.dao.delete(id, debug);
        } else {
            let db = this.dao.db;
            return this.dao.query(
                `
                    UPDATE ${db.qi(this.dao.tableName)} 
                    SET ${db.qi(this._isDeletedColName)} = 1 
                    WHERE id = ${db.qv(id)}
                `
                    .replace(/\s\s+/g, ' ')
                    .trim(),
                null,
                debug
            );
        }
    }
}
