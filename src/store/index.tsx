import { configureStore } from '@reduxjs/toolkit'

import home from 'src/pages/home/store/slice'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const middlewares: any[] = []

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { logger } = require('redux-logger')
  middlewares.push(logger)
}

const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    home,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
