import { ISupplierRepository } from '@/domain/repositories/inventory/ISupplierRepository.js'

export const deleteSupplierUseCase = async (
  supplierRepo: ISupplierRepository,
  id: string
): Promise<void> => {
  const existing = await supplierRepo.findById(id)

  if (!existing) throw new Error(`No existe un proveedor con el ID ${id}`)

  await supplierRepo.remove(id)
}
