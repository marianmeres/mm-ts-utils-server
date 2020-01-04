import * as dotenv from 'dotenv';
import { SqlUtil } from '../SqlUtil';
import { configMysql } from '../../__test-utils__/config-db';
import { SqlUtilHelper } from '../SqlUtilHelper';
import { _initDb } from '../../__test-utils__/init';

dotenv.config();

const driverProxy = SqlUtilHelper.factoryMysqlDriverProxy(configMysql);

beforeEach(async () => _initDb(SqlUtil.mysql(driverProxy)));

test('basic transaction (begin + commit) works', async () => {
    // it is important to make transactions on single client (connection) instance
    const client = await driverProxy.client();
    const db = SqlUtil.mysql(client);

    expect(await db.fetchCount('foo')).toEqual(2);

    // begin + commit
    await db.query('BEGIN');
    await db.delete('foo', { id: 1 });
    expect(await db.fetchCount('foo')).toEqual(1);
    await db.query('COMMIT');

    expect(await db.fetchCount('foo')).toEqual(1);

    driverProxy.clientRelease(client);
});

test('basic transaction (begin + rollback) works', async () => {
    // it is important to make transactions on single client (connection) instance
    const client = await driverProxy.client();
    const db = SqlUtil.mysql(client);

    expect(await db.fetchCount('foo')).toEqual(2);

    // begin + rollback
    await db.query('BEGIN');
    await db.delete('foo', { id: 2 });
    expect(await db.fetchCount('foo')).toEqual(1);
    await db.query('ROLLBACK');

    expect(await db.fetchCount('foo')).toEqual(2);

    driverProxy.clientRelease(client);
});
