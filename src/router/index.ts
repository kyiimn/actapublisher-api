import express, { Router } from 'express';

import infoRouter from './info';
import loginRouter from './login';

export default (app: express.Application) => {
    infoRouter(app);
    loginRouter(app);
};