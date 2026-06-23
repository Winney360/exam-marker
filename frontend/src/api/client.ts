const BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('token')
}

interface ApiEnvelope<T> {
  success: boolean
  data?: T
  error?: string
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let fetchBody: BodyInit | undefined

  if (body instanceof FormData) {
    fetchBody = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    fetchBody = JSON.stringify(body)
  }

  const res = await fetch(`${BASE}${path}`, { method, headers, body: fetchBody })

  if (res.status === 204) return undefined as T

  const envelope: ApiEnvelope<T> = await res.json()

  if (!envelope.success) {
    throw new Error(envelope.error || `Request failed`)
  }

  return envelope.data as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
}
