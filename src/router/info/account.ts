import express from 'express';
import infoAccountService from '../../services/info/account';

import { Request, Response } from '../../services/session';

export default (app: express.Application) => {
    app.use('/v1/info/account/*', function (req: Request, res, next) {
        if (!req.session?.logined) {
            res.status(403).json({ status: 403, message: '접근 권한이 없습니다.' });
        } else {
            next();
        }
    });
    app.get('/v1/info/account/dept', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoAccountService.dept(mediaId);
            res.result = result;
        }
        next();
    });
    app.get('/v1/info/account/user', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoAccountService.user(mediaId);
            res.result = result;
        }
        next();
    });
};