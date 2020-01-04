"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
exports.configMysql = {
    host: process.env.MM_TS_TESTING__DB_MYSQL_HOST,
    user: process.env.MM_TS_TESTING__DB_MYSQL_USER,
    password: process.env.MM_TS_TESTING__DB_MYSQL_PASSWORD,
    database: process.env.MM_TS_TESTING__DB_MYSQL_DATABASE,
    port: parseInt(process.env.MM_TS_TESTING__DB_MYSQL_PORT, 10),
};
exports.configPg = {
    host: process.env.MM_TS_TESTING__DB_PG_HOST,
    user: process.env.MM_TS_TESTING__DB_PG_USER,
    password: process.env.MM_TS_TESTING__DB_PG_PASSWORD,
    database: process.env.MM_TS_TESTING__DB_PG_DATABASE,
    port: parseInt(process.env.MM_TS_TESTING__DB_PG_PORT, 10),
};
exports.configSqlite = {
    database: process.env.MM_TS_TESTING__DB_SQLITE_DATABASE,
    initSqls: ['PRAGMA foreign_keys = ON'],
};
