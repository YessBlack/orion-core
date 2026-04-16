import { StockMovement } from '@/domain/entities/inventory/Movement.js'
import { RecordModel } from 'pocketbase'

export const mapToStockMovement = (record: RecordModel): StockMovement => {
  return {
    id: record.id,
    productId: record.productId,
    type: record.type,
    quantity: record.quantity,
    date: new Date(record.date),
    detail: record.detail,
    createdAt: record.created,
    updatedAt: record.updated
  }
}
