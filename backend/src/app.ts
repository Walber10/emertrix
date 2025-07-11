import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './configuration/corsOptions';
import router from './routes/router';
import uploadRouter from './routes/upload.routes';
import { stripeWebhookRouter } from './routes/stripe-webhook.routes';

export const app = express();

// Handle Stripe webhook BEFORE JSON parsing middleware
app.use('/api/stripe/webhook', stripeWebhookRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api', router);
app.use('/api', uploadRouter);
