import { Supplier } from '@/domain/entities/inventory/Supplier.js'
import { RecordModel } from 'pocketbase'

export const mapToSupplier = (record: RecordModel): Supplier => {
  return {
    id: record.id,
    name: record.name,
    taxId: record.taxId,
    contact: record.contact,
    address: record.address,
    createdAt: new Date(record.created),
    updatedAt: new Date(record.updated)
  }
}
