import React from 'react'

export default function ExamplePreview(props) {
  let classNames = ['example-' + props.id, 'preview']
  return (
    <div className={classNames.join(' ')}>
      <h2>{props.name}</h2>
      <props.jsComponent.default />
    </div>
  )
}
