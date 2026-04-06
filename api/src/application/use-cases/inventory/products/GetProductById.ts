import { IProductRepository } from "@/domain/repositories/inventory/IProductStockRepository.js"

export const getProductById = async (
  productRepo: IProductRepository,
  id: string
) => {
  const product = await productRepo.findById(id)

  if (!product) throw new Error(`No existe un producto con el ID ${id}`)

  return product
}
