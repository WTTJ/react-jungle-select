import React, { Component } from 'react'
import Immutable from 'immutable'
import JungleSelect from '../../src/index'
import simpsons from '../data/simpsons'
require('../../src/JungleSelect.sass')

const immutableSimpsons = Immutable.List(
  simpsons.map(s => Immutable.Map({name: s}))
)

const renderItem = (item) => {
  return item ? item.get('name') : ''
}

export default class ImmutableExample extends Component {
  state = {
    values: []
  }

  select(value) {
    const { values } = this.state
    if (value == null) {
      values.splice(0, values.length)
    } else {
      let index = values.indexOf(value)
      if (index !== -1) {
        values.splice(index, 1)
      } else {
        values.push(value)
      }
    }
    this.setState({ values })
  }

  render() {
    const { values } = this.state
    return (
      <div>
        <JungleSelect
          selected={values}
          onChange={::this.select}
          placeholder='Choose your simpson'
          items={immutableSimpsons}
          renderItem={renderItem}
          searchable={true}
          searchableAttributes={['name']}
          clearable={true}
        />
      </div>
    )
  }
}
