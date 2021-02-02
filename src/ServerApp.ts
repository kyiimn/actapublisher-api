import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from './router';

import ActaSessionManager from './services/session';
import { Request, Response } from './services/session';

class ActaServerApp {
    private _app: express.Application;

    constructor() {
        this._app = express();

        if (process.env.CORS) {
            this._app.use(cors({
                credentials: true,
                origin: process.env.CORS,
                optionsSuccessStatus: 200
            }));
        }
        this._app.use(cookieParser());
        this._app.use((r, s, n) => ActaSessionManager.in.session(r, s, n));
    }

    private async _router() {
        await router(this._app);

        this._app.use('/hello', (_, res: Response) => res.send('hello!'));
        this._app.use((r, s) => ActaSessionManager.in.result(r, s));
    }

    async run() {
        await this._router();
        this._app.listen(parseInt(process.env.SERVER_PORT || '3000', 10), () => {
            console.log(`Server listening on port ${parseInt(process.env.SERVER_PORT || '3000', 10)}`);
        });
    }
}
export default ActaServerApp;