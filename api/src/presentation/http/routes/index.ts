import { Router } from 'express'
import { productRoutes } from './inventory/product.routes.js'
import { supplierRoutes } from './inventory/supplier.routes.js'
import { userRoutes } from './user/user.routes.js'

const rootRouter = Router()

rootRouter.use('/api/v1', productRoutes)
rootRouter.use('/api/v1', supplierRoutes)
rootRouter.use('/api/v1', userRoutes)

export { rootRouter }
