import { isDomainError } from '@/domain/shared/DomainError.js'
import { isAppError } from '@/application/shared/AppError.js'
import { isInfrastructureError } from '@/infrastructure/shared/InfrastructureError.js'
import { DomainErrorCode } from '@/domain/shared/DomainErrorCode.js'
import { AppErrorCode } from '@/application/shared/AppErrorCode.js'
import { logInternalError } from './logger.js'
import { AppError } from './types.js'
import { ErrorCode } from './constants.js'

const domainErrorMap: Record<DomainErrorCode, AppError> = {
  [DomainErrorCode.EmailAlreadyExists]: {
    code: ErrorCode.Conflict,
    message: 'Ya existe un usuario con ese email',
    status: 409
  },
  [DomainErrorCode.PasswordsDoNotMatch]: {
    code: ErrorCode.BadRequest,
    message: 'Las contraseñas no coinciden',
    status: 400
  },
  [DomainErrorCode.CannotDeleteDefaultUser]: {
    code: ErrorCode.Forbidden,
    message: 'No se puede eliminar el usuario principal',
    status: 403
  },
  [DomainErrorCode.CannotRemoveAdminFromDefaultUser]: {
    code: ErrorCode.Forbidden,
    message: 'No se puede cambiar el rol del usuario principal',
    status: 403
  },
  [DomainErrorCode.InvalidUserRequester]: {
    code: ErrorCode.Forbidden,
    message: 'No tienes permisos para realizar esta acción',
    status: 403
  },

  [DomainErrorCode.InvalidCredentials]: {
    code: ErrorCode.Unauthorized,
    message: 'Credenciales incorrectas',
    status: 401
  },
  [DomainErrorCode.UserNotFound]: {
    code: ErrorCode.NotFound,
    message: 'Recurso no encontrado',
    status: 404
  }
}
const appErrorMap: Record<AppErrorCode, AppError> = {
  [AppErrorCode.InvalidToken]: {
    code: ErrorCode.Unauthorized,
    message: 'Token inválido o expirado',
    status: 401
  },
  [AppErrorCode.InvalidRegisterPayload]: {
    code: ErrorCode.BadRequest,
    message: 'Payload de registro inválido',
    status: 400
  }
}

export const mapError = (error: unknown): AppError => {
  if (isDomainError(error)) {
    return domainErrorMap[error.code] ?? {
      code: ErrorCode.InternalError,
      message: 'Error de negocio desconocido',
      status: 500
    }
  }

  if (isAppError(error)) {
    return appErrorMap[error.code] ?? {
      code: ErrorCode.InternalError,
      message: 'Error de aplicación desconocido',
      status: 500
    }
  }

  if (isInfrastructureError(error)) {
    logInternalError('mapError:infrastructure', error)
    return {
      code: ErrorCode.InternalError,
      message: 'Error interno del servidor',
      status: 500
    }
  }

  logInternalError('mapError:unknown', error)
  return {
    code: ErrorCode.UnknownError,
    message: 'Ha ocurrido un error inesperado',
    status: 500
  }
}
