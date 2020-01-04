import { SqlUtil } from '../SqlUtil';
import { TableDao } from '../TableDao';

const dao = (db: SqlUtil) => new TableDao('foo', { db });
const dao2 = (db: SqlUtil) =>
    new TableDao('foo2', {
        db,
        idCol: ['id1', 'id2'],
        autoIncrement: false,
    });

export const _sqlUtilTestsAll = {
    // single pk
    '`find` works': async (db: SqlUtil) => {
        const table = dao(db);
        const row = await table.find(1);
        expect(row).toBeTruthy();
        expect(row.id).toEqual(1);
    },

    '`findWhere` works': async (db: SqlUtil) => {
        const table = dao(db);
        const row = await table.fetchRow({ label: 'foo2' });
        expect(row).toBeTruthy();
        expect(row.id).toEqual(2);
    },

    '`fetchAll` works': async (db: SqlUtil) => {
        const table = dao(db);
        const rows = await table.fetchAll(null, { order_by: 'id DESC' });
        expect(rows).toBeTruthy();
        expect(rows[0].id).toEqual(2); // desc
    },

    '`fetchCount` works': async (db: SqlUtil) => {
        const table = dao(db);
        const count = await table.fetchCount();
        expect(count).toEqual(2);
    },

    '`update` works': async (db: SqlUtil) => {
        const table = dao(db);
        await table.update({ label: 'hovno' }, { id: 1 });
        const row = await table.find(1);
        expect(row.label).toEqual('hovno');
        expect(row.id).toEqual(1);
    },

    '`insert` works': async (db: SqlUtil) => {
        const table = dao(db);
        await table.insert({ label: 'hovno' });
        const row = await table.find(3);
        expect(row.label).toEqual('hovno');
        expect(row.id).toEqual(3);
    },

    '`save` (insert) works': async (db: SqlUtil) => {
        const table = dao(db);
        let data = await table.save({ label: 'kokos' });
        expect(data.id).toEqual(3);
        expect(data.label).toEqual('kokos');
    },

    '`save` (update) works': async (db: SqlUtil) => {
        const table = dao(db);
        let data = await table.save({ id: 1, label: 'kokos' });
        expect(data.id).toEqual(1);
        expect(data.label).toEqual('kokos');
    },

    '`delete` works': async (db: SqlUtil) => {
        const table = dao(db);
        await table.delete(1);
        let rows = await table.fetchAll();
        expect(rows.length).toEqual(1);
        expect(rows[0].id).toEqual(2);
    },

    '`fetchOne` works': async (db: SqlUtil) => {
        const table = dao(db);
        let id = await table.fetchOne('id', null, { order_by: 'id desc' });
        expect(id).toEqual(2);
    },

    // foo2, composite pk
    'foo2: `find` works': async (db: SqlUtil) => {
        const table = dao2(db);
        const row = await table.find({ id1: 1, id2: 2 });
        expect(row.label).toEqual('foo12');
    },

    'foo2: `findWhere` works': async (db: SqlUtil) => {
        const table = dao2(db);
        const row = await table.fetchRow({ label: 'foo13' });
        expect(row.id2).toEqual(3);
    },

    'foo2: `fetchAll` works': async (db: SqlUtil) => {
        const table = dao2(db);
        const rows = await table.fetchAll(null, { order_by: 'id2 DESC' });
        expect(rows).toBeTruthy();
        expect(rows[0].id2).toEqual(3); // desc
    },

    'foo2: `fetchCount` works': async (db: SqlUtil) => {
        const table = dao2(db);
        const count = await table.fetchCount();
        expect(count).toEqual(2);
    },

    'foo2: `save` (insert) works': async (db: SqlUtil) => {
        const table = dao2(db);
        let data = await table.save({
            id1: 3,
            id2: 4,
            label: 'kokos',
        });
        expect(data.id2).toEqual(4);
        expect(data.label).toEqual('kokos');
    },

    'foo2: `save` (update) works': async (db: SqlUtil) => {
        const table = dao2(db);
        let data = await table.save({
            id1: 1,
            id2: 2,
            label: 'kokos',
        });
        expect(data.id1).toEqual(1);
        expect(data.label).toEqual('kokos');
    },

    'foo2: `delete` works': async (db: SqlUtil) => {
        const table = dao2(db);
        await table.delete({ id1: 1, id2: 2 });
        let rows = await table.fetchAll();
        expect(rows.length).toEqual(1);
        expect(rows[0].id2).toEqual(3);
    },

    // 'foo2: `` works': async (db: SqlUtil) => {
    //     const table = dao2(db);
    // },
};
