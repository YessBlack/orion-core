import { Supplier } from '@/domain/entities/inventory/Supplier.js'
import { ISupplierRepository, UpdateSupplierDTO } from '@/domain/repositories/inventory/ISupplierRepository.js'

export const updateSupplierUseCase = async (
  supplierRepo: ISupplierRepository,
  id: string,
  data: UpdateSupplierDTO
): Promise<Supplier> => {
  const existing = await supplierRepo.findById(id)
  if (!existing) throw new Error('Proveedor no encontrado')

  if (data.id && data.id !== existing.id) {
    const idTaken = await supplierRepo.findById(data.id)
    if (idTaken) throw new Error(`El ID ${data.id} ya está en uso`)
  }

  return supplierRepo.update(id, data)
}
