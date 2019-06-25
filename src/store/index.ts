import { combineReducers, createStore } from 'redux'

import { User } from './user/types'
import user from './user/reducers'

export default createStore(
  combineReducers<State>({
    user
  })
)

export interface State {
  user: User
}
