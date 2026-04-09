import { IProductRepository } from '@/domain/repositories/inventory/IProductStockRepository.js'

export const getProductsUseCase = async (productRepo: IProductRepository) => {
  return productRepo.list()
}
