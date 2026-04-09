import { IProductRepository } from '@/domain/repositories/inventory/IProductStockRepository.js'

export const getProductByIdUseCase = async (
  productRepo: IProductRepository,
  id: string
) => {
  const product = await productRepo.findById(id)

  if (!product) throw new Error(`No existe un producto con el ID ${id}`)

  return product
}
