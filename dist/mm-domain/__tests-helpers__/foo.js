"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fooAdvService = exports.fooService = exports.BaseFoo = void 0;
const Service_1 = require("../Service");
const mm_ts_utils_1 = require("mm-ts-utils");
class BaseFoo extends mm_ts_utils_1.BaseModel {
    constructor() {
        super(...arguments);
        this.entityType = 'foo';
    }
    get label() {
        return this._get('label');
    }
    set label(v) {
        this._set('label', v);
    }
    get bar() {
        return 'baz';
    }
    get _defaults() {
        return BaseFoo.defaults();
    }
    static defaults() {
        return Object.assign({}, mm_ts_utils_1.BaseModel.defaults(), {
            label: null,
        });
    }
}
exports.BaseFoo = BaseFoo;
// exposed factory
exports.fooService = (db) => new FooService(db);
class FooService extends Service_1.Service {
    constructor() {
        super(...arguments);
        this._tableName = 'foo';
        this._modelCtor = BaseFoo;
    }
}
exports.fooAdvService = (db) => new FooAdvService(db);
class FooAdvService extends FooService {
    constructor() {
        super(...arguments);
        this._isDeletedColName = 'is_deleted';
    }
}
