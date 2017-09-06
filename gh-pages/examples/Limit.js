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
          <div className='preview-selection'>
            <strong>{value}</strong> selected!
          </div>
        }
        <JungleSelect
          items={simpsons}
          renderItem={(item) => item }
          searchable={true}
          onChange={(value) => this.setState({ value })}
          mode='list'
          limit={5}
          renderShowAll={(showAll, onToggle) =>
            <a className='jungle-select-show-all' onClick={onToggle}>
              {showAll ? 'Less Simpsons...' : 'More Simpsons...'}
            </a>
          }
          selected={value}
        />
      </div>
    )
  }
}
