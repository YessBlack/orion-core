import { Router } from 'express'
import {
  listProductsHandler,
  createProductHandler,
  updateProductHandler
} from '../../handlers/inventory/product.handler.js'
import { stockMovementHandler } from '../../handlers/inventory/stock-movement.handler.js'

const productRoutes = Router()

productRoutes.get('/products', listProductsHandler)
productRoutes.post('/products', createProductHandler)
productRoutes.patch('/products/:id', updateProductHandler)
productRoutes.post('/products/:id/stock-movement', stockMovementHandler)

export { productRoutes }
