import React, { Component } from "react";
import Immutable from "immutable";
import JungleSelect from "../../src/index";
import narcos from "../data/immutable-narcos";
require("../../src/JungleSelect.sass");

const immutableItems = Immutable.fromJS(narcos);

export default class ImmutableMultipleSelect extends Component {
  state = { values: Immutable.List() };

  render() {
    const { values } = this.state;
    return (
      <div>
        {values.map((value, i) => (
          <div className="preview-selection" key={i}>
            <strong>{value.get("name")}</strong> selected!
          </div>
        ))}
        <JungleSelect
          searchable={true}
          items={immutableItems}
          selected={values}
          onChange={value => {
            let newValues;
            if (value == null) {
              values.splice(0, values.length);
            } else {
              if (values.find(o => o.get("id") === value.get("id"))) {
                newValues = values.filter(o => o.get("id") !== value.get("id"));
              } else {
                newValues = values.push(value);
              }
            }
            this.setState({ values: newValues });
          }}
          renderItem={item => <div>{item.get("name")}</div>}
          renderSelectedItem={item => item.get("name")}
          placeholder="Choose your narco(s)"
          mode="select"
        />
      </div>
    );
  }
}
