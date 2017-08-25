import React, { Component } from 'react'
import Immutable from 'immutable'
import JungleSelect from '../../src/index'
import languages from '../data/languages'
require('../../src/JungleSelect.sass')

const immutableItems = Immutable.List(
  languages.items.map(l => Immutable.Map({ name: l.label, groupId: l.groupId }))
)
const immutableGroups = Immutable.List(
  languages.groups.map(g => Immutable.Map({ id: g.id, name: g.label }))
)

const renderItem = (item) =>
  item ? item.get('name') : ''

const renderGroup = (group, items) =>
  group ? `${group.get('name')} (${items.size})` : ''

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
          placeholder='Choose your languages'
          items={immutableItems}
          groups={immutableGroups}
          renderItem={renderItem}
          renderGroup={renderGroup}
          searchable={true}
          searchableAttributes={['name']}
          clearable={true}
        />
      </div>
    )
  }
}
