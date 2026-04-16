import { Supplier } from '@/domain/entities/inventory/Supplier.js'
import { CreateSupplierDTO, ISupplierRepository } from '@/domain/repositories/inventory/ISupplierRepository.js'

export const createSupplierUseCase = async (
  supplierRepo: ISupplierRepository,
  data: CreateSupplierDTO
): Promise<Supplier> => {
  const existing = data.id ? await supplierRepo.findById(data.id) : null

  if (existing) throw new Error(`Ya existe un proveedor con el ID ${data.id}`)

  return supplierRepo.create(data)
}
