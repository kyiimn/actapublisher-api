import express from 'express';
import redis from 'redis';
import { v4 as uuidv4, version as uuidVersion, validate as uuidValidate } from 'uuid';

export type LoginInfo = {
    logined?: boolean,
    mediaId?: number,
    mediaName?: string,
    deptId?: number,
    deptName?: string,
    userId?: number,
    userName?: string,
    level?: number,
    rule?: number
}

type SessionStore = LoginInfo & {
    [key: string]: any
};

export type Request = express.Request & {
    session?: SessionStore,
    sessionId?: string,
    clientId?: string
};

export type Response = express.Response & {
    result?: any,
    resultMessage?: string
};

class ActaSessionManager {
    private static _instance: ActaSessionManager;

    static getInstance() {
        if (!ActaSessionManager._instance) ActaSessionManager._instance = new ActaSessionManager();
        return ActaSessionManager._instance;
    }
    static get in() { return ActaSessionManager.getInstance(); }

    private _redisClient: redis.RedisClient;
    private _sessionExpireTime: number;

    private constructor() {
        const connInfo: redis.ClientOpts = {};
        if (process.env.REDIS_HOST) connInfo.host = process.env.REDIS_HOST;
        if (process.env.REDIS_PORT) connInfo.port = parseInt(process.env.REDIS_PORT, 10);
        if (process.env.REDIS_PASSWD) connInfo.password = process.env.REDIS_PASSWORD;

        this._sessionExpireTime = parseInt(process.env.SESSION_EXPIRE || (60 * 60 * 6).toString(), 10);
        this._redisClient = redis.createClient();
    }

    private _updateStore(req: Request, dataStore: SessionStore) {
        this._redisClient.set(`session:${req.sessionId}:${req.clientId}`, JSON.stringify(dataStore), 'EX', this._sessionExpireTime);
    }

    private async _getStore(req: Request) {
        return new Promise<SessionStore>((r, _) => {
            this._redisClient.get(`session:${req.sessionId}:${req.clientId}`, (err, reply) => {
                let store;
                if (!err) {
                    try { store = JSON.parse(reply || '{}') || {}; }
                    catch (e) { store = {}; }
                } else store = {};
                if (store) this._redisClient.sendCommand('TOUCH', [`session:${req.sessionId}:${req.clientId}`]);

                r(store);
            });
        });
    }

    private _uuidValidate(uuid: string) {
        if (uuidValidate(uuid) && uuidVersion(uuid) === 4) return true;
        return false;
    }

    async session(req: Request, res: Response, next: express.NextFunction) {
        const self = this;

        let clientId = req.cookies.ActaAPIClientID;
        let sessionId = req.cookies.ActaAPISessionID;
        if (!clientId) clientId = uuidv4();
        if (!sessionId) sessionId = uuidv4();

        res.cookie('ActaAPIClientID', clientId, { maxAge: 365 * 24 * 60 * 60 * 1000 });
        res.cookie('ActaAPISessionID', sessionId);

        if (!this._uuidValidate(clientId) || !this._uuidValidate(sessionId)) {
            res.status(406).json({ status: 406, message: '허용되지 않은 접근입니다.' });
            return;
        }
        req.clientId = clientId;
        req.sessionId = sessionId;

        req.session = new Proxy(await this._getStore(req), {
            set(target, prop: string, val: string) {
                target[prop] = val;
                self._updateStore(req, target);
                return true;
            },
            deleteProperty(target, prop: string) {
                delete target[prop];
                self._updateStore(req, target);
                return true;
            }
        });
        next();
    }

    result(req: Request, res: Response) {
        let result: { [key: string]: any } = {};
        if (res.result !== undefined && res.result !== false) {
            result.status = 200;
            result.data = res.result;
        } else if (res.resultMessage) {
            result.status = 500;
        } else {
            result.status = 404;
        }
        if (res.resultMessage) result.message = res.resultMessage;
        result.clientId = req.clientId;

        res.status(result.status).json(result);
    }
}

export default ActaSessionManager.in;