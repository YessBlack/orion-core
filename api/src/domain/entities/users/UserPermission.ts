import { AccessLevel } from '../../shared/AccessLevel.js'

export enum AppModule {
  Dashboard = 'DASHBOARD',
  Inventory = 'INVENTORY',
  Sales = 'SALES',
  Expenses = 'EXPENSES',
  Users = 'USERS',
}

export interface UserPermission {
  module: AppModule
  level: AccessLevel
}
