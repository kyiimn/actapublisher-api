import express from 'express';
import codeRouter from './code';

export default (app: express.Application) => {
    codeRouter(app);
};