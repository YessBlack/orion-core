import { Product } from '@/domain/entities/inventory/Product.js'
import { CreateProductDTO, IProductRepository } from '@/domain/repositories/inventory/IProductStockRepository.js'

export const createProductUseCase = async (
  productRepo: IProductRepository,
  data: CreateProductDTO
): Promise<Product> => {
  const existing = data.id ? await productRepo.findById(data.id) : null

  if (existing) throw new Error(`Ya existe un producto con el ID ${data.id}`)

  return productRepo.create(data)
}
