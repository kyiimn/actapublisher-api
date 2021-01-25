import express from 'express';
import infoCodeService from '../../services/info/code';

import { Request, Response } from '../../services/session';

export default (app: express.Application) => {
    app.use('/v1/info/code/*', function (req: Request, res, next) {
        if (!req.session?.logined) {
            res.status(403).json({ status: 403, message: '접근 권한이 없습니다.' });
        } else {
            next();
        }
    });
    app.get('/v1/info/code/codeclass', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoCodeService.codeclass(mediaId);
            res.result = result;
        }
        next();
    });
    app.get('/v1/info/code/media', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/local', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/edition', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/section', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/adversize', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/adverlocal', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/color', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/printtype', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/closingtime', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/pagesize', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/font', (req: express.Request, res: express.Response) => {
    });
    app.get('/v1/info/code/textstyle', (req: express.Request, res: express.Response) => {
    });
};