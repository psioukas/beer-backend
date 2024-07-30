import { z } from 'zod';

export const BeerIdSchema = z.coerce.number().positive();

export const DbBeerSchema = z.object({
    id: BeerIdSchema,
    name: z.string(),
    type: z.string(),
    rating_sum: z.number().optional().default(0),
    rating_count: z.number().default(0),
    created_on: z.coerce.date().optional(),
    updated_on: z.coerce.date().optional(),
});

export type Beer = z.infer<typeof DbBeerSchema>;

export const RatingSchema = z.coerce.number().min(1).max(5).default(1);

export const NewBeerSchema = z.object({
    name: z.string(),
    type: z.string(),
    rating: RatingSchema.optional(),
});

export type NewBeer = z.infer<typeof NewBeerSchema>;

export const FeBeerSchema = DbBeerSchema.omit({
    created_on: true,
    updated_on: true,
}).transform((inputBeer) => ({
    name: inputBeer.name,
    type: inputBeer.type,
    rating: RatingSchema.parse(
        inputBeer.rating_sum / inputBeer.rating_count,
    ).toFixed(1),
}));

export type FeBeer = z.infer<typeof FeBeerSchema>;
