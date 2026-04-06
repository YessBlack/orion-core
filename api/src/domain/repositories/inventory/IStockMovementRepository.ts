import { StockMovement } from '@/domain/entities/inventory/Movement.js'
import { MovementType } from '@/domain/shared/MovementType.js'

export type CreateStockMovementDTO = Omit<StockMovement, 'id' | 'createdAt'>

export interface IStockMovementRepository {
  findById(id: string): Promise<StockMovement | null>
  findAll(): Promise<StockMovement[]>
  findByProductId(productId: string): Promise<StockMovement[]>
  findByType(type: MovementType): Promise<StockMovement[]>
  findByDateRange(from: Date, to: Date): Promise<StockMovement[]>
  create(data: CreateStockMovementDTO): Promise<StockMovement>
}
