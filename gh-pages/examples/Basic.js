import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import narcos from '../data/narcos'

require('../../src/JungleSelect.sass')

export default class Basic extends Component {
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
          onChange={(value) => this.setState({ value })}
          mode='list'
        />
      </div>
    )
  }
}
