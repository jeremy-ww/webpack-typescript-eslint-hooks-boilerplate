import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Workbox } from 'workbox-window'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'

import Home from 'src/pages/home'
import store from 'src/store'

const App = function () {
  return (
    <Provider store={store}>
      <Router>
        <Route path="/" component={Home} />
      </Router>
    </Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const wb = new Workbox('service-worker.js')
    wb.addEventListener('waiting', () => {
      if (window.confirm('New service worker available, Refresh now?')) {
        wb.addEventListener('controlling', () => {
          window.location.reload()
        })
        wb.messageSW({ type: 'SKIP_WAITING' })
      }
    })
    wb.register()
      .then((registration) => {
        console.log('💖 SW registered:', registration)
      })
      .catch((registrationError) => {
        console.log('🙈 SW registration failed:', registrationError)
      })
  })
}
