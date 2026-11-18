import { CompanyResponse, ServiceResponse } from './types';

interface ServiceRow {
  id: number;
  companyId: number;
  name: string;
  description: string;
  price: { toNumber(): number };
}

interface CompanyRow {
  id: number;
  name: string;
  registrationNumber: string;
  services?: ServiceRow[];
}

// Prisma Decimal -> plain number so the API returns numeric prices
export const toServiceResponse = (s: ServiceRow): ServiceResponse => ({
  id: s.id,
  companyId: s.companyId,
  name: s.name,
  description: s.description,
  price: s.price.toNumber(),
});

export const toCompanyResponse = (c: CompanyRow): CompanyResponse => ({
  id: c.id,
  name: c.name,
  registrationNumber: c.registrationNumber,
  services: (c.services ?? []).map(toServiceResponse),
});
