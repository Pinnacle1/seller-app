/**
 * Common error handler for hooks
 * Can be extended to add toast notifications, Sentry logging, etc.
 */
export function handleError(error: any, context?: string) {
    const message = error?.message || "An unexpected error occurred"
    console.error(`[Error]${context ? ` [${context}]` : ''}:`, message, error)
    return message
}
