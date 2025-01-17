import { setTimer, clearTimer } from '@/helpers/TimerOperations';

export const ApiHttpCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_AUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

export const ApiHttpMessages = Object.
  keys(ApiHttpCodes).
  reduce((out: { [id: string]: string }, item: string) => {
    out[`${ApiHttpCodes[item]}`] = item

    return out
  }, { })

export const ApiTimeout = 5000

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

    this._timer = setTimer(() => this.abort(), timeout || ApiTimeout)

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
          error: (ApiHttpMessages[raw.status] as TApiErr<string>) || 'NO_HTTP_CODE'
        }
      }

      return { error: 'NOT_OK' }
    }

    const json = await raw.json() as IApiRaw<TRes>

    if (!json || !json.data) {
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
