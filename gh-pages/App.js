import React from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './Header'
import Navigation from './Navigation'
import Examples from './Examples'

require('App.sass')

const composeEnhancers =
  process.env.NODE_ENV === "development" &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose

const store = createStore(
  combineReducers({
    form: formReducer
  }),
  composeEnhancers(
    applyMiddleware.apply(this, [])
  )
)

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <main className="react-jungle-select">
          <Header />
          <Navigation />
          <Route path="/" component={Examples} />
        </main>
      </Router>
    </Provider>
  )
}
