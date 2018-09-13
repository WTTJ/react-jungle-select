import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import narcos from '../data/narcos'
require('../../src/JungleSelect.sass')

export default class BasicSelect extends Component {
  state = { value: null }

  render() {
    const { value } = this.state
    return (
      <div>
        {value &&
          <div className='preview-selection'>
            <strong>{value}</strong> selected!
          </div>
        }
        <JungleSelect
          selected={value}
          onChange={(value) => this.setState({ value }) }
          items={narcos}
          clearable={true}
          mode='select'
        />
      </div>
    )
  }
}
