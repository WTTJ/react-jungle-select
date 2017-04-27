import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import simpsons from '../data/simpsons'
require('../../src/JungleSelect.sass')

export default class CustomSelect extends Component {
  state = { value: null, focus: false }

  render() {
    const { value, focus } = this.state
    return (
      <div>
        <button
          className='btn'
          onClick={() => this.setState({ focus: !this.state.focus })}
        >
          Toggle focus
        </button>
        <JungleSelect
          selected={value}
          onChange={(value) => this.setState({ value })}
          placeholder='Choose your simpson'
          items={simpsons}
          searchable={true}
          clearable={true}
          focus={focus}
          mode='select'
        />
      </div>
    )
  }
}
