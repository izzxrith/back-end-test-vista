import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Prisma } from '@prisma/client';
import { validationResult } from 'express-validator';
import { ErrorResponse } from '../types';

export class AppError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Express 4 doesn't catch rejected promises, so wrap async handlers
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

// Runs after express-validator chains
export const validate: RequestHandler = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const body: ErrorResponse = {
    message: 'Validation failed',
    errors: result.array().map((e) => ({
      field: 'path' in e ? String(e.path) : 'unknown',
      message: String(e.msg),
    })),
  };
  res.status(400).json(body);
};

export const notFound: RequestHandler = (req, res) => {
  const body: ErrorResponse = { message: `Route ${req.method} ${req.originalUrl} not found` };
  res.status(404).json(body);
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message } as ErrorResponse);
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    return res
      .status(409)
      .json({ message: 'A record with that unique value already exists' } as ErrorResponse);
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON body' } as ErrorResponse);
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' } as ErrorResponse);
};
