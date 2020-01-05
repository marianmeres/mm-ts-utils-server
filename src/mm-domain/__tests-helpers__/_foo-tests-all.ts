import { BaseFoo, fooService } from './foo';
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
};
