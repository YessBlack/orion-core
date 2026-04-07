import { MovementType } from '@/domain/shared/MovementType.js'

export interface StockMovement {
  id?: string
  productId: string
  type: MovementType
  quantity: number
  date: Date
  detail?: string
  createdAt?: Date
  updatedAt?: Date
}
