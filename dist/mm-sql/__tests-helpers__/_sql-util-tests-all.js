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
exports._sqlUtilTestsAll = {
    'buildWhere works': (db) => __awaiter(void 0, void 0, void 0, function* () {
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
            expect(sql).toMatch(rgx);
        });
    }),
    'sign parsing works': (db) => __awaiter(void 0, void 0, void 0, function* () {
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
    }),
    'building addons works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        expect(db.buildAddons({
            group_by: 'foo',
        })).toMatch(/GROUP BY [`"]foo[`"]/);
        expect(db.buildAddons({
            order_by: 'foo',
        })).toEqual('ORDER BY foo');
        expect(db.buildAddons({
            group_by: 'foo',
            order_by: 'foo',
        })).toMatch(/GROUP BY [`"]foo[`"] ORDER BY foo/);
        expect(db.buildAddons({
            order_by: 'foo',
            limit: 10,
            offset: 5,
        })).toEqual('ORDER BY foo LIMIT 10 OFFSET 5');
    }),
    '`fetchRow` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const row = yield db.fetchRow('*', 'foo', { id: 1 });
        expect(row).toBeTruthy();
        expect(row.id).toEqual(1);
    }),
    '`fetchOne` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const id = yield db.fetchOne('id', 'foo', null, {
            order_by: 'id desc',
        });
        expect(id).toEqual(2);
    }),
    '`fetchOne` works (nonexisting record)': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const id = yield db.fetchOne('id', 'foo', { id: 400 });
        expect(id).toEqual(false);
    }),
    '`fetchAll` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const rows = yield db.fetchAll('*', 'foo');
        expect(rows.length).toEqual(2);
    }),
    '`fetchCount` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        const count = yield db.fetchCount('foo');
        expect(count).toEqual(2);
    }),
    '`insert` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield db.insert('foo', { label: 'hovno' });
        if (db.isPg()) {
            expect(res.label).toEqual('hovno'); // inserted row
        }
        else {
            expect(res).toEqual(3); // last insert id
        }
        const row = yield db.fetchRow('*', 'foo', { id: 3 });
        expect(row.label).toEqual('hovno');
        expect(row.id).toEqual(3);
    }),
    '`insert` works (undefined values are converted to nulls)': (db) => __awaiter(void 0, void 0, void 0, function* () {
        // auto increment serial pk
        let res = yield db.insert('foo', { label: 'kokos' });
        if (db.isPg()) {
            expect(res.id).toEqual(3); // inserted row
            expect(res.label).toEqual('kokos'); // inserted row
        }
        else {
            expect(res).toEqual(3); // last insert id
        }
        let row = yield db.fetchRow('*', 'foo', { id: 3 });
        expect(row.id).toEqual(3);
        expect(row.label).toEqual('kokos');
        // komposit pk
        res = yield db.insert('foo2', { id1: 10, id2: 20, label: 'kokos2' });
        if (db.isPg()) {
            expect(res.label).toEqual('kokos2'); // inserted row
        }
        else if (db.isMysql()) {
            // mysql returns 3 here as well, but that is id from the different insert
            // above
        }
        else if (db.isSqlite()) {
            // vracia rowid co je v tomto konkretnom pripade tiez 3
            expect(res).toEqual(3); // last insert id
        }
        row = yield db.fetchRow('*', 'foo2', { id1: 10, id2: 20 });
        expect(row.label).toEqual('kokos2');
    }),
    '`update` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield db.update('foo', { label: 'hovno' }, { id: 1 });
        if (db.isPg()) {
            expect(res.label).toEqual('hovno'); // inserted row
        }
        else if (db.isMysql()) {
            expect(res).toEqual(1); // affected rows
        }
        else {
            expect(res).toEqual(null); //
        }
        const row = yield db.fetchRow('*', 'foo', { id: 1 });
        expect(row.label).toEqual('hovno');
        expect(row.id).toEqual(1);
    }),
    '`update` works (undefined values are converted to nulls)': (db) => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield db.update('foo', { label: void 0 }, { id: 1 });
        if (db.isPg()) {
            expect(res.label).toEqual(null); // inserted row
        }
        else if (db.isMysql()) {
            expect(res).toEqual(1); // affected rows
        }
        else {
            expect(res).toEqual(null); //
        }
        const row = yield db.fetchRow('*', 'foo', { id: 1 });
        expect(row.label).toEqual(null);
        expect(row.id).toEqual(1);
    }),
    'PG ONLY: `update` works (with `col=` sign notation)': (db) => __awaiter(void 0, void 0, void 0, function* () {
        if (db.isPg()) {
            // pri "=" sa nedotykame hodnoty
            yield db.update('foo', { 'label=': `LOWER(TRIM('  hoVNO  '))` }, { id: 1 });
            const row = yield db.fetchRow('*', 'foo', { id: 1 });
            expect(row.label).toEqual('hovno');
            expect(row.id).toEqual(1);
        }
    }),
    '`delete` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        yield db.delete('foo', { id: 1 });
        let rows = yield db.fetchAll('*', 'foo');
        expect(rows.length).toEqual(1);
        expect(rows[0].id).toEqual(2);
    }),
    '`lastInsertId` works': (db) => __awaiter(void 0, void 0, void 0, function* () {
        yield db.insert('foo', { label: 'hovno' });
        let lid = yield db.lastInsertId();
        expect(lid).toEqual(3);
        yield db.insert('foo', { label: 'hovno2' });
        lid = yield db.lastInsertId();
        expect(lid).toEqual(4);
    }),
};
