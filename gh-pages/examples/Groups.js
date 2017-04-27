import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import languages from '../data/languages'
require('../../src/JungleSelect.sass')

export default class Groups extends Component {
  state = { value: null }

  render() {
    const { value } = this.state
    return (
      <div>
        {value &&
          <div>«{value.label}» in group «{value.groupId}» selected!</div>
        }
        <JungleSelect
          items={languages.items}
          groups={languages.groups}
          renderGroup={(group) => group.label}
          renderItem={(item) => item.label}
          onChange={(value) => this.setState({ value })}
          mode='list'
        />
      </div>
    )
  }
}
