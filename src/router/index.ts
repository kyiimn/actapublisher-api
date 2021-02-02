import express, { Router } from 'express';

import infoRouter from './info';
import loginRouter from './login';
import dataRouter from './data';

export default async (app: express.Application) => {
    await infoRouter(app);
    await loginRouter(app);
    await dataRouter(app);
};