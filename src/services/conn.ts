import { Pool, PoolConfig } from 'pg';

class ActaServerDBConnection {
    private static _instance: ActaServerDBConnection;

    static getInstance() {
        if (!ActaServerDBConnection._instance) ActaServerDBConnection._instance = new ActaServerDBConnection();
        return ActaServerDBConnection._instance;
    }
    static get in() { return ActaServerDBConnection.getInstance(); }

    private _pool: Pool;
    private constructor() {
        const connInfo: PoolConfig = {};
        if (process.env.DB_HOST) connInfo.host = process.env.DB_HOST;
        if (process.env.DB_NAME) connInfo.database = process.env.DB_NAME;
        if (process.env.DB_PORT) connInfo.port = parseInt(process.env.DB_PORT, 10);
        if (process.env.DB_USER) connInfo.user = process.env.DB_USER;
        if (process.env.DB_PASSWD) connInfo.password = process.env.DB_PASSWORD;
        
        this._pool = new Pool(connInfo);
    }
    
    async getClient() {
        return this._pool.connect();
    }
}
export default ActaServerDBConnection.in;