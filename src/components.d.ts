export declare global {

  export type TimerId = ReturnType<typeof setTimeout> | null

  export type TFormMethod = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE'
  export type TFormTarget = '_top' | '_self' | '_blank' | '_parent' | string
  export type TFormEnctype = 'application/x-www-form-urlencoded' |
    'multipart/form-data' |
    'text/plain'

  export type TUserCardSize = 'S' | 'L'

  export interface IUserCardItem {
    type: 'user' | 'company'
    name: string | null
    alias: string
    avatar: string | null
  }

}
