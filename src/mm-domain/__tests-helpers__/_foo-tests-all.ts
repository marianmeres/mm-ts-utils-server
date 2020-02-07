import { BaseFoo, fooAdvService, fooService } from './foo';
import { SqlUtil } from '../../mm-sql/SqlUtil';

export const _sqlUtilTestsAll = {
    '`find` works': async (db: SqlUtil) => {
        const service = fooService(db);
        const foo = await service.find(1);
        expect(foo.entityType).toEqual('foo');
        expect(foo.id).toEqual(1);
        expect(foo.bar).toEqual('baz');
        expect(foo.isDirty()).toBeFalsy();
    },

    '`findWhere` works': async (db: SqlUtil) => {
        const service = fooService(db);
        const foo = await service.findWhere({ label: 'foo1' });
        expect(foo.entityType).toEqual('foo');
        expect(foo.id).toEqual(1);
    },

    '`fetchAll` works': async (db: SqlUtil) => {
        const service = fooService(db);
        const all = await service.fetchAll();
        expect(all.length).toEqual(2);
    },

    '`fetchCount` works': async (db: SqlUtil) => {
        const service = fooService(db);
        const count = await service.fetchCount({ label: 'foo1' });
        expect(count).toEqual(1);
    },

    '`save` (insert) works': async (db: SqlUtil) => {
        const service = fooService(db);
        const model = await service.save(
            new BaseFoo(
                {
                    id: 123,
                    label: 'hey',
                },
                true
            )
        );

        expect(model.isDirty()).toBeFalsy();

        expect(model.id).toEqual(123);
        expect(model.label).toEqual('hey');
        expect(await service.dao.fetchCount()).toEqual(3);
    },

    '`save` (update) works': async (db: SqlUtil) => {
        const service = fooService(db);
        const model = await service.save(
            new BaseFoo(
                {
                    id: 1,
                    label: 'hey',
                },
                true
            )
        );

        expect(model.id).toEqual(1);
        expect(model.label).toEqual('hey');
        expect(await service.dao.fetchCount()).toEqual(2);
    },

    '`delete` works': async (db: SqlUtil) => {
        const service = fooService(db);
        await service.delete(1, true);
        expect(await service.dao.fetchCount()).toEqual(1);
    },

    '`delete` works (with model)': async (db: SqlUtil) => {
        const service = fooService(db);
        const model = await service.save(new BaseFoo({ id: 2, label: 'hey' }, true));

        await service.delete(model, true);
        expect(await service.dao.fetchCount()).toEqual(1);
    },

    '`delete` with `is_deleted` works': async (db: SqlUtil) => {
        await db.query('alter table foo add column is_deleted int default 0');

        const service = fooAdvService(db);
        await service.delete(1, false);

        // raw row must be accessible
        let row = await db.fetchRow('*', 'foo', { id: 1 });
        expect(row.is_deleted).toEqual(1);
        expect(await service.dao.fetchCount()).toEqual(2);

        // but fetch/find must not fetch deleted rows
        let models = await service.fetchAll();
        expect(models.length).toEqual(1);
        expect(models[0].id).toEqual(2);

        let model = await service.find(1, false);
        expect(model).toBeNull();

        model = await service.findWhere({ label: 'foo1' }, false);
        expect(model).toBeNull();
    },

    '`delete` with `is_deleted` and model as parameter works': async (db: SqlUtil) => {
        await db.query('alter table foo add column is_deleted int default 0');
        const service = fooAdvService(db);

        let model = await service.save(new BaseFoo({ id: 1, label: 'hey' }, true));

        await service.delete(model, false);

        // raw row must be accessible
        let row = await db.fetchRow('*', 'foo', { id: 1 });
        expect(row.is_deleted).toEqual(1);
        expect(await service.dao.fetchCount()).toEqual(2);

        // but fetch/find must not fetch deleted rows
        let models = await service.fetchAll();
        expect(models.length).toEqual(1);
        expect(models[0].id).toEqual(2);

        model = await service.find(1, false);
        expect(model).toBeNull();

        model = await service.findWhere({ label: 'foo1' }, false);
        expect(model).toBeNull();
    },
};
