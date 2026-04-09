import { UpdateProductDTO } from '@/domain/repositories/inventory/IProductStockRepository.js'

type ValidationSuccess<T> = {
  valid: true
  errors: []
  value: T
}

type ValidationFailure = {
  valid: false
  errors: string[]
}

export type ProductUpdateValidationResult = ValidationSuccess<UpdateProductDTO> | ValidationFailure

const ALLOWED_FIELDS = new Set([
  'sku',
  'name',
  'unit',
  'unitCost',
  'salePrice',
  'minStock',
  'currentStock',
  'details'
])

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

const isNonNegativeNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export const validateProductUpdatePayload = (payload: unknown): ProductUpdateValidationResult => {
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

  if ('sku' in body && !isNonEmptyString(body.sku)) {
    errors.push('sku must be a non-empty string')
  }

  if ('name' in body && !isNonEmptyString(body.name)) {
    errors.push('name must be a non-empty string')
  }

  if ('unit' in body && !isNonEmptyString(body.unit)) {
    errors.push('unit must be a non-empty string')
  }

  if ('unitCost' in body && !isNonNegativeNumber(body.unitCost)) {
    errors.push('unitCost must be a number >= 0')
  }

  if ('salePrice' in body && !isNonNegativeNumber(body.salePrice)) {
    errors.push('salePrice must be a number >= 0')
  }

  if ('minStock' in body && !isNonNegativeNumber(body.minStock)) {
    errors.push('minStock must be a number >= 0')
  }

  if ('currentStock' in body && !isNonNegativeNumber(body.currentStock)) {
    errors.push('currentStock must be a number >= 0')
  }

  if ('details' in body && body.details !== undefined && typeof body.details !== 'string') {
    errors.push('details must be a string when provided')
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors
    }
  }

  const value: UpdateProductDTO = {}

  if (typeof body.sku === 'string') value.sku = body.sku
  if (typeof body.name === 'string') value.name = body.name
  if (typeof body.unit === 'string') value.unit = body.unit
  if (typeof body.unitCost === 'number') value.unitCost = body.unitCost
  if (typeof body.salePrice === 'number') value.salePrice = body.salePrice
  if (typeof body.minStock === 'number') value.minStock = body.minStock
  if (typeof body.currentStock === 'number') value.currentStock = body.currentStock
  if (typeof body.details === 'string') value.details = body.details

  return {
    valid: true,
    errors: [],
    value
  }
}
