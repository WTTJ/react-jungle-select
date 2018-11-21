import React, { Component } from "react";
import JungleSelect from "../../src/index";
require("../../src/JungleSelect.sass");


export default class RemoteSelect extends Component {
  state = { value: null }

  renderItem(item, index, highlightedItem) {
    return <div>{highlightedItem.get('name')}</div>
  }

  render() {
    const { value } = this.state;
    return (
      <div>
        {value &&
          <div className='preview-selection'>
            <strong>{value.get('name')}</strong> selected!
          </div>
        }
        <JungleSelect
          searchable={true}
          items={[]}
          remote={{ baseUrl: 'https://api.openbrewerydb.org/breweries', searchParam: 'by_name' }}
          searchableAttributes={['name']}
          onChange={(value) => this.setState({ value }) }
          renderItem={::this.renderItem}
          renderSelectedItem={item => item.get("name")}
          placeholder="Choose your narco(s)"
          mode="select"
        />
      </div>
    );
  }
}
