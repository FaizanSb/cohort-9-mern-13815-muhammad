import express from 'express';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import logger from './config/logger.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger })); // har request/response automatically log hogi

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running 🚀",
  });
});

app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler); // hamesha sabse last mein

export default app;