import { StockMovement } from '@/domain/entities/inventory/Movement.js'
import { IProductRepository } from '@/domain/repositories/inventory/IProductStockRepository.js'
import { CreateStockMovementDTO, IStockMovementRepository } from '@/domain/repositories/inventory/IStockMovementRepository.js'
import { MovementType } from '@/domain/shared/MovementType.js'

export const registerStockMovementUseCase = async (
  productRepo: IProductRepository,
  movementRepo: IStockMovementRepository,
  data: CreateStockMovementDTO
): Promise<StockMovement> => {
  const product = await productRepo.findById(data.productId)
  if (!product) throw new Error('Producto no encontrado')

  const DECREASES_STOCK = new Set<MovementType>([
    MovementType.Sale,
    MovementType.Waste
  ])

  if (DECREASES_STOCK.has(data.type)) {
    const currentStock = product.currentStock ?? 0
    if (currentStock < data.quantity) {
      throw new Error(`Stock insuficiente. Disponible: ${currentStock}`)
    }
  }

  const movement = await movementRepo.create(data)

  const delta = DECREASES_STOCK.has(data.type) ? -data.quantity : data.quantity
  await productRepo.update(product.id!, {
    currentStock: (product.currentStock ?? 0) + delta
  })

  return movement
}
