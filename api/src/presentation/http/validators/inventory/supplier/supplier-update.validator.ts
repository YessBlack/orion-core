import { UpdateSupplierDTO } from '@/domain/repositories/inventory/ISupplierRepository.js'

type ValidationSuccess<T> = {
  valid: true
  errors: []
  value: T
}

type ValidationFailure = {
  valid: false
  errors: string[]
}

export type SupplierUpdateValidationResult =
  ValidationSuccess<UpdateSupplierDTO> | ValidationFailure

const ALLOWED_FIELDS = new Set([
  'name',
  'taxId',
  'contact',
  'address'
])

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

export const validateSupplierUpdatePayload = (
  payload: unknown
): SupplierUpdateValidationResult => {
  const errors: string[] = []

  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: ['payload must be an object']
    }
  }

  const body = payload as Record<string, unknown>
  const keys = Object.keys(body)

  if (keys.length === 0) {
    return {
      valid: false,
      errors: ['payload must include at least one field to update']
    }
  }

  const invalidFields = keys.filter((key) => !ALLOWED_FIELDS.has(key))
  if (invalidFields.length > 0) {
    errors.push(`payload contains unsupported fields: ${invalidFields.join(', ')}`)
  }

  if ('name' in body && !isNonEmptyString(body.name)) {
    errors.push('name must be a non-empty string')
  }

  if ('taxId' in body && !isNonEmptyString(body.taxId)) {
    errors.push('taxId must be a non-empty string')
  }

  if ('contact' in body && body.contact !== undefined && typeof body.contact !== 'string') {
    errors.push('contact must be a string when provided')
  }

  if ('address' in body && body.address !== undefined && typeof body.address !== 'string') {
    errors.push('address must be a string when provided')
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors
    }
  }

  const value: UpdateSupplierDTO = {}

  if (typeof body.name === 'string') value.name = body.name
  if (typeof body.taxId === 'string') value.taxId = body.taxId
  if (typeof body.contact === 'string') value.contact = body.contact
  if (typeof body.address === 'string') value.address = body.address

  return {
    valid: true,
    errors: [],
    value
  }
}
