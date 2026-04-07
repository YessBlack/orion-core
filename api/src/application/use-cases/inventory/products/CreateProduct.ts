import { Product } from '@/domain/entities/inventory/Product.js'
import { CreateProductDTO, IProductRepository } from '@/domain/repositories/inventory/IProductStockRepository.js'

export const createProduct = async (
  productRepo: IProductRepository,
  data: CreateProductDTO
): Promise<Product> => {
  const existing = data.id ? await productRepo.findBySku(data.id) : null

  if (existing) throw new Error(`Ya existe un producto con el SKU ${data.id}`)

  return productRepo.create(data)
}
