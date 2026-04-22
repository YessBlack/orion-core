import { DomainErrorCode } from './DomainErrorCode.js'

export type DomainError = Error & {
  readonly isDomainError: true
  readonly code: DomainErrorCode
}

export const createDomainError = (code: DomainErrorCode): DomainError => {
  const error = Object.assign(new Error(code), {
    name: 'DomainError',
    isDomainError: true as const,
    code
  })
  return error
}

export const isDomainError = (error: unknown): error is DomainError => {
  return (
    error instanceof Error &&
    'isDomainError' in error &&
    (error as DomainError).isDomainError === true
  )
}
