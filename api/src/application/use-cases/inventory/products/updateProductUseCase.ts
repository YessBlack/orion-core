import { Product } from '@/domain/entities/inventory/Product.js'
import { IProductRepository, UpdateProductDTO } from '@/domain/repositories/inventory/IProductStockRepository.js'

export const updateProductUseCase = async (
  productRepo: IProductRepository,
  id: string,
  data: UpdateProductDTO
): Promise<Product> => {
  const existing = await productRepo.findById(id)
  if (!existing) throw new Error('Producto no encontrado')

  if (data.id && data.id !== existing.id) {
    const idTaken = await productRepo.findById(data.id)
    if (idTaken) throw new Error(`El ID ${data.id} ya está en uso`)
  }

  return productRepo.update(id, data)
}
