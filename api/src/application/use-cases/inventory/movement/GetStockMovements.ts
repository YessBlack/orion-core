import { IStockMovementRepository } from '@/domain/repositories/inventory/IStockMovementRepository.js'

export const getStockMovements = async (
  movementRepo: IStockMovementRepository,
  productId: string
) => {
  return movementRepo.findByProductId(productId)
}
