import pgPromise from "pg-promise";

export default class ConnectionPool {
    private static instance: any;
    
    private constructor () {
    }

    static getInstance () {
        if (!ConnectionPool.instance) {
            const pgp = pgPromise({ 
                pgFormatting: true
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
}
