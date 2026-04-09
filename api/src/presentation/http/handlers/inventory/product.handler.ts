import { Request, Response } from 'express'
import { createProductUseCase } from '@/application/use-cases/inventory/products/createProductUseCase.js'
import { mapError } from '../../shared/error.js'
import { ErrorCode } from '../../shared/constants.js'
import { validateProductCreatePayload } from '../../validators/inventory/product/product-create.validator.js'
import { productRepository } from '@/infrastructure/repositories/inventory/product.repository.js'
import { writeError, writeJSON } from '../../shared/response.js'

export const listProductsHandler = async (req: Request, res: Response) => {
  try {
    const products = await productRepository.list()
    return writeJSON(res, 200, products)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const result = validateProductCreatePayload(req.body)

    if (!result.valid) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: result.errors.join('; '),
        status: 400
      })
    }

    const product = await createProductUseCase(productRepository, result.value)
    return writeJSON(res, 201, product)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id

    if (typeof rawId !== 'string') {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'Product id is required and must be a string',
        status: 400
      })
    }

    const id = rawId.trim()

    if (!id) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'Product id cannot be empty',
        status: 400
      })
    }

    const product = await productRepository.findById(id)

    if (!product) {
      return writeError(res, {
        code: ErrorCode.NotFound,
        message: 'Product not found',
        status: 404
      })
    }
    const updatedProduct = await productRepository.update(id, req.body)
    return writeJSON(res, 200, updatedProduct)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id

    if (typeof rawId !== 'string') {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'Product id is required and must be a string',
        status: 400
      })
    }

    const id = rawId.trim()

    if (!id) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'Product id cannot be empty',
        status: 400
      })
    }

    const product = await productRepository.findById(id)

    if (!product) {
      return writeError(res, {
        code: ErrorCode.NotFound,
        message: 'Product not found',
        status: 404
      })
    }

    await productRepository.remove(id)
    return writeJSON(res, 200, { message: 'Product deleted successfully' })
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}
