export enum DomainErrorCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  PasswordsDoNotMatch = 'PASSWORDS_DO_NOT_MATCH',
  EmailAlreadyExists = 'EMAIL_ALREADY_EXISTS',
  UserNotFound = 'USER_NOT_FOUND',
  CannotDeleteDefaultUser = 'CANNOT_DELETE_DEFAULT_USER',
  CannotRemoveAdminFromDefaultUser = 'CANNOT_REMOVE_ADMIN_FROM_DEFAULT_USER',
  InvalidUserRequester = 'INVALID_USER_REQUESTER',
}
