import React from 'react'

import Logo from './Logo'

export default function Header() {
  return (
    <header className='title'>
      <Logo />
      <a
        className='btn'
        href='https://github.com/WTTJ/react-jungle-select'
        target='_blank'
        rel='noopener noreferrer'
      >
        <i className='zmdi zmdi-github'></i>
        View on github
      </a>
    </header>
  )
}
