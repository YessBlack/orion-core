import { StockMovement } from '@/domain/entities/inventory/Movement.js'
import { CreateStockMovementDTO, IStockMovementRepository } from '@/domain/repositories/inventory/IStockMovementRepository.js'
import { MovementType } from '@/domain/shared/MovementType.js'
import { pb } from '@/infrastructure/database/database.js'
import { mapToStockMovement } from '@/infrastructure/mappers/inventory/stockMovement.mapper.js'

const STOCK_MOVEMENT_COLLECTION = 'stock_movements'

const findById = async (id: string): Promise<StockMovement | null> => {
  try {
    const record = await pb.collection(STOCK_MOVEMENT_COLLECTION).getOne(id)
    return mapToStockMovement(record)
  } catch {
    return null
  }
}

const list = async (): Promise<StockMovement[]> => {
  try {
    const records = await pb.collection(STOCK_MOVEMENT_COLLECTION).getFullList()
    return records.map(mapToStockMovement)
  } catch {
    return []
  }
}

const findByProductId = async (productId: string): Promise<StockMovement[]> => {
  try {
    const records = await pb
      .collection(STOCK_MOVEMENT_COLLECTION)
      .getFullList({ filter: `productId="${productId}"` })

    return records.map(mapToStockMovement)
  } catch {
    return []
  }
}

const findByType = async (type: MovementType): Promise<StockMovement[]> => {
  try {
    const records = await pb
      .collection(STOCK_MOVEMENT_COLLECTION)
      .getFullList({ filter: `type="${type}"` })

    return records.map(mapToStockMovement)
  } catch {
    return []
  }
}

const findByDateRange = async (from: Date, to: Date): Promise<StockMovement[]> => {
  try {
    const records = await pb
      .collection(STOCK_MOVEMENT_COLLECTION)
      .getFullList({ filter: `date >= "${from.toISOString()}" && date <= "${to.toISOString()}"` })

    return records.map(mapToStockMovement)
  } catch {
    return []
  }
}

const create = async (data: CreateStockMovementDTO): Promise<StockMovement> => {
  try {
    const record = await pb.collection(STOCK_MOVEMENT_COLLECTION).create(data)
    return mapToStockMovement(record)
  } catch {
    throw new Error('Failed to create stock movement')
  }
}

export const stockMovementRepository: IStockMovementRepository = {
  findById,
  list,
  findByProductId,
  findByType,
  findByDateRange,
  create
}
