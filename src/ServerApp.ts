import express from 'express';
import cors from 'cors';

import router from './router';

import ActaSessionManager from './services/session';
import { Request, Response } from './services/session';

class ActaServerApp {
    private _app: express.Application;

    constructor() {
        this._app = express();

        if (process.env.CORS) {
            this._app.use(cors({
                origin: process.env.CORS,
                optionsSuccessStatus: 200
            }));
        }
        this._app.use((r, s, n) => ActaSessionManager.in.session(r, s, n));
    }

    private router() {
        router(this._app);

        this._app.get('/hello', (_, res: Response) => res.send('hello!'));
        this._app.use((r, s) => ActaSessionManager.in.result(r, s));
    }

    run() {
        this.router();

        this._app.listen(parseInt(process.env.SERVER_PORT || '3000', 10), () => {
            console.log(`Server listening on port ${parseInt(process.env.SERVER_PORT || '3000', 10)}`);
        });
    }
}
export default ActaServerApp;