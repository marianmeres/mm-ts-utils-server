"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TableDao_1 = require("../mm-sql/TableDao");
exports.assertWhereNotString = (where) => {
    if (typeof where === 'string') {
        throw new Error('`where` as string is not supported at model level');
    }
};
/**
 * takes care of common usual use-cases... it's ok to overwrite if special case
 * is needed, and is also OK not to be tied up with the usual cases...
 */
class Service {
    constructor(_db) {
        this._db = _db;
    }
    set db(db) {
        this._db = db;
    }
    get db() {
        if (!this._db) {
            throw new Error('SqlUtil instance not provided');
        }
        return this._db;
    }
    get dao() {
        return new TableDao_1.TableDao(this._tableName, Object.assign({}, { db: this.db }, this._daoOptions || {}));
    }
    /**
     * low level fetcher - to be overridden for custom needs
     * @param pk
     * @param assert
     * @param debug
     * @private
     */
    _fetchRow(pk, assert, debug) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dao.fetchRow(pk, assert, debug);
        });
    }
    /**
     * @param id
     * @param {boolean} assert
     * @param debug
     * @returns {Promise<TModel extends BaseModel>}
     */
    find(id, assert = true, debug) {
        return __awaiter(this, void 0, void 0, function* () {
            let pk = { id };
            if (this._isDeletedColName) {
                pk = Object.assign(Object.assign({}, pk), { [this._isDeletedColName]: 0 });
            }
            const row = yield this._fetchRow(pk, assert, debug);
            return row ? new this._modelCtor(row) : null;
        });
    }
    /**
     * @param where
     * @param {boolean} assert
     * @param debug
     * @returns {Promise<TModel extends BaseModel>}
     */
    findWhere(where, assert = false, debug) {
        return __awaiter(this, void 0, void 0, function* () {
            exports.assertWhereNotString(where);
            if (this._isDeletedColName) {
                where = Object.assign(Object.assign({}, where), { [this._isDeletedColName]: 0 });
            }
            const row = yield this._fetchRow(where, assert, debug);
            return row ? new this._modelCtor(row) : null;
        });
    }
    /**
     * @param where
     * @param options
     * @param debug
     * @returns {Promise<TModel[]>}
     */
    fetchAll(where, options, debug) {
        return __awaiter(this, void 0, void 0, function* () {
            exports.assertWhereNotString(where);
            if (this._isDeletedColName) {
                where = Object.assign(Object.assign({}, where), { [this._isDeletedColName]: 0 });
            }
            let rows = yield this.dao.fetchAll(where, options, debug);
            return rows.map((row) => new this._modelCtor(row));
        });
    }
    /**
     * @param where
     * @returns {Promise<number>}
     */
    fetchCount(where) {
        return __awaiter(this, void 0, void 0, function* () {
            exports.assertWhereNotString(where);
            return this.dao.fetchCount(where);
        });
    }
    /**
     * @param {TModel} model
     * @param debug
     * @returns {Promise<TModel extends BaseModel>}
     */
    save(model, debug) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!model.isDirty()) {
                return model;
            }
            let data = yield this.dao.save(model.toJSONSerialized(), debug);
            model.populate(data);
            // model was just saved...
            model.resetDirty();
            return model;
        });
    }
    /**
     * @todo: implement + test for composite PK
     * @param idOrModel
     * @param {boolean} hard
     * @param debug
     * @returns {Promise<any>}
     */
    delete(idOrModel, hard = false, debug) {
        return __awaiter(this, void 0, void 0, function* () {
            // somewhat naive...
            const id = (typeof idOrModel === 'object') ? idOrModel.id : idOrModel;
            if (!id) {
                throw new Error('(Service.delete) missing required id');
            }
            if (hard || !this._isDeletedColName) {
                return this.dao.delete(id, debug);
            }
            else {
                let { idCol } = this.dao.options;
                let pkData = id;
                // common use case: just id
                if (!Array.isArray(idCol) && /string|number/.test(typeof pkData)) {
                    pkData = { [idCol]: pkData };
                }
                yield this.dao.update({ [this._isDeletedColName]: 1 }, this.dao.buildPkWhereFrom(pkData), debug);
            }
        });
    }
}
exports.Service = Service;
