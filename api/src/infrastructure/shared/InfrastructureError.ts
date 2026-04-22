import { InfrastructureErrorCode } from './InfrastructureErrorCode.js'

export type InfrastructureError = Error & {
  readonly isInfrastructureError: true
  readonly code: InfrastructureErrorCode
}

export const createInfrastructureError = (code: InfrastructureErrorCode): InfrastructureError => {
  const error = Object.assign(new Error(code), {
    name: 'InfrastructureError',
    isInfrastructureError: true as const,
    code
  })
  return error
}

export const isInfrastructureError = (error: unknown): error is InfrastructureError => {
  return (
    error instanceof Error &&
    'isInfrastructureError' in error &&
    (error as InfrastructureError).isInfrastructureError === true
  )
}
