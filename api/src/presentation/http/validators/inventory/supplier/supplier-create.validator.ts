import { CreateSupplierDTO } from '@/domain/repositories/inventory/ISupplierRepository.js'

type ValidationSuccess<T> = {
  valid: true
  errors: []
  value: T
}

type ValidationFailure = {
  valid: false
  errors: string[]
}

export type SupplierCreateValidationResult =
  ValidationSuccess<CreateSupplierDTO> | ValidationFailure

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

export const validateSupplierCreatePayload = (
  payload: unknown
): SupplierCreateValidationResult => {
  const errors: string[] = []

  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: ['payload must be an object']
    }
  }

  const body = payload as Record<string, unknown>

  if (!isNonEmptyString(body.name)) {
    errors.push('name is required and must be a non-empty string')
  }

  if (!isNonEmptyString(body.taxId)) {
    errors.push('taxId is required and must be a non-empty string')
  }

  if (body.contact !== undefined && typeof body.contact !== 'string') {
    errors.push('contact must be a string when provided')
  }

  if (body.address !== undefined && typeof body.address !== 'string') {
    errors.push('address must be a string when provided')
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors
    }
  }

  const value: CreateSupplierDTO = {
    name: body.name as string,
    taxId: body.taxId as string,
    ...(typeof body.contact === 'string' ? { contact: body.contact } : {}),
    ...(typeof body.address === 'string' ? { address: body.address } : {})
  }

  return {
    valid: true,
    errors: [],
    value
  }
}
