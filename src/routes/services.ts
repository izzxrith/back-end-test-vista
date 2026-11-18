import { Router } from 'express';
import { body, param } from 'express-validator';
import { prisma } from '../prisma';
import { AppError, asyncHandler, validate } from '../middleware/errorHandler';
import { toServiceResponse } from '../mappers';
import { CreateServiceRequest, ServiceResponse } from '../types';

const router = Router();

router.post(
  '/',
  [
    body('companyId').isInt({ min: 1 }).withMessage('companyId must be a positive integer').toInt(),
    body('name').isString().trim().notEmpty().withMessage('name is required'),
    body('description').isString().trim().notEmpty().withMessage('description is required'),
    body('price').isFloat({ min: 0 }).withMessage('price must be a number >= 0').toFloat(),
    validate,
  ],
  asyncHandler(async (req, res) => {
    const { companyId, name, description, price } = req.body as CreateServiceRequest;

    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new AppError(404, `Company ${companyId} not found`);

    const service = await prisma.service.create({
      data: { companyId, name, description, price },
    });
    const response: ServiceResponse = toServiceResponse(service);
    res.status(201).json(response);
  })
);

router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('id must be a positive integer').toInt(), validate],
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new AppError(404, `Service ${id} not found`);
    const response: ServiceResponse = toServiceResponse(service);
    res.json(response);
  })
);

export default router;
