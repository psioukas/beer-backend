import { Router } from 'express';
import {
    addBeer,
    deleteBeer,
    getAllBeers,
    searchBeer,
    updateRating,
} from '../controllers/beer';
import { wrapRequestWithTryCatch } from '../utils/middlewares';

const beerRouter = Router();

beerRouter.get('/search', wrapRequestWithTryCatch(searchBeer));
beerRouter.get('/list', wrapRequestWithTryCatch(getAllBeers));
beerRouter.post('/', wrapRequestWithTryCatch(addBeer));
beerRouter.post(
    '/update-rating/:beerId',
    wrapRequestWithTryCatch(updateRating),
);
beerRouter.delete('/:beerId', wrapRequestWithTryCatch(deleteBeer));

export default beerRouter;
