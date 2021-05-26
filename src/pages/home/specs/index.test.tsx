import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import Home from 'src/pages/home'
import { mount } from '@cypress/react'
import reducer from 'src/pages/home/store/slice'

const store = configureStore({
  reducer: {
    home: reducer,
  },
})

describe('Home', () => {
  it('render no error', () => {
    mount(
      <Provider store={store}>
        <Home />
      </Provider>,
    )
  })
})
