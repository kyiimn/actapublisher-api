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
    app.get('/v1/info/code/media', async (req: Request, res: Response, next) => {
        const result = await infoCodeService.media();
        res.result = result;
        next();
    });
    app.get('/v1/info/code/local', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoCodeService.local(mediaId);
            res.result = result;
        }
        next();
    });
    app.get('/v1/info/code/edition', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoCodeService.edition(mediaId);
            res.result = result;
        }
        next();
    });
    app.get('/v1/info/code/section', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoCodeService.section(mediaId);
            res.result = result;
        }
        next();
    });
    app.get('/v1/info/code/adversize', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoCodeService.adversize(mediaId);
            res.result = result;
        }
        next();
    });
    app.get('/v1/info/code/adverlocal', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoCodeService.adverlocal(mediaId);
            res.result = result;
        }
        next();
    });
    app.get('/v1/info/code/color', async (req: Request, res: Response, next) => {
        const result = await infoCodeService.color();
        res.result = result;
        next();
    });
    app.get('/v1/info/code/printtype', async (req: Request, res: Response, next) => {
        const result = await infoCodeService.printtype();
        res.result = result;
        next();
    });
    app.get('/v1/info/code/closingtime', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoCodeService.closingtime(mediaId);
            res.result = result;
        }
        next();
   });
    app.get('/v1/info/code/pagesize', async (req: Request, res: Response, next) => {
        const result = await infoCodeService.pagesize();
        res.result = result;
        next();
    });
    app.get('/v1/info/code/font', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoCodeService.font(mediaId);
            res.result = result;
        }
        next();
    });
    app.get('/v1/info/code/textstyle', async (req: Request, res: Response, next) => {
        const mediaId = req.session?.mediaId;
        if (!mediaId) {
            res.resultMessage = '매체정보가 없습니다.';
        } else {
            const result = await infoCodeService.textstyle(mediaId);
            res.result = result;
        }
        next();
    });
};