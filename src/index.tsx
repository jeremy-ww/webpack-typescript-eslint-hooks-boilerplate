import { BrowserRouter as Router, Route } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import ReactDOM from 'react-dom'
import React from 'react'

import Home from './pages/home'

const App = hot(function() {
  return (
    <Router>
      <Route path="/" component={Home} />
    </Router>
  )
})

ReactDOM.render(<App />, document.getElementById('app'))
