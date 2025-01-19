import { setTimer, clearTimer } from '@/helpers/TimerOperations';

export const API_HTTP_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_AUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

export const API_HTTP_MESSAGES = Object.
  keys(API_HTTP_CODES).
  reduce((out: { [id: string]: string }, item: string) => {
    out[`${API_HTTP_CODES[item]}`] = item

    return out
  }, { })

export const API_TIMEOUT = 5000

export class ApiRequest<TRes = void, TErr = void> {

  url: string = ''

  args: IApiArgs = { }

  protected _ctrl: AbortController

  protected _timer: TimerId = null

  constructor(url: string, args?: IApiArgs) {
    this.url = url
    this.args = args || { }
    this._ctrl = new AbortController()
  }

  async exec(): Promise<IApiRes<TRes, TErr>> {
    const { timeout } = this.args
    const { signal } = this._ctrl
    let raw = <Response | null>null

    this._timer = setTimer(() => this.abort(), timeout || API_TIMEOUT)

    try {
      raw = await fetch(this.url, { signal, ...this.args })
    } catch (err) {
      return { error: 'ABORTED' }
    }

    this._timer = clearTimer(this._timer)

    return await this.parse(raw)
  }

  abort() {
    this._timer = clearTimer(this._timer)

    if (this._ctrl) {
      this._ctrl.abort()
    }
  }

  async parse(raw: Response | null): Promise<IApiRes<TRes, TErr>> {
    if (!raw) {
      return { error: 'UNKNOWN' }
    }

    if (!raw.ok) {
      if (raw.status && raw.status >= 400) {
        return {
          error: (API_HTTP_MESSAGES[raw.status] as TApiErr<string>) || 'NO_HTTP_CODE'
        }
      }

      return { error: 'NOT_OK' }
    }

    let json = <IApiRaw<TRes> | null>null

    try {
      json = await raw.json()
    } catch (exc) {
      return { error: 'NO_JSON_DATA' }
    }

    if (!json) {
      return { error: 'NO_JSON_DATA' }
    }

    return { data: json.data as TRes }
  }

}

export function useApiRequest<TRes = void, TErr = void>(
  url: string,
  args?: IApiArgs
): Promise<IApiRes<TRes, TErr>> {
  return new ApiRequest<TRes, TErr>(url, args).exec()
}
