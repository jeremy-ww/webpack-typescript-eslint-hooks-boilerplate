import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'

import home from 'src/pages/home/store/slice'

const logger = createLogger({ collapsed: true })

const store = configureStore({
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV === 'development') {
      return getDefaultMiddleware().concat(logger)
    }
    return getDefaultMiddleware()
  },
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    home: home
  }
})

export default store

export type RootState = ReturnType<typeof store.getState>
