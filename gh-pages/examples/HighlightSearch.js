import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import narcos from '../data/narcos'
require('../../src/JungleSelect.sass')

export default class HighlightSearch extends Component {
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
          items={narcos}
          selected={value}
          onChange={(value) => this.setState({ value })}
          mode='select'
          searchable={true}
          placeholder='Choose your narco'
          highlightFilterMatches={true}
          renderItem={(item, index, highlighted) => {
            return highlighted
          }}
        />
      </div>
    )
  }
}
