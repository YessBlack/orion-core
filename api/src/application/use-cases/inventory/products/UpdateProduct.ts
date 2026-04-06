import { Product } from "@/domain/entities/inventory/Product.js"
import { IProductRepository, UpdateProductDTO } from "@/domain/repositories/inventory/IProductStockRepository.js"

export const updateProduct = async (
  productRepo: IProductRepository,
  id: string,
  data: UpdateProductDTO
): Promise<Product> => {

  const existing = await productRepo.findById(id)
  if (!existing) throw new Error('Producto no encontrado')

  if (data.sku && data.sku !== existing.sku) {
    const skuTaken = await productRepo.findBySku(data.sku)
    if (skuTaken) throw new Error(`El SKU ${data.sku} ya está en uso`)
  }

  return productRepo.update(id, data)
}
