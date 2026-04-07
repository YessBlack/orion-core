import { IProductRepository } from '@/domain/repositories/inventory/IProductStockRepository.js'

export const getProducts = async (productRepo: IProductRepository) => {
  return productRepo.findAll()
}
