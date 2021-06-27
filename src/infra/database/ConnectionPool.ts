import pgPromise from "pg-promise";

export default class ConnectionPool {
    private static instance: any;
    
    private constructor () {
    }

    static getInstance () {
        if (!ConnectionPool.instance) {
            const pgp = pgPromise({ 
                pgFormatting: true,
				error(err, e) {
					console.error(err);
					if (e.query) {
						console.error("erro na query: ");
						console.error(e.query);
						if (e.params) {
							console.error(e.params);
						}
					}
				}
            });
            pgp.pg.types.setTypeParser(1700, (value) => {
                return parseFloat(value);
            });
            ConnectionPool.instance = pgp({
                user: 'postgres',
                database: 'system',
                password: '123456',
                host: 'localhost',
                port: 5432,
                max: 10,
                idleTimeoutMillis: 0
            });
        }
        const connection = ConnectionPool.instance;
        return connection;
    }

    static query (statement: string, params: any[]): Promise<any> {
        return ConnectionPool.getInstance().query(statement, params);
    }

    static one (statement: string, params: any[]): Promise<any> {
        return ConnectionPool.getInstance().one(statement, params);
    }

	static oneOrNone (statement: string, params: any[]): Promise<any> {
        return ConnectionPool.getInstance().oneOrNone(statement, params);
    }

	static none (statement: string, params: any[]): Promise<any> {
        return ConnectionPool.getInstance().none(statement, params);
    }
}
