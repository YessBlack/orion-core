export const logInternalError = (
  scope: string,
  error: unknown,
  meta?: Record<string, unknown>
) => {
  const errorPayload = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : { value: String(error) }

  console.error(`[${scope}] Internal error:`, {
    ...errorPayload,
    ...meta
  })
}
