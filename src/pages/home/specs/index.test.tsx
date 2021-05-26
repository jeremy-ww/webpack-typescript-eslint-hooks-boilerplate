import React from 'react'

import Home from 'src/pages/home'
import { mount } from '@cypress/react'

describe('Home', () => {
  it('render no error', () => {
    mount(<Home />)
  })
})
