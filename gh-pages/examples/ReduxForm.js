import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import JungleSelect from '../../src/index'
import StoreContent from '../StoreContent'
import narcos from '../data/narcos'
require('../../src/JungleSelect.sass')

const JungleSelectField = (props) => {
  return (
    <JungleSelect
      {...props}
      {...props.input}
      selected={props.input.value}
    />
  )
}

class ReduxForm extends Component {
  render() {
    const { handleSubmit } = this.props
    return (
      <div>
        <div className='preview-selection'>
          <StoreContent />
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Foo:</label>
            <Field
              name='foo'
              component='input'
            />
          </div>
          <div>
            <Field
              component={JungleSelectField}
              name='narco'
              items={narcos}
              searchable={true}
              mode='select'
              placeholder='Choose your narco'
              clearable={true}
              label='Narco:'
            />
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({
  form: 'jungle-select'
})(ReduxForm)
