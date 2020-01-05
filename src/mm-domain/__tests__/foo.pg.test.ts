import * as dotenv from 'dotenv';
dotenv.config();

import { _sqlUtilTestsAll } from '../__tests-helpers__/_foo-tests-all';
import { testSuiteFactorySqlUtilDialectBased } from '../../__test-utils__/misc';
import { configPg } from '../../__test-utils__/config-db';
import { SqlUtil } from '../../mm-sql/SqlUtil';
import { SqlUtilHelper } from '../../mm-sql/SqlUtilHelper';

// main
const db = () => SqlUtil.pg(SqlUtilHelper.factoryPgDriverProxy(configPg));

// should not need to edit below
const shouldSkip = () =>
    !dotenv.config().parsed[
        `MM_TS_TESTING__DB_${db().dialect.toUpperCase()}_DATABASE`
    ];

// actual test suite
testSuiteFactorySqlUtilDialectBased(db(), _sqlUtilTestsAll, shouldSkip);
