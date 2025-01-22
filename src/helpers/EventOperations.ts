export function handlePreventDefault(event: Event, func: Function, ...args: unknown[]) {
  event.preventDefault()

  func(...args)
}

export function handleOuterClick() {

}
