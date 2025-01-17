export declare global {

  export type TimerId = ReturnType<typeof setTimeout> | null

  export interface IApiRes<TRes> {
    data: TRes
  }

  export type TApiErr<TErr> = TErr & null

  export interface InputSuggestApiRes {
    data: InputSuggestApiItem[]
  }

  export type TUserCardSize = 'S' | 'L'

  export interface InputSuggestApiItem {
    type: 'user' | 'company'
    name: string | null
    alias: string
    avatar: string | null
  }

}
