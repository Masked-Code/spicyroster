import { eventBus } from '../utils/eventBus'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache, no-transform')
  setResponseHeader(event, 'Connection', 'keep-alive')
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*')

  const res = event.node.res

  const write = (chunk: string) => {
    try { res.write(chunk) } catch (e) { /* ignore */ }
  }

  write(': connected\n\n')

  const heartbeat = setInterval(() => write(': keepalive\n\n'), 25000)

  const unsub = eventBus.subscribe({ id: crypto.randomUUID(), write })

  onRequestClosed(event, () => {
    clearInterval(heartbeat)
    unsub()
  })

  await new Promise(() => {})
})
