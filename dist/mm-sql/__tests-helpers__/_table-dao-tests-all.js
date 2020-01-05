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
const TableDao_1 = require("../TableDao");
const dao = (db) => new TableDao_1.TableDao('foo', { db });
const dao2 = (db) => new TableDao_1.TableDao('foo2', {
    db,
    idCol: ['id1', 'id2'],
    autoIncrement: false,
});
exports._sqlUtilTestsAll = {
    // single pk
    '`find` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao(db);
        const row = yield table.find(1);
        expect(row).toBeTruthy();
        expect(row.id).toEqual(1);
    }),
    '`findWhere` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao(db);
        const row = yield table.fetchRow({ label: 'foo2' });
        expect(row).toBeTruthy();
        expect(row.id).toEqual(2);
    }),
    '`fetchAll` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao(db);
        const rows = yield table.fetchAll(null, { order_by: 'id DESC' });
        expect(rows).toBeTruthy();
        expect(rows[0].id).toEqual(2); // desc
    }),
    '`fetchCount` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao(db);
        const count = yield table.fetchCount();
        expect(count).toEqual(2);
    }),
    '`update` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao(db);
        yield table.update({ label: 'hovno' }, { id: 1 });
        const row = yield table.find(1);
        expect(row.label).toEqual('hovno');
        expect(row.id).toEqual(1);
    }),
    '`insert` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao(db);
        yield table.insert({ label: 'hovno' });
        const row = yield table.find(3);
        expect(row.label).toEqual('hovno');
        expect(row.id).toEqual(3);
    }),
    '`save` (insert) works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao(db);
        let data = yield table.save({ label: 'kokos' });
        expect(data.id).toEqual(3);
        expect(data.label).toEqual('kokos');
    }),
    '`save` (update) works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao(db);
        let data = yield table.save({ id: 1, label: 'kokos' });
        expect(data.id).toEqual(1);
        expect(data.label).toEqual('kokos');
    }),
    '`delete` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao(db);
        yield table.delete(1);
        let rows = yield table.fetchAll();
        expect(rows.length).toEqual(1);
        expect(rows[0].id).toEqual(2);
    }),
    '`fetchOne` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao(db);
        let id = yield table.fetchOne('id', null, { order_by: 'id desc' });
        expect(id).toEqual(2);
    }),
    // foo2, composite pk
    'foo2: `find` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao2(db);
        const row = yield table.find({ id1: 1, id2: 2 });
        expect(row.label).toEqual('foo12');
    }),
    'foo2: `findWhere` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao2(db);
        const row = yield table.fetchRow({ label: 'foo13' });
        expect(row.id2).toEqual(3);
    }),
    'foo2: `fetchAll` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao2(db);
        const rows = yield table.fetchAll(null, { order_by: 'id2 DESC' });
        expect(rows).toBeTruthy();
        expect(rows[0].id2).toEqual(3); // desc
    }),
    'foo2: `fetchCount` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao2(db);
        const count = yield table.fetchCount();
        expect(count).toEqual(2);
    }),
    'foo2: `save` (insert) works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao2(db);
        let data = yield table.save({
            id1: 3,
            id2: 4,
            label: 'kokos',
        });
        expect(data.id2).toEqual(4);
        expect(data.label).toEqual('kokos');
    }),
    'foo2: `save` (update) works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao2(db);
        let data = yield table.save({
            id1: 1,
            id2: 2,
            label: 'kokos',
        });
        expect(data.id1).toEqual(1);
        expect(data.label).toEqual('kokos');
    }),
    'foo2: `delete` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const table = dao2(db);
        yield table.delete({ id1: 1, id2: 2 });
        let rows = yield table.fetchAll();
        expect(rows.length).toEqual(1);
        expect(rows[0].id2).toEqual(3);
    }),
};
