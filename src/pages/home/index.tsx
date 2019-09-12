import React, { useReducer } from 'react'

import { initialState, reducer } from '../../store/'
import './index.scss'

export default function Home() {
  const [state] = useReducer(reducer, initialState)
  return (
    <div className="hello">
      Hello, {state.user} <small>- ({process.env.NODE_ENV})</small>
    </div>
  )
}
