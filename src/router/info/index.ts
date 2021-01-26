import express from 'express';
import accountRouter from './account';
import codeRouter from './code';

export default (app: express.Application) => {
    accountRouter(app);
    codeRouter(app);
};