import * as dotenv from 'dotenv';
import { _sqlUtilTestsAll } from '../__tests-helpers__/_sql-util-tests-all';
import { SqlUtil } from '../SqlUtil';
import { configSqlite } from '../../__test-utils__/config-db';
import { SqlUtilHelper } from '../SqlUtilHelper';
import { testSuiteFactorySqlUtilDialectBased } from '../../__test-utils__/misc';

dotenv.config();

// main
const db = () =>
    SqlUtil.sqlite(
        SqlUtilHelper.factorySqliteDriverProxy({
            ...configSqlite,
            // logger: console.log,
        }),
        configSqlite.initSqls
    );

// test('sqlite sanity', async (done) => {
//     let _db = db();
//     let res;
//
//     await _initDb(_db, false, true);
//
//     //
//     res = await _db.query('select * from foo');
//     console.log(res);
//
//     // res = await _db.query('select 1', void 0, true);
//     // console.log(res);
//     //
//     await mmDelay(500);
//     done();
// });

test.only('`sqlInits` pre-query init works', async (done) => {
    let _db = db();
    let res = await _db.query('PRAGMA foreign_keys');
    expect(res[0].foreign_keys).toEqual(1);
    expect(_db.initSqls.some((v) => /pragma foreign_keys/i.test(v))).toBeTruthy();
    done();
});

test('client is released on error', async (done) => {
    let _db = db();
    let res;

    try {
        res = await _db.query('select * from non_existent_table');
    } catch (e) {
        /**/
    }

    res = await _db.query('select 1');
    done();
});

// should not need to edit below
const shouldSkip = () =>
    !dotenv.config().parsed[`MM_TS_TESTING__DB_${db().dialect.toUpperCase()}_DATABASE`];

// actual test suite
testSuiteFactorySqlUtilDialectBased(db(), _sqlUtilTestsAll, shouldSkip);
