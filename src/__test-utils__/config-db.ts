import * as dotenv from 'dotenv';
import { DbConfig } from './misc';

dotenv.config();

export const configMysql: DbConfig = {
    host: process.env.MM_TS_TESTING__DB_MYSQL_HOST,
    user: process.env.MM_TS_TESTING__DB_MYSQL_USER,
    password: process.env.MM_TS_TESTING__DB_MYSQL_PASSWORD,
    database: process.env.MM_TS_TESTING__DB_MYSQL_DATABASE,
    port: parseInt(process.env.MM_TS_TESTING__DB_MYSQL_PORT, 10),
};

export const configPg: DbConfig = {
    host: process.env.MM_TS_TESTING__DB_PG_HOST,
    user: process.env.MM_TS_TESTING__DB_PG_USER,
    password: process.env.MM_TS_TESTING__DB_PG_PASSWORD,
    database: process.env.MM_TS_TESTING__DB_PG_DATABASE,
    port: parseInt(process.env.MM_TS_TESTING__DB_PG_PORT, 10),
};

export const configSqlite: DbConfig = {
    database: process.env.MM_TS_TESTING__DB_SQLITE_DATABASE,
    initSqls: ['PRAGMA foreign_keys = ON'],
};
