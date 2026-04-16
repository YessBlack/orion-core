import { CreateProductDTO } from '@/domain/repositories/inventory/IProductStockRepository.js'

type ValidationSuccess<T> = {
  valid: true
  errors: []
  value: T
}

type ValidationFailure = {
  valid: false
  errors: string[]
}

export type ProductCreateValidationResult = ValidationSuccess<CreateProductDTO> | ValidationFailure

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

const isNonNegativeNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export const validateProductCreatePayload = (payload: unknown): ProductCreateValidationResult => {
  const errors: string[] = []

  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: ['payload must be an object']
    }
  }

  const body = payload as Record<string, unknown>

  if (!isNonEmptyString(body.sku)) {
    errors.push('sku is required and must be a non-empty string')
  }

  if (!isNonEmptyString(body.name)) {
    errors.push('name is required and must be a non-empty string')
  }

  if (!isNonEmptyString(body.unit)) {
    errors.push('unit is required and must be a non-empty string')
  }

  if (!isNonNegativeNumber(body.unitCost)) {
    errors.push('unitCost is required and must be a number >= 0')
  }

  if (!isNonNegativeNumber(body.salePrice)) {
    errors.push('salePrice is required and must be a number >= 0')
  }

  if (!isNonNegativeNumber(body.minStock)) {
    errors.push('minStock is required and must be a number >= 0')
  }

  if (!isNonNegativeNumber(body.currentStock)) {
    errors.push('currentStock is required and must be a number >= 0')
  }

  if (body.details !== undefined && typeof body.details !== 'string') {
    errors.push('details must be a string when provided')
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors
    }
  }

  const sku = body.sku as string
  const name = body.name as string
  const unit = body.unit as string
  const unitCost = body.unitCost as number
  const salePrice = body.salePrice as number
  const minStock = body.minStock as number
  const currentStock = body.currentStock as number

  return {
    valid: true,
    errors: [],
    value: {
      sku,
      name,
      unit,
      unitCost,
      salePrice,
      minStock,
      currentStock,
      ...(typeof body.details === 'string' ? { details: body.details } : {})
    }
  }
}
