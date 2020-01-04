// import defaults from 'lodash-es/defaults';
import { SqlUtil } from './SqlUtil';
import { defaults } from 'lodash';

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
export class TableDao {
    protected _options: TableDaoOptions;

    /**
     * Injectable sqlUtil instance (for connection sharing needs, e.g. for transactions)
     */
    protected _db: SqlUtil;

    /**
     * @type {{idCol: string}}
     * @private
     */
    protected _defaultOptions: TableDaoOptions = {
        idCol: 'id',
        autoIncrement: true,
    };

    /**
     * @param {string} tableName
     * @param {TableDaoOptions} options
     */
    constructor(public tableName: string, options?: TableDaoOptions) {
        options = defaults(options || {}, this._defaultOptions);
        if (options.db) {
            this.db = options.db;
            // delete options.db;
        }
        this._options = options;
    }

    /**
     * @param {SqlUtil} sqlUtil
     */
    set db(sqlUtil: SqlUtil) {
        this._db = sqlUtil;
    }

    /**
     * @returns {SqlUtil}
     */
    get db() {
        return this._db;
    }

    /**
     * @param data
     * @returns {{}}
     * @private
     */
    protected _buildPkWhereFrom(data) {
        let { idCol } = this._options;
        if (Array.isArray(idCol)) {
            return (idCol as string[]).reduce((where, k) => {
                where[k] = data[k];
                return where;
            }, {});
        } else {
            return { [idCol]: data[idCol] };
        }
    }

    /**
     * v principe getter na db, akurat o 1 uroven abstrahovany...
     *
     * @param query
     * @param params
     * @param debug
     * @returns {Promise<any>}
     */
    async query(query, params, debug?) {
        return this.db.query(query, params, debug);
    }

    /**
     * @param field
     * @param where
     * @param options
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    async fetchOne(field, where?, options?, debug = false) {
        return this.db.fetchOne(field, this.tableName, where, options, debug);
    }

    /**
     * @param id
     * @param {boolean} assert
     * @param {boolean} debug
     * @returns {Promise<Promise<any>>}
     */
    async find(id, assert = true, debug = false) {
        let { idCol } = this._options;
        let pkData;

        if (Array.isArray(idCol)) {
            pkData = this._buildPkWhereFrom(id);
        } else {
            pkData = { [idCol]: id };
        }

        return this.fetchRow(pkData, assert, debug);
    }

    /**
     * @param where
     * @param {boolean} assert
     * @param {boolean} debug
     * @returns {Promise<void>}
     */
    async fetchRow(where, assert = false, debug = false) {
        const row = await this.db.fetchRow('*', this.tableName, where, null, debug);
        if (assert && !row) {
            throw new Error(`Record not found.`);
        }
        return row;
    }

    /**
     * @param where
     * @param options
     * @param {boolean} debug
     * @returns {Promise<any[]>}
     */
    async fetchAll(where?, options?, debug = false) {
        return this.db.fetchAll('*', this.tableName, where, options, debug);
    }

    /**
     * @param where
     * @param {boolean} debug
     * @returns {Promise<number>}
     */
    async fetchCount(where?, debug = false) {
        return this.db.fetchCount(this.tableName, where, debug);
    }

    /**
     * @param data
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    async save(data, debug = false) {
        let { idCol, autoIncrement } = this._options;

        // let isCompositePk = Array.isArray(idCol);
        let pk = Array.isArray(idCol)
            ? this._buildPkWhereFrom(data)
            : { [idCol]: data[idCol] };

        // DRY helper
        const _handleWriteResult = async (res, wasAmbiguos?) => {
            // pg is `RETURNING *` so no work here...
            if (this.db.isPg()) {
                return res;
            }

            // we had incomplete PK data...
            if (wasAmbiguos) {
                // still no problem, if we're under autoincrement mode...
                if (autoIncrement) {
                    let lid = await this.db.lastInsertId();
                    return await this.fetchRow({ [idCol as any]: lid }, true, debug);
                }
                // here we just dont have enough id data to fetch the actual saved row,
                // but in sane real life usage, this case should not really happen...
                // (and if it does, there's problem somewhere in the above flow)
                return true;
            }

            return await this.fetchRow(pk, true, debug);
        };

        // if we have any key from PK data undefined or null, we safely know this is insert
        let doInsert = false;
        Object.keys(pk).forEach((k) => {
            if (data[k] === null || pk[k] === void 0) {
                delete data[k];
                doInsert = true;
            }
        });

        if (doInsert) {
            let res = await this.insert(data, debug);
            return _handleWriteResult(res, true);
        }

        let count = await this.fetchCount(pk, debug);

        return count
            ? _handleWriteResult(await this.update(data, pk, debug))
            : _handleWriteResult(await this.insert(data, debug));
    }

    /**
     * @param data
     * @param where
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    async update(data, where, debug = false) {
        return this.db.update(this.tableName, data, where, debug);
    }

    /**
     * @param data
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    async insert(data, debug = false) {
        return this.db.insert(this.tableName, data, debug);
    }

    /**
     * @param pkData
     * @param {boolean} debug
     * @returns {Promise<any>}
     */
    async delete(pkData, debug = false) {
        let { idCol } = this._options;

        // common use case: just id
        if (!Array.isArray(idCol) && /string|number/.test(typeof pkData)) {
            pkData = { [idCol]: pkData };
        }

        return this.db.delete(
            this.tableName,
            this._buildPkWhereFrom(pkData),
            null,
            debug
        );
    }
}
