export enum AppModule {
  Dashboard = 'DASHBOARD',
  Inventory = 'INVENTORY',
  Sales = 'SALES',
  Expenses = 'EXPENSES',
  Users = 'USERS',
}

export enum PermissionLevel {
  None = 'NONE',
  Read = 'READ',
  Write = 'WRITE',
  Full = 'FULL',
}

export interface UserPermission {
  module: AppModule
  level: PermissionLevel
}
