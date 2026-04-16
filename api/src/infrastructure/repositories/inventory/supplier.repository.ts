import { Supplier } from '@/domain/entities/inventory/Supplier.js'
import { CreateSupplierDTO, ISupplierRepository, UpdateSupplierDTO } from '@/domain/repositories/inventory/ISupplierRepository.js'
import { pb } from '@/infrastructure/database/database.js'
import { mapToSupplier } from '@/infrastructure/mappers/inventory/supplier.mapper.js'

const SUPPLIER_COLLECTION = 'Supplier'

const findById = async (id: string): Promise<Supplier | null> => {
  try {
    const record = await pb.collection(SUPPLIER_COLLECTION).getOne(id)

    if (!record) return null

    return mapToSupplier(record)
  } catch {
    return null
  }
}

const list = async (): Promise<Supplier[]> => {
  try {
    const records = await pb.collection(SUPPLIER_COLLECTION).getFullList()

    return records.map(mapToSupplier)
  } catch {
    return []
  }
}

const create = async (data: CreateSupplierDTO): Promise<Supplier> => {
  try {
    const record = await pb.collection(SUPPLIER_COLLECTION).create(data)

    return mapToSupplier(record)
  } catch {
    throw new Error('Failed to create supplier')
  }
}

const update = async (id: string, data: UpdateSupplierDTO): Promise<Supplier> => {
  try {
    const record = await pb.collection(SUPPLIER_COLLECTION).update(id, data)

    return mapToSupplier(record)
  } catch {
    throw new Error('Failed to update supplier')
  }
}

const remove = async (id: string): Promise<void> => {
  try {
    await pb.collection(SUPPLIER_COLLECTION).delete(id)
  } catch {
    throw new Error('Failed to remove supplier')
  }
}

export const supplierRepository: ISupplierRepository = {
  findById,
  list,
  create,
  update,
  remove
}

