import React from 'react'

import Navigation from './Navigation'
import Examples from './Examples'

import Logo from './Logo'

require('App.sass')

export default function App() {
  return (
    <main className="react-jungle-select">
      <header className='title'>
        <Logo />
        <a
          className='btn'
          href='https://github.com/WTTJ/react-jungle-select'
          target='_blank'>
          <i className='zmdi zmdi-github'></i>
          View on github
        </a>
      </header>
      <Navigation />
      <Examples />
    </main>
  )
}
