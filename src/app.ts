import cors from 'cors';
import express, {NextFunction, Request, Response} from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import {v1router} from './components/index';
import config from './config';
import {stream} from './config/winston';
import Exception from './helpers/exception';
import {errorHandler} from './middleware/errorHandler';

const app = express();

if (config.development) {
    app.use(morgan<Request>('combined', {stream}));
} else if (config.production) {
    const requestPerSecond = 2;
    const seconds = 60;
    const windowMs = seconds * 1000;

    app.enable('trust proxy');

    app.use(
        rateLimit({
            windowMs,
            max: seconds * requestPerSecond,
            handler: () => {
                throw new Error('An e=Error occured');
            },
        }),
    );
}

app.use(express.json());
app.use(helmet());
app.use(cors<Request>());

app.get('/health', (_req, res: Response) => res.json({status: 'up'}));

app.use('/v1', v1router);

app.all('*', (_req, _res, next: NextFunction) => {
    next(new Exception('Route not Found!', 404));
});

app.use(errorHandler);

export default app;
