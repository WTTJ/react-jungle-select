import React from 'react'

import ExampleList from 'ExampleList'

require('Navigation.sass')

export default function Navigation() {
  return (
    <nav className='main-navigation'>
      <ul>
        {ExampleList.map(example =>
          <li key={example.id}>
            <a href={`#${example.id}`}>{example.name}</a>
          </li>
        )}
      </ul>
    </nav>
  )
}

