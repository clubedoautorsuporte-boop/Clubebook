type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { success: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, retryAfter: 0 }
  }

  if (entry.count >= limit) {
    return {
      success: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    }
  }

  entry.count++
  return { success: true, retryAfter: 0 }
}

export const rateLimitChat = (ip: string) => rateLimit(`chat:${ip}`, 20, 60_000)
export const rateLimitEbookPlan = (ip: string) => rateLimit(`ebook:${ip}`, 5, 60_000)
export const rateLimitSendPreview = (ip: string) =>
  rateLimit(`preview:${ip}`, 20, 3_600_000)
export const rateLimitReceiver = (ip: string) => rateLimit(`receiver:${ip}`, 10, 60_000)
export const rateLimitPdfDownload = (ip: string) => rateLimit(`pdf:${ip}`, 10, 60_000)
