import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Workbox } from 'workbox-window'
import ReactDOM from 'react-dom'
import React from 'react'

import Home from '@/pages/home'

const App = function () {
  return (
    <Router>
      <Route path="/" component={Home} />
    </Router>
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
