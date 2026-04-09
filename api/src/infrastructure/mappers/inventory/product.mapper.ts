import { Product } from '@/domain/entities/inventory/Product.js'
import { RecordModel } from 'pocketbase'

export const mapToProduct = (record: RecordModel): Product => {
  return {
    id: record.id,
    sku: record.sku,
    name: record.name,
    details: record.details,
    unit: record.unit,
    unitCost: record.unitCost,
    salePrice: record.salePrice,
    minStock: record.minStock,
    currentStock: record.currentStock,
    createdAt: record.created,
    updatedAt: record.updated
  }
}
