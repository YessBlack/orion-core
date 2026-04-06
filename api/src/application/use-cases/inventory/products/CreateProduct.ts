import { Product } from '@/domain/entities/inventory/Product.js'
import { CreateProductDTO, IProductRepository } from '@/domain/repositories/inventory/IProductStockRepository.js'

export const createProduct = async (
  productRepo: IProductRepository,
  data: CreateProductDTO
): Promise<Product> => {
  const existing = await productRepo.findBySku(data.sku)

  if (existing) throw new Error(`Ya existe un producto con el SKU ${data.sku}`)

  return productRepo.create(data)
}
