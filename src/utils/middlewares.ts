import { NextFunction, Request, Response } from 'express';

export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (res.headersSent) {
        return next(error);
    }
    console.error('Error - Middleware: \n', error);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
}

export function wrapRequestWithTryCatch<T = unknown, Q = unknown>(
    routeHandler: (
        req: Request<T, {}, {}, Q>,
        res: Response,
        next?: NextFunction,
    ) => void,
) {
    return async function (
        req: Request<T, {}, {}, Q>,
        res: Response,
        next: NextFunction,
    ) {
        try {
            routeHandler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}
