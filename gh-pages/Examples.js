import React from 'react'

import Example from './Example'
import ExampleList from 'ExampleList'

require('./Examples.sass')
require('./Code.sass')
require('./Preview.sass')

export default function Examples() {
  return (
    <div className='examples'>
      {ExampleList.map(example =>
        <Example {...example} key={example.id} />
      )}
    </div>
  )
}
