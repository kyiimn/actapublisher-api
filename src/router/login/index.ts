import express from 'express';
import loginService from '../../services/login';

import { Request, Response } from '../../services/session';

export default async (app: express.Application) => {
    app.get('/v1/login', async (req: Request, res: Response, next) => {
        res.result = await loginService.getLoginInfo(req);
        next();
    });
};