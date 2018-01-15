import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import simpsons from '../data/simpsons'
import { Scrollbars } from 'react-custom-scrollbars'
require('../../src/JungleSelect.sass')

export default class CustomScrollbarsExample extends Component {
  state = { value: null }

  listWrapper(children, opened) {
    if (opened) {
      return (
        <Scrollbars
          className='custom-scrollbars'
          style={{
            position: 'absolute',
            height: 350
          }}
        >
          {children}
        </Scrollbars>
      )
    }
  }

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
          selected={value}
          onChange={(value) => this.setState({ value })}
          mode='select'
          searchable={true}
          placeholder='Choose your narco'
          renderItem={(item, index, highlighted) => highlighted }
          listWrapper={::this.listWrapper}
        />
      </div>
    )
  }
}


