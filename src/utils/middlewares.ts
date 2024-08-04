import { NextFunction, Request, Response } from 'express';

export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (res.headersSent) {
        next(error);
        return;
    }
    res.status(500).json({ success: false, message: 'Something went wrong!' });
}

export function wrapRequestWithTryCatch<T = unknown, Q = unknown>(
    routeHandler: (
        req: Request<T, {}, {}, Q>,
        res: Response,
        next?: NextFunction,
    ) => Promise<void> | void,
) {
    return async function (
        req: Request<T, {}, {}, Q>,
        res: Response,
        next: NextFunction,
    ) {
        try {
            await routeHandler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}
