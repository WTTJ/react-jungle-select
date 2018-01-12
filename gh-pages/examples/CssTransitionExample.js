import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import narcos from '../data/narcos'
import { CSSTransition } from 'react-transition-group'
require('../../src/JungleSelect.sass')

export default class CssTransitionExample extends Component {
  state = { value: null }

  listWrapper(list, opened) {
    return (
      <CSSTransition
        in={!!opened}
        timeout={300}
        classNames='fade'
        unmountOnExit={true}
      >
        {list}
      </CSSTransition>
    )
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
          items={narcos}
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

