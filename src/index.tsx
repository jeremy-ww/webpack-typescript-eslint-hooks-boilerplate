import { BrowserRouter as Router, Route } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'

import Home from './pages/home'
import store from './store'

const App = hot(
  class App extends React.Component {
    render() {
      return (
        <Router>
          <Provider store={store}>
            <Route path="/" component={Home} />
          </Provider>
        </Router>
      )
    }
  }
)

ReactDOM.render(<App />, document.getElementById('app'))
