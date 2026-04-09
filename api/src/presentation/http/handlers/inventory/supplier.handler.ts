import { supplierRepository } from '@/infrastructure/repositories/inventory/supplier.repository.js'
import { writeError, writeJSON } from '../../shared/response.js'
import { mapError } from '../../shared/error.js'
import { Request, Response } from 'express'
import { validateSupplierCreatePayload } from '../../validators/inventory/supplier/supplier-create.validator.js'
import { ErrorCode } from '../../shared/constants.js'
import { createSupplierUseCase } from '@/application/use-cases/inventory/suppliers/createSupplierUseCase.js'

export const listSuppliersHandler = async (req: Request, res: Response) => {
  try {
    const suppliers = await supplierRepository.list()
    return writeJSON(res, 200, suppliers)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const createSupplierHandler = async (req: Request, res: Response) => {
  try {
    const result = validateSupplierCreatePayload(req.body)

    if (!result.valid) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: result.errors.join('; '),
        status: 400
      })
    }

    const supplier = await createSupplierUseCase(supplierRepository, result.value)
    return writeJSON(res, 201, supplier)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const updateSupplierHandler = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id

    if (typeof rawId !== 'string') {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'Supplier id is required and must be a string',
        status: 400
      })
    }

    const id = rawId.trim()

    if (!id) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'Supplier id cannot be empty',
        status: 400
      })
    }

    const supplier = await supplierRepository.findById(id)

    if (!supplier) {
      return writeError(res, {
        code: ErrorCode.NotFound,
        message: 'Supplier not found',
        status: 404
      })
    }
    const updatedSupplier = await supplierRepository.update(id, req.body)
    return writeJSON(res, 200, updatedSupplier)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const deleteSupplierHandler = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id

    if (typeof rawId !== 'string') {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'Supplier id is required and must be a string',
        status: 400
      })
    }

    const id = rawId.trim()

    if (!id) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'Supplier id cannot be empty',
        status: 400
      })
    }

    const supplier = await supplierRepository.findById(id)

    if (!supplier) {
      return writeError(res, {
        code: ErrorCode.NotFound,
        message: 'Supplier not found',
        status: 404
      })
    }

    await supplierRepository.remove(id)
    return writeJSON(res, 200, { message: 'Supplier deleted successfully' })
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}
