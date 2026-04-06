import { IProductRepository } from "@/domain/repositories/inventory/IProductStockRepository.js"

export const deleteProduct = async (
  productRepo: IProductRepository,
  sku: string
): Promise<void> => {
  const existing = await productRepo.findBySku(sku)

  if (!existing) throw new Error(`No existe un producto con el SKU ${sku}`)

  await productRepo.delete(sku)
}
