export function handlePreventDefault(func: Function, event: Event, ...args: unknown[]) {
  event.preventDefault()

  func(...args)
}
