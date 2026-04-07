import { Supplier } from '@/domain/entities/inventory/Supplier.js'

export type CreateSupplierDTO = Omit<Supplier, 'createdAt' | 'updatedAt'>
export type UpdateSupplierDTO = Partial<CreateSupplierDTO>

export interface ISupplierRepository {
  findById(id: string): Promise<Supplier | null>
  findAll(): Promise<Supplier[]>
  create(data: CreateSupplierDTO): Promise<Supplier>
  update(id: string, data: UpdateSupplierDTO): Promise<Supplier>
  delete(id: string): Promise<void>
}
