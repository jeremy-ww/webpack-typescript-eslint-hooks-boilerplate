import React, { useReducer } from 'react'
import icon from '@/assets/icon-square-big.png'

import { initialState, reducer } from '../../store/'
import './index.scss'

export default function Home() {
  const [state] = useReducer(reducer, initialState)
  return (
    <div className="hello">
      <img width="20" src={icon} alt="icon" /> Hello, {state.user}{' '}
      <small>- ({process.env.NODE_ENV})</small>
    </div>
  )
}
