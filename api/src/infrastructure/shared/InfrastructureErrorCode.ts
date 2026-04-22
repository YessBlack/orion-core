export enum InfrastructureErrorCode {
  FailedToCreateUser = 'FAILED_TO_CREATE_USER',
  FailedToUpdateUser = 'FAILED_TO_UPDATE_USER',
  FailedToRemoveUser = 'FAILED_TO_REMOVE_USER',
  FailedToChangePassword = 'FAILED_TO_CHANGE_PASSWORD',
  DatabaseConnectionFailed = 'DATABASE_CONNECTION_FAILED',
  FailedToListUsers = 'FAILED_TO_LIST_USERS',
  FailedToFindUserById = 'FAILED_TO_FIND_USER_BY_ID',
  FailedToFindUserByEmail = 'FAILED_TO_FIND_USER_BY_EMAIL',
  FailedToAuthenticateUser = 'FAILED_TO_AUTHENTICATE_USER'
}
