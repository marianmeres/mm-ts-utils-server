import * as dotenv from 'dotenv';
import { _sqlUtilTestsAll } from '../__tests-helpers__/_sql-util-tests-all';
import { SqlUtil } from '../SqlUtil';
import { configPg } from '../../__test-utils__/config-db';
import { SqlUtilHelper } from '../SqlUtilHelper';
import { testSuiteFactorySqlUtilDialectBased } from '../../__test-utils__/misc';

dotenv.config();

// main
const db = () => SqlUtil.pg(SqlUtilHelper.factoryPgDriverProxy(configPg));

// should not need to edit below
const shouldSkip = () =>
    !dotenv.config().parsed[`MM_TS_TESTING__DB_${db().dialect.toUpperCase()}_DATABASE`];

// actual test suite
testSuiteFactorySqlUtilDialectBased(db(), _sqlUtilTestsAll, shouldSkip);
