export declare global {

  export type TimerId = ReturnType<typeof setTimeout> | null

  export type TUserCardSize = 'S' | 'L'

  export interface InputSuggestApiItem {
    type: 'user' | 'company'
    name: string | null
    alias: string
    avatar: string | null
  }

}
