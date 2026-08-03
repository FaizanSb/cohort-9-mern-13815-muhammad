import express from 'express';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import logger from './config/logger.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger })); // har request/response automatically log hogi

app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler); // hamesha sabse last mein

export default app;