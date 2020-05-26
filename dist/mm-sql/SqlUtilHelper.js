"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlUtilHelper = void 0;
const factory_mysql_driver_proxy_1 = require("./SqlUtilHelper/factory-mysql-driver-proxy");
const factory_sqlite_driver_proxy_1 = require("./SqlUtilHelper/factory-sqlite-driver-proxy");
const factory_pg_driver_proxy_1 = require("./SqlUtilHelper/factory-pg-driver-proxy");
let SqlUtilHelper = /** @class */ (() => {
    class SqlUtilHelper {
        /**
         * @param config
         */
        static factoryMysqlDriverProxy(config) {
            return factory_mysql_driver_proxy_1.factoryMysqlDriverProxy(config);
        }
        /**
         * @param config
         */
        static factoryPgDriverProxy(config) {
            return factory_pg_driver_proxy_1.factoryPgDriverProxy(config);
        }
        /**
         * @param config
         */
        static factorySqliteDriverProxy(config) {
            return factory_sqlite_driver_proxy_1.factorySqliteDriverProxy(config);
        }
        /**
         * Simple helper to replace special placeholders with correct dialect
         * @param sql
         * @param dialect
         */
        static dialectize(sql, dialect) {
            return sql.replace(/(__[A-Z_]+__)/g, (k) => {
                const rep = (SqlUtilHelper.SQL_REPLACE_MAP[k] || {})[dialect];
                return rep !== void 0 ? rep : k;
            });
        }
    }
    /**
     * map of special placeholders with their correct dialect form
     */
    SqlUtilHelper.SQL_REPLACE_MAP = {
        __SERIAL_PRIMARY_KEY__: {
            pg: `SERIAL PRIMARY KEY`,
            sqlite: `INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT`,
            mysql: `INTEGER UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY`,
        },
        __SMALLSERIAL_PRIMARY_KEY__: {
            pg: `SMALLSERIAL PRIMARY KEY`,
            // General error: 1 AUTOINCREMENT is only allowed on an INTEGER PRIMARY KEY
            sqlite: `SMALLINT NOT NULL PRIMARY KEY AUTOINCREMENT`,
            mysql: `INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY`,
        },
        __BIGSERIAL_PRIMARY_KEY__: {
            pg: `BIGSERIAL PRIMARY KEY`,
            // General error: 1 AUTOINCREMENT is only allowed on an INTEGER PRIMARY KEY
            sqlite: `INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT`,
            mysql: `BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY`,
        },
        __UNSIGNED__: {
            pg: ``,
            sqlite: ``,
            mysql: `UNSIGNED`,
        },
        __SIGNED__: {
            pg: ``,
            sqlite: ``,
            mysql: `SIGNED`,
        },
        __TIMESTAMP__: {
            pg: `TIMESTAMP WITH TIME ZONE`,
            sqlite: `TIMESTAMP`,
            mysql: `DATETIME`,
        },
        __TIMESTAMP_DEFAULT_NOW__: {
            pg: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`,
            sqlite: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
            mysql: `DATETIME DEFAULT CURRENT_TIMESTAMP`,
        },
        __BOOL__: {
            pg: `SMALLINT`,
            sqlite: `INTEGER`,
            mysql: `TINYINT UNSIGNED`,
        },
        __TINYINT__: {
            pg: `SMALLINT`,
            sqlite: `INTEGER`,
            mysql: `TINYINT`,
        },
        __MEDIUMTEXT__: {
            pg: `TEXT`,
            sqlite: `TEXT`,
            mysql: `MEDIUMTEXT`,
        },
        __LONGTEXT__: {
            pg: `TEXT`,
            sqlite: `TEXT`,
            mysql: `LONGTEXT`,
        },
        __BLOB__: {
            pg: `BYTEA`,
            sqlite: `BLOB`,
            mysql: `BLOB`,
        },
        __LONGBLOB__: {
            pg: `BYTEA`,
            sqlite: `BLOB`,
            mysql: `LONGBLOB`,
        },
        __ENGINE_INNODB__: {
            pg: ``,
            sqlite: ``,
            mysql: ` ENGINE=InnoDb `,
        },
        __ENGINE_MYISAM__: {
            pg: ``,
            sqlite: ``,
            mysql: ` ENGINE=MyISAM `,
        },
        __DROP_TABLE_CASCADE__: {
            pg: `CASCADE`,
            sqlite: ``,
            mysql: `CASCADE`,
        },
        __DEFAULT_CHARSET_UTF8__: {
            pg: ``,
            sqlite: ``,
            mysql: ` DEFAULT CHARSET=utf8 `,
        },
        __CHARSET_UTF8_PER_COL__: {
            pg: ``,
            sqlite: ``,
            mysql: ` CHARACTER SET utf8 `,
        },
        __COLLATION_UTF8_BIN__: {
            pg: ``,
            sqlite: ``,
            mysql: ` COLLATE=utf8_bin `,
        },
        __COLLATION_UTF8_BIN_PER_COL__: {
            pg: ``,
            sqlite: ``,
            mysql: ` COLLATE utf8_bin `,
        },
        __ZERO_TIMESTAMP__: {
            pg: `1970-01-01 00:00:00+00`,
            sqlite: `0000-00-00 00:00:00`,
            mysql: `0000-00-00 00:00:00`,
        },
        __QI__: {
            pg: `"`,
            sqlite: `"`,
            mysql: '`',
        },
        __XML__: {
            pg: `XML`,
            sqlite: `TEXT`,
            mysql: `TEXT`,
        },
        __JSON__: {
            pg: `JSONB`,
            sqlite: `TEXT`,
            mysql: `TEXT`,
        },
        __COMMENT_EXCEPT_PG__: {
            pg: ``,
            sqlite: `-- `,
            mysql: `-- `,
        },
        __COMMENT_EXCEPT_SQLITE__: {
            pg: `-- `,
            sqlite: ``,
            mysql: `-- `,
        },
        __COMMENT_EXCEPT_MYSQL__: {
            pg: `-- `,
            sqlite: `-- `,
            mysql: ``,
        },
    };
    return SqlUtilHelper;
})();
exports.SqlUtilHelper = SqlUtilHelper;
