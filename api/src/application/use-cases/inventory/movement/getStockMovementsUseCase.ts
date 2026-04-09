import { IStockMovementRepository } from '@/domain/repositories/inventory/IStockMovementRepository.js'

export const getStockMovementsUseCase = async (
  movementRepo: IStockMovementRepository,
  productId: string
) => {
  return movementRepo.findByProductId(productId)
}
