import { Router } from 'express';
import { body } from 'express-validator';
import { prisma } from '../prisma';
import { asyncHandler, validate } from '../middleware/errorHandler';
import { toCompanyResponse } from '../mappers';
import { CompanyResponse, CreateCompanyRequest } from '../types';

const router = Router();

router.post(
  '/',
  [
    body('name')
      .isString().withMessage('name must be a string').bail()
      .trim().notEmpty().withMessage('name is required'),
    body('registrationNumber')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('registrationNumber is required'),
    validate,
  ],
  asyncHandler(async (req, res) => {
    const { name, registrationNumber } = req.body as CreateCompanyRequest;
    const company = await prisma.company.create({
      data: { name, registrationNumber },
      include: { services: true },
    });
    const response: CompanyResponse = toCompanyResponse(company);
    res.status(201).json(response);
  })
);

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const companies = await prisma.company.findMany({
      include: { services: true },
      orderBy: { id: 'asc' },
    });
    const response: CompanyResponse[] = companies.map(toCompanyResponse);
    res.json(response);
  })
);

export default router;
