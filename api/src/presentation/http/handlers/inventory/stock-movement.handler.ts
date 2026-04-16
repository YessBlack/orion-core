import { Request, Response } from 'express'
import { registerStockMovementUseCase } from '@/application/use-cases/inventory/movement/registerStockMovementUseCase.js'
import { productRepository } from '@/infrastructure/repositories/inventory/product.repository.js'
import { stockMovementRepository } from '@/infrastructure/repositories/inventory/stockMovement.repository.js'
import { ErrorCode } from '../../shared/constants.js'
import { mapError } from '../../shared/error.js'
import { writeError, writeJSON } from '../../shared/response.js'
import { validateStockMovementPayload } from '../../validators/inventory/stock-movement/stock-movement.validator.js'

export const stockMovementHandler = async (req: Request, res: Response) => {
  try {
    const result = validateStockMovementPayload(req.params.id, req.body)

    if (!result.valid) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: result.errors.join('; '),
        status: 400
      })
    }

    const movement = await registerStockMovementUseCase(
      productRepository,
      stockMovementRepository,
      result.value
    )

    return writeJSON(res, 201, movement)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}
