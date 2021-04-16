import React, { useReducer } from 'react'
import icon from 'src/assets/icon-square-big.png'

import { initialState, reducer } from 'src/store/'
import { Hello } from './index.css'

export default function Home() {
  const [state] = useReducer(reducer, initialState)
  return (
    <Hello>
      <img width="20" src={icon} alt="icon" /> Hello, {state.user}{' '}
      <small>- ({process.env.NODE_ENV})</small>
    </Hello>
  )
}
