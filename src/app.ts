import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/logger';
import { errorHandler, notFound } from './middleware/errorHandler';
import companiesRouter from './routes/companies';
import servicesRouter from './routes/services';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/', (_req, res) => {
  res.json({
    name: 'Vista Test API',
    status: 'running',
    endpoints: [
      'POST /companies',
      'GET /companies',
      'POST /services',
      'GET /services/:id',
      'GET /health',
    ],
  });
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/companies', companiesRouter);
app.use('/services', servicesRouter);

app.use(notFound);
app.use(errorHandler);

export default app;