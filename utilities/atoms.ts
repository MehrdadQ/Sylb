import { atom } from 'recoil'

export const userState = atom({
  key: 'userState',
  default: ""
})

export const loadingState = atom({
  key: 'loadingState',
  default: false
})