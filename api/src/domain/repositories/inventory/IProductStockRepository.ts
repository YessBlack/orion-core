import { Product } from '@/domain/entities/inventory/Product.js'

export type CreateProductDTO = Omit<Product, 'createdAt' | 'updatedAt'>
export type UpdateProductDTO = Partial<CreateProductDTO>

export interface IProductRepository {
  findById(id: string): Promise<Product | null>
  findBySku(sku: string): Promise<Product | null>
  findAll(): Promise<Product[]>
  findBelowMinStock(): Promise<Product[]>
  create(data: CreateProductDTO): Promise<Product>
  update(id: string, data: UpdateProductDTO): Promise<Product>
  delete(id: string): Promise<void>
}
