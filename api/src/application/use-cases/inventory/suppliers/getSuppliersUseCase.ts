import { ISupplierRepository } from '@/domain/repositories/inventory/ISupplierRepository.js'

export const getSuppliersUseCase = async (supplierRepo: ISupplierRepository) => {
  return supplierRepo.list()
}
