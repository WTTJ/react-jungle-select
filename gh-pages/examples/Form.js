import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import narcos from '../data/narcos'
require('../../src/JungleSelect.sass')

export default class Form extends Component {
  state = { value1: null, value2: null }

  render() {
    const { value1, value2 } = this.state
    return (
      <div>
        {value1 &&
          <div className='preview-selection'>
            Narco #1 <strong>{value1}</strong>!
          </div>
        }
        {value2 &&
          <div className='preview-selection'>
            Narco #2 <strong>{value2}</strong>!
          </div>
        }
        <form>
          <div>
            <label>Foo:</label>
            <input />
          </div>
          <div>
            <JungleSelect
              items={narcos}
              searchable={true}
              mode='select'
              placeholder='Choose your narco #1'
              selected={value1}
              onChange={(value1) => this.setState({ value1 })}
              clearable={true}
              label='Narco #1:'
            />
          </div>
          <div>
            <JungleSelect
              items={narcos}
              mode='select'
              placeholder='Choose your narco #2'
              selected={value2}
              onChange={(value2) => this.setState({ value2 })}
              clearable={true}
              label='Narco #2:'
            />
          </div>
          <div>
            <label>Bar: </label>
            <input />
          </div>
        </form>
      </div>
    )
  }
}
