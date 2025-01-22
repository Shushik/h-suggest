export declare global {

  export interface IApiArgs {
    timeout?: number
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    headers?: { [id: string]: string }
  }

  export type TApiErr<TErr extends string> = TErr |
    'UNKNOWN' |
    'ABORTED' |
    'NOT_OK' |
    'NO_HTTP_CODE' |
    'NO_JSON_DATA'

  export interface IApiRaw<TRes> {
    data?: TRes
  }

  export interface IApiRes<TRes = void, TErr = void> {
    data?: TRes
    error?: TErr | TApiErr
  }

}
