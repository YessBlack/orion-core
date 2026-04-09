import { Product } from '@/domain/entities/inventory/Product.js'
import { CreateProductDTO, IProductRepository, UpdateProductDTO } from '@/domain/repositories/inventory/IProductStockRepository.js'
import { pb } from '@/infrastructure/database/database.js'
import { mapToProduct } from '@/infrastructure/mappers/inventory/product.mapper.js'

const PRODUCT_COLLECTION = 'products'

const findById = async (id: string): Promise<Product | null> => {
  try {
    const record = await pb.collection(PRODUCT_COLLECTION).getOne(id)

    if (!record) return null

    return mapToProduct(record)
  } catch {
    return null
  }
}

const findBySku = async (sku: string): Promise<Product | null> => {
  try {
    const record = await pb
      .collection(PRODUCT_COLLECTION)
      .getFirstListItem(`sku="${sku}"`)

    return mapToProduct(record)
  } catch {
    return null
  }
}

const list = async (): Promise<Product[]> => {
  try {
    const records = await pb.collection(PRODUCT_COLLECTION).getFullList()

    return records.map(mapToProduct)
  } catch {
    return []
  }
}

const findBelowMinStock = async (): Promise<Product[]> => {
  try {
    const records = await pb.collection(PRODUCT_COLLECTION).getFullList({
      filter: 'currentStock < minStock'
    })

    return records.map(mapToProduct)
  } catch {
    return []
  }
}

const create = async (data: CreateProductDTO): Promise<Product> => {
  try {
    const record = await pb.collection(PRODUCT_COLLECTION).create(data)

    return mapToProduct(record)
  } catch {
    throw new Error('Failed to create product')
  }
}

const update = async (id: string, data: UpdateProductDTO): Promise<Product> => {
  try {
    const record = await pb.collection(PRODUCT_COLLECTION).update(id, data)

    return mapToProduct(record)
  } catch {
    throw new Error('Failed to update product')
  }
}
const remove = async (id: string): Promise<void> => {
  try {
    await pb.collection(PRODUCT_COLLECTION).delete(id)
  } catch {
    throw new Error('Failed to remove product')
  }
}

export const productRepository: IProductRepository = {
  findById,
  findBySku,
  list,
  findBelowMinStock,
  create,
  update,
  remove
}
