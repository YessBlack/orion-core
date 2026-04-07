import { ISupplierRepository } from '@/domain/repositories/inventory/ISupplierRepository.js'

export const getSuppliers = async (supplierRepo: ISupplierRepository) => {
  return supplierRepo.findAll()
}
