import React from 'react'

import Example from './Example'
import ExampleList from 'ExampleList'
import Intro from './Intro'

require('./Examples.sass')
require('./Code.sass')
require('./Preview.sass')

export default function Examples() {
  return (
    <div className='examples'>
      <Intro />
      {ExampleList.map(example =>
        <Example {...example} key={example.id} />
      )}
    </div>
  )
}
