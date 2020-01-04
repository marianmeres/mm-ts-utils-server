import { SqlUtil } from '../SqlUtil';

export const _sqlUtilTestsAll = {
    'buildWhere works': async (db: SqlUtil) => {
        let cases = [
            [null, /^$/],
            ['kokos', /^kokos$/],
            [{ '=': 'kokos' }, /^kokos$/],
            [
                { foo: null },
                {
                    pg: /^"foo"\s*IS\s+NULL$/,
                    mysql: /^`foo`\s*IS\s+NULL$/,
                    sqlite: /^"foo"\s*IS\s+NULL$/,
                },
            ],
            [
                { 'foo=': null },
                {
                    pg: /^"foo"\s*IS\s+NULL$/,
                    mysql: /^`foo`\s*IS\s+NULL$/,
                    sqlite: /^"foo"\s*IS\s+NULL$/,
                },
            ],
            [
                { 'foo!': null },
                {
                    pg: /^"foo"\s*IS\s+NOT\s+NULL$/,
                    mysql: /^`foo`\s*IS\s+NOT\s+NULL$/,
                    sqlite: /^"foo"\s*IS\s+NOT\s+NULL$/,
                },
            ],
            [
                { 'foo=': 'foo + 1' },
                {
                    pg: /^"foo"\s*=\s*'foo \+ 1'$/,
                    mysql: /^`foo`\s*=\s*'foo \+ 1'$/,
                    sqlite: /^"foo"\s*=\s*'foo \+ 1'$/,
                },
            ],
            [
                { 'foo=': 'CUSTOM_FUNCTION()' },
                {
                    pg: /^"foo"\s*=\s*'CUSTOM_FUNCTION\(\)'$/,
                    mysql: /^`foo`\s*=\s*'CUSTOM_FUNCTION\(\)'$/,
                    sqlite: /^"foo"\s*=\s*'CUSTOM_FUNCTION\(\)'$/,
                },
            ],
            [
                { foo: 123 },
                {
                    pg: /^"foo"\s*=\s*'123'$/,
                    mysql: /^`foo`\s*=\s*123$/,
                    sqlite: /^"foo"\s*=\s*'123'$/,
                },
            ],
            [
                { foo: 'bar' },
                {
                    pg: /^"foo"\s*=\s*'bar'$/,
                    mysql: /^`foo`\s*=\s*'bar'$/,
                    sqlite: /^"foo"\s*=\s*'bar'$/,
                },
            ],
            [
                { 'foo>': 'bar' },
                {
                    pg: /^"foo"\s*>\s*'bar'$/,
                    mysql: /^`foo`\s*>\s*'bar'$/,
                    sqlite: /^"foo"\s*>\s*'bar'$/,
                },
            ],
            [
                { 'foo<=': 'bar' },
                {
                    pg: /^"foo"\s*<=\s*'bar'$/,
                    mysql: /^`foo`\s*<=\s*'bar'$/,
                    sqlite: /^"foo"\s*<=\s*'bar'$/,
                },
            ],
            [
                { 'foo!': 'bar' },
                {
                    pg: /^"foo"\s*<>\s*'bar'$/,
                    mysql: /^`foo`\s*<>\s*'bar'$/,
                    sqlite: /^"foo"\s*<>\s*'bar'$/,
                },
            ],
            [
                { 'foo~': 'bar' },
                {
                    pg: /^"foo"\s*ILIKE\s*'bar'$/,
                    mysql: /^`foo`\s*LIKE\s*'bar'$/,
                    sqlite: /^"foo"\s*LIKE\s*'bar'$/,
                },
            ],
            [
                { 'foo!~': 'bar' },
                {
                    pg: /^"foo"\s*NOT ILIKE\s*'bar'$/,
                    mysql: /^`foo`\s*NOT LIKE\s*'bar'$/,
                    sqlite: /^"foo"\s*NOT LIKE\s*'bar'$/,
                },
            ],
            [
                { foo: ['bar', 'baz'] },
                {
                    pg: /^"foo"\s*IN\s*\('bar',\s*'baz'\)$/,
                    mysql: /^`foo`\s*IN\s*\('bar',\s*'baz'\)$/,
                    sqlite: /^"foo"\s*IN\s*\('bar',\s*'baz'\)$/,
                },
            ],
            [
                { 'foo!': ['bar', 'baz'] },
                {
                    pg: /^"foo"\s*NOT\s*IN\s*\('bar',\s*'baz'\)$/,
                    mysql: /^`foo`\s*NOT\s*IN\s*\('bar',\s*'baz'\)$/,
                    sqlite: /^"foo"\s*NOT\s*IN\s*\('bar',\s*'baz'\)$/,
                },
            ],
            [
                { foo: 'bar', baz: 'bat' },
                {
                    pg: /^"foo"\s*=\s*'bar'\s*AND\s*"baz"\s*=\s*'bat'$/,
                    mysql: /^`foo`\s*=\s*'bar'\s*AND\s*`baz`\s*=\s*'bat'$/,
                    sqlite: /^"foo"\s*=\s*'bar'\s*AND\s*"baz"\s*=\s*'bat'$/,
                },
            ],
            [
                { foo: 'bar', 'baz!': ['bat', 'hey'] },
                {
                    pg: /^"foo"\s*=\s*'bar'\s*AND\s*"baz"\s*NOT\s*IN\s*\('bat',\s*'hey'\)$/,
                    mysql: /^`foo`\s*=\s*'bar'\s*AND\s*`baz`\s*NOT\s*IN\s*\('bat',\s*'hey'\)$/,
                    sqlite: /^"foo"\s*=\s*'bar'\s*AND\s*"baz"\s*NOT\s*IN\s*\('bat',\s*'hey'\)$/,
                },
            ],
        ];

        expect.assertions(cases.length);
        cases.forEach((_case) => {
            let [where, rgx] = _case;
            let sql = db.buildWhere(where);

            rgx = rgx[db.dialect] || rgx;

            expect(sql).toMatch(rgx as any);
        });
    },

    'sign parsing works': async (db: SqlUtil) => {
        const s = db.getSignFromColNotation.bind(db); // shortcut
        let cases = {
            some: '=',
            'some=': '=',
            'some!': '<>',
            'some>': '>',
            'some>=': '>=',
            'some<': '<',
            'some<=': '<=',
            'some~': {
                pg: 'ILIKE',
                mysql: 'LIKE',
                sqlite: 'LIKE',
            },
            'some!~': {
                pg: 'NOT ILIKE',
                mysql: 'NOT LIKE',
                sqlite: 'NOT LIKE',
            },
        };

        expect.assertions(Object.keys(cases).length * 2);

        Object.keys(cases).forEach((k) => {
            let expected = cases[k][db.dialect] || cases[k];
            expect(s(k).sign).toEqual(expected);
            expect(s(k).column).toEqual('some');
        });
    },

    'building addons works': async (db: SqlUtil) => {
        expect(
            db.buildAddons({
                group_by: 'foo',
            })
        ).toMatch(/GROUP BY [`"]foo[`"]/);

        expect(
            db.buildAddons({
                order_by: 'foo',
            })
        ).toEqual('ORDER BY foo');

        expect(
            db.buildAddons({
                group_by: 'foo',
                order_by: 'foo',
            })
        ).toMatch(/GROUP BY [`"]foo[`"] ORDER BY foo/);

        expect(
            db.buildAddons({
                order_by: 'foo',
                limit: 10,
                offset: 5,
            })
        ).toEqual('ORDER BY foo LIMIT 10 OFFSET 5');
    },

    '`fetchRow` works': async (db: SqlUtil) => {
        const row = await db.fetchRow('*', 'foo', { id: 1 });
        expect(row).toBeTruthy();
        expect(row.id).toEqual(1);
    },

    '`fetchOne` works': async (db: SqlUtil) => {
        const id = await db.fetchOne('id', 'foo', null, {
            order_by: 'id desc',
        });
        expect(id).toEqual(2);
    },

    '`fetchOne` works (nonexisting record)': async (db: SqlUtil) => {
        const id = await db.fetchOne('id', 'foo', { id: 400 });
        expect(id).toEqual(false);
    },

    '`fetchAll` works': async (db: SqlUtil) => {
        const rows = await db.fetchAll('*', 'foo');
        expect(rows.length).toEqual(2);
    },

    '`fetchCount` works': async (db: SqlUtil) => {
        const count = await db.fetchCount('foo');
        expect(count).toEqual(2);
    },

    '`insert` works': async (db: SqlUtil) => {
        let res = await db.insert('foo', { label: 'hovno' });

        if (db.isPg()) {
            expect(res.label).toEqual('hovno'); // inserted row
        } else {
            expect(res).toEqual(3); // last insert id
        }

        const row = await db.fetchRow('*', 'foo', { id: 3 });
        expect(row.label).toEqual('hovno');
        expect(row.id).toEqual(3);
    },

    '`insert` works (undefined values are converted to nulls)': async (db: SqlUtil) => {
        // auto increment serial pk
        let res = await db.insert('foo', { label: 'kokos' });
        if (db.isPg()) {
            expect(res.id).toEqual(3); // inserted row
            expect(res.label).toEqual('kokos'); // inserted row
        } else {
            expect(res).toEqual(3); // last insert id
        }

        let row = await db.fetchRow('*', 'foo', { id: 3 });
        expect(row.id).toEqual(3);
        expect(row.label).toEqual('kokos');

        // komposit pk
        res = await db.insert('foo2', { id1: 10, id2: 20, label: 'kokos2' });
        if (db.isPg()) {
            expect(res.label).toEqual('kokos2'); // inserted row
        } else if (db.isMysql()) {
            // mysql returns 3 here as well, but that is id from the different insert
            // above
        } else if (db.isSqlite()) {
            // vracia rowid co je v tomto konkretnom pripade tiez 3
            expect(res).toEqual(3); // last insert id
        }
        row = await db.fetchRow('*', 'foo2', { id1: 10, id2: 20 });
        expect(row.label).toEqual('kokos2');
    },

    '`update` works': async (db: SqlUtil) => {
        let res = await db.update('foo', { label: 'hovno' }, { id: 1 });

        if (db.isPg()) {
            expect(res.label).toEqual('hovno'); // inserted row
        } else if (db.isMysql()) {
            expect(res).toEqual(1); // affected rows
        } else {
            expect(res).toEqual(null); //
        }

        const row = await db.fetchRow('*', 'foo', { id: 1 });
        expect(row.label).toEqual('hovno');
        expect(row.id).toEqual(1);
    },

    '`update` works (undefined values are converted to nulls)': async (db: SqlUtil) => {
        let res = await db.update('foo', { label: void 0 }, { id: 1 });

        if (db.isPg()) {
            expect(res.label).toEqual(null); // inserted row
        } else if (db.isMysql()) {
            expect(res).toEqual(1); // affected rows
        } else {
            expect(res).toEqual(null); //
        }

        const row = await db.fetchRow('*', 'foo', { id: 1 });
        expect(row.label).toEqual(null);
        expect(row.id).toEqual(1);
    },

    'PG ONLY: `update` works (with `col=` sign notation)': async (db: SqlUtil) => {
        if (db.isPg()) {
            // pri "=" sa nedotykame hodnoty
            await db.update('foo', { 'label=': `LOWER(TRIM('  hoVNO  '))` }, { id: 1 });

            const row = await db.fetchRow('*', 'foo', { id: 1 });
            expect(row.label).toEqual('hovno');
            expect(row.id).toEqual(1);
        }
    },

    '`delete` works': async (db: SqlUtil) => {
        await db.delete('foo', { id: 1 });
        let rows = await db.fetchAll('*', 'foo');

        expect(rows.length).toEqual(1);
        expect(rows[0].id).toEqual(2);
    },

    '`lastInsertId` works': async (db: SqlUtil) => {
        await db.insert('foo', { label: 'hovno' });
        let lid = await db.lastInsertId();
        expect(lid).toEqual(3);
        await db.insert('foo', { label: 'hovno2' });
        lid = await db.lastInsertId();
        expect(lid).toEqual(4);
    },

    // 'foo': async (db: SqlUtil) => {},
};
