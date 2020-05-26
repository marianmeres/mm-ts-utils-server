import { DbConfig } from '../../__test-utils__/misc';
import * as _mysql from 'mysql';
import * as util from 'util';

export const factoryMysqlDriverProxy = (config: DbConfig) => {
    const mysqlPool = _mysql.createPool(
        Object.assign({}, config as any, {
            // force same behavior as pg
            multipleStatements: true,
        })
    );

    /**
     * @param text
     * @param params
     * @returns {Promise<any>}
     */
    const query = async (text, params) => {
        return new Promise((resolve, reject) => {
            mysqlPool.getConnection((err, conn) => {
                if (err) {
                    return reject(err);
                }
                conn.query(text, params || [], (error, results, fields) => {
                    conn.release();
                    // error will be an Error if one occurred during the query
                    if (error) {
                        return reject(error);
                    }
                    // results will contain the results of the query
                    return resolve(results);
                    // fields will contain information about the returned results fields (if any)
                });
            });
        });
    };

    /**
     * WARNING: EXPERIMENTAL!!!
     * @returns {Promise<any>}
     */
    const client = async () => {
        return new Promise((resolve, reject) => {
            mysqlPool.getConnection((err, conn) => {
                if (err) {
                    return reject(err);
                }

                // uff... monkey patch so we have normalized api across drivers...
                conn.query = util.promisify(conn.query) as any;

                return resolve(conn);
            });
        });
    };

    /**
     * @param _client
     * @returns {Promise<void>}
     */
    const clientRelease = async (_client) => {
        _client.release();
        _client = null;
    };

    /**
     * @returns {Promise<void>}
     */
    const poolEnd = async () => mysqlPool.end();

    // prettier-ignore
    return {
        driver: 'mysql', query, client, clientRelease, config, poolEnd, raw: _mysql,
    };
}
