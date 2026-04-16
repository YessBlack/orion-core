import { Router } from 'express'
import {
  listProductsHandler,
  createProductHandler,
  updateProductHandler
} from '../../handlers/inventory/product.handler.js'
import { stockMovementHandler } from '../../handlers/inventory/stock-movement.handler.js'
import { createAuthMiddleware } from '../../middleware/auth.middleware.js'
import { jwtService } from '@/infrastructure/services/jwt.service.js'

const productRoutes = Router()
const authMiddleware = createAuthMiddleware(jwtService)

productRoutes.get('/products', authMiddleware, listProductsHandler)
productRoutes.post('/products', authMiddleware, createProductHandler)
productRoutes.patch('/products/:id', authMiddleware, updateProductHandler)
productRoutes.post('/products/:id/stock-movement', authMiddleware, stockMovementHandler)

export { productRoutes }
