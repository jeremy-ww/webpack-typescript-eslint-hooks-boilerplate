import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import Home from 'src/pages/home'
import { mount } from '@cypress/react'

const mockStore = configureStore()

describe('Home', () => {
  it('render no error', () => {
    mount(
      <Provider store={mockStore}>
        <Home />
      </Provider>,
    )
  })
})
