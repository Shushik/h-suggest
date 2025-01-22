export function setTimer(func: () => unknown, timeout: number = 0): TimerId {
  if (func) {
    return setTimeout(func, timeout)
  }

  return null
}

export function clearTimer(timerId: TimerId): null {
  if (timerId) {
    clearTimeout(timerId)
  }

  return null
}

export function resetTimer(timerId: TimerId, func: () => unknown, timeout: number = 0): TimerId {
  clearTimer(timerId)

  return setTimer(func, timeout)
}

export function debounceAction<TArgs extends unknown[]>(
  func: (...args: TArgs) => unknown,
  timeout: number = 0
): (...args: TArgs) => TimerId {
  let timerId: TimerId

  return (...args: TArgs) => {
    timerId = resetTimer(timerId, () => func(...args), timeout)

    return timerId
  }
}
