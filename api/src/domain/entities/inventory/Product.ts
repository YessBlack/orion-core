export interface Product {
  id?: string
  sku: string
  name: string
  details?: string
  unit: string
  unitCost: number
  salePrice: number
  minStock: number
  currentStock: number
  createdAt?: Date
  updatedAt?: Date
}
