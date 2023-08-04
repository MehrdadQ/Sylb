import { atom } from 'recoil'
import { UserInfo } from './types'

export const userState = atom<UserInfo | null>({
  key: 'userState',
  default: null
})

export const loadingState = atom({
  key: 'loadingState',
  default: false
})