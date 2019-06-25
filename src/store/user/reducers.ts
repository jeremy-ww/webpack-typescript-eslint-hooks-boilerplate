import { Action } from 'redux'

import { Type, User } from './types'

export default (
  user = { name: 'redux-user' },
  action: Action<Type> & { user: User }
) => {
  switch (action.type) {
    case Type.SET_USER:
      return action.user
    default:
      return user
  }
}
