import { Request, Response } from 'express';
import {
    AddBeerRequest,
    SearchBeersRequest,
    UpdateRatingRequest,
} from '../types/requests';
import {
    Beer,
    FeBeerSchema,
    NewBeerSchema,
    RatingSchema,
} from '../models/beer';
import { z } from 'zod';
import Database from '../utils/database';
import { getBeerIdFromReq } from '../utils';

export async function addBeer(req: AddBeerRequest, res: Response) {
    const newBeer = NewBeerSchema.parse(req.body);

    const insertResult = await Database.getInstance().runSql(
        'INSERT INTO beers (name, type, rating_sum, rating_count) VALUES (?, ?, ?, ?)',
        [
            newBeer.name,
            newBeer.type,
            newBeer.rating,
            Number(Boolean(newBeer.rating)),
        ],
    );

    const result = await Database.getInstance().getOne<Beer>(
        'SELECT * FROM beers WHERE id = ?',
        [insertResult.lastID],
    );

    res.status(200).send({ success: true, result });
}

export async function deleteBeer(req: Request, res: Response) {
    const beerId = getBeerIdFromReq(req);

    const result = await Database.getInstance().runSql(
        `DELETE FROM beers WHERE id = ?`,
        [beerId],
    );

    if (result.changes === 0) {
        return res.status(404).send({ success: false });
    }

    res.status(200).send({ success: true });
}

export async function getAllBeers(_req: Request, res: Response) {
    const dbBeersList =
        await Database.getInstance().getValues<Beer>(`SELECT * FROM beers`);
    const result = z.array(FeBeerSchema).parse(dbBeersList);

    res.status(200).send({ success: true, list: result });
}

export async function updateRating(req: UpdateRatingRequest, res: Response) {
    const beerId = getBeerIdFromReq(req);

    const rating = RatingSchema.parse(req.body.rating);

    const result = await Database.getInstance().runSql(
        `UPDATE beers SET rating_sum = rating_sum + ?, rating_count = rating_count + 1 WHERE id = ?`,
        [rating, beerId],
    );

    if (result.changes > 0) {
        const updatedRecord = await Database.getInstance().getOne<Beer>(
            `SELECT * FROM beers WHERE id = ?`,
            [beerId],
        );

        res.status(200).send({
            success: true,
            beer: FeBeerSchema.parse(updatedRecord),
        });
    } else {
        res.status(400).send({ success: false });
    }
}

export async function searchBeer(req: SearchBeersRequest, res: Response) {
    const searchTerm = req.query.term;

    const sql = 'SELECT * FROM beers WHERE name LIKE ?';

    const searchResults = await Database.getInstance().getValues<Beer>(sql, [
        `%${searchTerm}%`,
    ]);

    res.status(200).send({
        success: true,
        result: searchResults,
        count: searchResults.length,
    });
}
