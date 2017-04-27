import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import narcos from '../data/narcos'
require('../../src/JungleSelect.sass')

export default class CustomFilter extends Component {
  state = { value: null }

  render() {
    const { value } = this.state
    return (
      <div>
        {value &&
          <div>«{value}» selected!</div>
        }
        <JungleSelect
          items={narcos}
          selected={value}
          onChange={(value) => this.setState({ value })}
          mode='select'
          searchable={true}
          filterItem={(item, filter) =>
            filter.toLowerCase().split(' ').every(s =>
              item.toLowerCase().indexOf(s) != -1
            )
          }
          placeholder='Choose your narco'
        />
      </div>
    )
  }
}
