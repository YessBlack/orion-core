import { Router } from 'express'
import {
  listSuppliersHandler,
  createSupplierHandler,
  updateSupplierHandler,
  deleteSupplierHandler
} from '../../handlers/inventory/supplier.handler.js'
import { createAuthMiddleware } from '../../middleware/auth.middleware.js'
import { jwtService } from '@/infrastructure/services/jwt.service.js'

const supplierRoutes = Router()
const authMiddleware = createAuthMiddleware(jwtService)

supplierRoutes.get('/suppliers', authMiddleware, listSuppliersHandler)
supplierRoutes.post('/suppliers', authMiddleware, createSupplierHandler)
supplierRoutes.patch('/suppliers/:id', authMiddleware, updateSupplierHandler)
supplierRoutes.delete('/suppliers/:id', authMiddleware, deleteSupplierHandler)

export { supplierRoutes }
