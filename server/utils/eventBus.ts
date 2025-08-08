type Subscriber = {
  id: string
  write: (chunk: string) => void
}

type EventBus = {
  subscribers: Set<Subscriber>
  publish: (event: string, data?: unknown) => void
  subscribe: (s: Subscriber) => () => void
}

const g = globalThis as unknown as { __musterEventBus?: EventBus }

if (!g.__musterEventBus) {
  g.__musterEventBus = {
    subscribers: new Set<Subscriber>(),
    publish(event, data) {
      const payload = data === undefined ? '' : JSON.stringify(data)
      const lines = [
        `event: ${event}`,
        payload ? `data: ${payload}` : 'data: {}',
        '',
      ].join('\n')
      const frame = `${lines}\n`
      for (const s of this.subscribers) {
        try { s.write(frame) } catch (e) { /* ignore */ }
      }
    },
    subscribe(s: Subscriber) {
      this.subscribers.add(s)
      return () => this.subscribers.delete(s)
    }
  }
}

export const eventBus = g.__musterEventBus!
