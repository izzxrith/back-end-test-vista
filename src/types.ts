// Request DTOs
export interface CreateCompanyRequest {
  name: string;
  registrationNumber: string;
}

export interface CreateServiceRequest {
  companyId: number;
  name: string;
  description: string;
  price: number;
}

// Response DTOs
export interface ServiceResponse {
  id: number;
  companyId: number;
  name: string;
  description: string;
  price: number;
}

export interface CompanyResponse {
  id: number;
  name: string;
  registrationNumber: string;
  services: ServiceResponse[];
}

export interface ErrorResponse {
  message: string;
  errors?: { field: string; message: string }[];
}
