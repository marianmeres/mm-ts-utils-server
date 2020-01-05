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
const foo_1 = require("./foo");
exports._sqlUtilTestsAll = {
    '`find` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const service = foo_1.fooService(db);
        const foo = yield service.find(1);
        expect(foo.entityType).toEqual('foo');
        expect(foo.id).toEqual(1);
        expect(foo.bar).toEqual('baz');
        expect(foo.isDirty()).toBeFalsy();
    }),
    '`findWhere` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const service = foo_1.fooService(db);
        const foo = yield service.findWhere({ label: 'foo1' });
        expect(foo.entityType).toEqual('foo');
        expect(foo.id).toEqual(1);
    }),
    '`fetchAll` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const service = foo_1.fooService(db);
        const all = yield service.fetchAll();
        expect(all.length).toEqual(2);
    }),
    '`fetchCount` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const service = foo_1.fooService(db);
        const count = yield service.fetchCount({ label: 'foo1' });
        expect(count).toEqual(1);
    }),
    '`save` (insert) works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const service = foo_1.fooService(db);
        const model = yield service.save(new foo_1.BaseFoo({
            id: 123,
            label: 'hey',
        }, true));
        expect(model.id).toEqual(123);
        expect(model.label).toEqual('hey');
        expect(yield service.dao.fetchCount()).toEqual(3);
    }),
    '`save` (update) works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const service = foo_1.fooService(db);
        const model = yield service.save(new foo_1.BaseFoo({
            id: 1,
            label: 'hey',
        }, true));
        expect(model.id).toEqual(1);
        expect(model.label).toEqual('hey');
        expect(yield service.dao.fetchCount()).toEqual(2);
    }),
    '`delete` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const service = foo_1.fooService(db);
        yield service.delete(1, true);
        expect(yield service.dao.fetchCount()).toEqual(1);
    }),
};
