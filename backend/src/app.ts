import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './configuration/corsOptions';
import router from './routes/router';
import testEmailRouter from './routes/test-email.routes';
import uploadRouter from './routes/upload.routes';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api', router);
app.use('/api', testEmailRouter);
app.use('/api', uploadRouter);
