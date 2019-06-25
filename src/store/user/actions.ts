import { User, Type } from './types'

export const setUser = (user: User) => ({
  type: Type.SET_USER,
  user
})
