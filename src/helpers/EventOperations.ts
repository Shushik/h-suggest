export function handlePreventDefault(event: Event, func: Function, ...args: unknown[]) {
  event.preventDefault()

  func(...args)
}

export function handleOuterEvent(
  event: Event,
  inner: Array<HTMLElement | null>,
  func: Function,
  ...args: unknown[]
) {
  const target = event.target as HTMLElement

  for (let it0 = 0, ln0 = inner.length; it0 < ln0; it0++) {
    if (
      inner[it0] &&
      (event.target === inner[it0] || inner[it0]?.contains(target))
    ) {
      return
    }
  }

  func(...args)
}
