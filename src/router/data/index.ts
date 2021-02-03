import express from 'express';
import { IStorageDef, StorageDef } from '../../models/code/storage';
import { Request, Response } from '../../services/session';

import fs from 'fs';

export default async (app: express.Application) => {
    const storageDefs: IStorageDef[] | null = await StorageDef.select();
    if (!storageDefs) return;

    for (const storageDef of storageDefs) {
        if (!fs.existsSync(storageDef.basePath)) fs.mkdirSync(storageDef.basePath);
        const route = `/data/${storageDef.id}`;
        if (storageDef.name !== 'FONT') {
            app.use(route, async (req: Request, res: Response, next) => {
                if (!req.session?.logined || !req.session?.mediaId) {
                    res.status(403).json({ status: 403, message: '접근 권한이 없습니다.' });
                    return;
                }
                next();
            });
        }
        app.use(route, express.static(storageDef.basePath));
    }
};