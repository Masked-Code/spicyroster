interface KVGetResponse {
  result: string | null
}

function kvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url, token } : null
}

async function kvGet<T>(key: string): Promise<T | null> {
  const cfg = kvConfig()
  if (!cfg) return null
  try {
    const res = await fetch(`${cfg.url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
    })
    if (!res.ok) return null
    const data = (await res.json()) as KVGetResponse
    if (data.result == null) return null
    try {
      return JSON.parse(data.result) as T
    } catch {
      return data.result as unknown as T
    }
  } catch {
    return null
  }
}

async function kvSet<T>(key: string, value: T): Promise<void> {
  const cfg = kvConfig()
  if (!cfg) return
  const body = new URLSearchParams({ value: JSON.stringify(value) })
  await fetch(`${cfg.url}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
}

export async function getItem<T>(key: string): Promise<T | null> {
  const fromKv = await kvGet<T>(key)
  if (fromKv !== null) return fromKv
  const storage = useStorage()
  const v = await storage.getItem<T>(key)
  return (v as T) ?? null
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  const storage = useStorage()
  await storage.setItem(key, value as any)
  await kvSet(key, value)
}
