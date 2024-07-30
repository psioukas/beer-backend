import { Request } from 'express';
import { BeerIdSchema } from '../models/beer';

export function notNullOrUndefined(value: any): boolean {
    return value !== null && value !== undefined;
}

export function getBeerIdFromReq(req: Request) {
    return BeerIdSchema.parse(req.params.beerId);
}
