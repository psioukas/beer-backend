import { Request } from 'express';
import { FeBeer, NewBeer } from '../models/beer';

export type AddBeerRequest = Request<{}, NewBeer, {}, {}>;

export type UpdateRatingRequest = Request<
    { beerId: string },
    {
        rating: FeBeer['rating'];
    }
>;

export type SearchBeersRequest = Request<{}, {}, {}, { term: string }>;
