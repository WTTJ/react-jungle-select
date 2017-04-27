import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import narcos from '../data/narcos'
require('../../src/JungleSelect.sass')

export default class MultipleSelect extends Component {
  state = { values: [] }

  render() {
    const { values } = this.state
    return (
      <div>
        {values.map((value, i) =>
          <div key={i}>«{value}» selected!</div>
        )}
        <JungleSelect
          searchable={true}
          items={narcos}
          selected={values}
          onChange={(value) => {
            if (value == null) {
              values.splice(0, values.length)
            } else {
              let index = values.indexOf(value)
              if (index != -1) {
                values.splice(index, 1)
              } else {
                values.push(value)
              }
            }
            this.setState({ values })
          }}
          renderItem={(item) =>
            <div>
              {item}
            </div>
          }
          renderSelectedItem={(item) => item}
          placeholder='Choose your narco(s)'
          mode='select'
        />
      </div>
    )
  }
}
