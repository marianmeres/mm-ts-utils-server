import * as dotenv from 'dotenv';
import { SqlUtil } from '../SqlUtil';
import { _sqlUtilTestsAll } from '../__tests-helpers__/_table-dao-tests-all';
import { SqlUtilHelper } from '../SqlUtilHelper';
import { testSuiteFactorySqlUtilDialectBased } from '../../__test-utils__/misc';
import { configSqlite } from '../../__test-utils__/config-db';

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

// should not need to edit below
const shouldSkip = () =>
    !dotenv.config().parsed[`MM_TS_TESTING__DB_${db().dialect.toUpperCase()}_DATABASE`];

// actual test suite
testSuiteFactorySqlUtilDialectBased(db(), _sqlUtilTestsAll, shouldSkip);
