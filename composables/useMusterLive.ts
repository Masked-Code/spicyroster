export function useMusterLive(onUpdate: () => void) {
  let es: EventSource | null = null

  const connect = () => {
    if (typeof window === 'undefined') return
    es = new EventSource('/api/events')
    es.addEventListener('muster-updated', () => onUpdate())
    es.onmessage = () => onUpdate()
    es.onerror = () => {
      try { es?.close() } catch {}
      es = null
      setTimeout(connect, 3000)
    }
  }

  const disconnect = () => {
    try { es?.close() } catch {}
    es = null
  }

  return { connect, disconnect }
}
