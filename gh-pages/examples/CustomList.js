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
          <div className='preview-selection'>
            <strong>{value.label}</strong> in group <strong>{value.groupId}</strong> selected!
          </div>
        }
        <JungleSelect
          items={languages.items}
          groups={languages.groups}
          renderGroup={(group, items) =>
            <span>{group.label} ({items.length})</span>
          }
          renderItem={(item) => item.label}
          searchable={true}
          searchableAttributes={['label']}
          label='Search:'
          listWrapper={(list) =>
            <div style={{border: '1px solid #eeeeee', borderRadius: 3, padding: 15}}>
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
