import React, { Component } from 'react'
import JungleSelect from '../../src/index'
import languages from '../data/languages'
require('../../src/JungleSelect.sass')

export default class Group extends Component {
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
          searchable={true}
          searchableAttributes={['label']}
          label='Search:'
          cancelFilter={
            <span style={{color: 'red'}}>
              Cancel
            </span>
          }
          listWrapper={(list) =>
            <div style={{border: '1px solid #eeeeee', borderRadius: 3}}>
              {list}
            </div>
          }
          onChange={(value) => this.setState({ value })}
          mode='list'
        />
      </div>
    )
  }
}
