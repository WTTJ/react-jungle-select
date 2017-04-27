import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import simpsons from '../data/simpsons'
require('../../src/JungleSelect.sass')

export default class Limit extends Component {
  state = { value: null }

  render() {
    const { value } = this.state
    return (
      <div>
        {value &&
          <div>«{value}» selected!</div>
        }
        <JungleSelect
          items={simpsons}
          renderItem={(item) => item }
          searchable={true}
          limit={10}
          onChange={(value) => this.setState({ value })}
          mode='list'
        />
      </div>
    )
  }
}
