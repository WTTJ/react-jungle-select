import React, { Component } from 'react'
import { connect } from 'react-redux'

class StoreContent extends Component {
  render() {
    const { storeContent } = this.props
    if (storeContent) {
      return (
        <pre>
          {JSON.stringify(this.props.storeContent, null, 2)}
        </pre>
      )
    }
    return null
  }
}

export default connect(
  (state) => {
    return {
      storeContent: state.form['jungle-select']
    }
  }
)(StoreContent)
