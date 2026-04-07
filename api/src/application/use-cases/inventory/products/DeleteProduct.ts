import { IProductRepository } from '@/domain/repositories/inventory/IProductStockRepository.js'

export const deleteProduct = async (
  productRepo: IProductRepository,
  id: string
): Promise<void> => {
  const existing = await productRepo.findById(id)

  if (!existing) throw new Error(`No existe un producto con el ID ${id}`)

  await productRepo.delete(id)
}
