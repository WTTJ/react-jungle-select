import React from 'react'

import ExampleCode from './ExampleCode'
import ExamplePreview from './ExamplePreview'

require('./Example.sass')

export default function Example(props) {
  return (
    <div className='example' id={props.id}>
      <ExamplePreview {...props} />
      <ExampleCode {...props} />
    </div>
  )
}
