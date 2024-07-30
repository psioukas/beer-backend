import express from 'express';
import beerRouter from './routes/beer';
import morgan from 'morgan';
import Database from './utils/database';
import { errorHandler } from './utils/middlewares';

// Database Connection
Database.init('./db-test.sqlite');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms'),
);
app.use(express.json());

// Routes
app.use('/api/beers', beerRouter);

app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
