import express from 'express';
import accountRouter from './account';
import codeRouter from './code';

export default async (app: express.Application) => {
    await accountRouter(app);
    await codeRouter(app);
};