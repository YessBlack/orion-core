import { Router } from 'express'
import {
  listSuppliersHandler,
  createSupplierHandler,
  updateSupplierHandler,
  deleteSupplierHandler
} from '../../handlers/inventory/supplier.handler.js'

const supplierRoutes = Router()

supplierRoutes.get('/suppliers', listSuppliersHandler)
supplierRoutes.post('/suppliers', createSupplierHandler)
supplierRoutes.patch('/suppliers/:id', updateSupplierHandler)
supplierRoutes.delete('/suppliers/:id', deleteSupplierHandler)

export { supplierRoutes }
