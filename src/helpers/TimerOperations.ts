export function setTimer(handler: () => unknown, timeout: number = 0): TimerId {
  if (handler) {
    return setTimeout(handler, timeout)
  }

  return null
}

export function clearTimer(timerId: TimerId): null {
  if (timerId) {
    clearTimeout(timerId)
  }

  return null
}
