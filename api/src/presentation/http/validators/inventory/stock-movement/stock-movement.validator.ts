import { CreateStockMovementDTO } from '@/domain/repositories/inventory/IStockMovementRepository.js'
import { MovementType } from '@/domain/shared/MovementType.js'

type ValidationSuccess<T> = {
  valid: true
  errors: []
  value: T
}

type ValidationFailure = {
  valid: false
  errors: string[]
}

export type StockMovementValidationResult =
  ValidationSuccess<CreateStockMovementDTO> | ValidationFailure

const MOVEMENT_TYPES = new Set<string>(Object.values(MovementType))

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

const isPositiveNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

const parseDate = (value: unknown): Date | null => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return null
}

export const validateStockMovementPayload = (
  productId: unknown,
  payload: unknown
): StockMovementValidationResult => {
  const errors: string[] = []

  if (!isNonEmptyString(productId)) {
    errors.push('product id is required and must be a non-empty string')
  }

  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: [...errors, 'payload must be an object']
    }
  }

  const body = payload as Record<string, unknown>

  if (typeof body.type !== 'string' || !MOVEMENT_TYPES.has(body.type)) {
    errors.push(
      `type is required and must be one of: ${Object.values(MovementType).join(', ')}`
    )
  }

  if (!isPositiveNumber(body.quantity)) {
    errors.push('quantity is required and must be a number > 0')
  }

  if (body.detail !== undefined && typeof body.detail !== 'string') {
    errors.push('detail must be a string when provided')
  }

  let parsedDate: Date | null = new Date()
  if (body.date !== undefined) {
    parsedDate = parseDate(body.date)
    if (!parsedDate) {
      errors.push('date must be a valid date when provided')
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors
    }
  }

  const safeProductId = productId as string

  const value: CreateStockMovementDTO = {
    productId: safeProductId,
    type: body.type as MovementType,
    quantity: body.quantity as number,
    date: parsedDate as Date,
    ...(typeof body.detail === 'string' ? { detail: body.detail } : {})
  }

  return {
    valid: true,
    errors: [],
    value
  }
}
