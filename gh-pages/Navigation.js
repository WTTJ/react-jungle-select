import React, { Component } from 'react'
import { connect } from 'react-redux'
import { HashLink as Link } from 'react-router-hash-link'
import { withRouter } from 'react-router-dom'
import { throttle } from 'lodash'

import ExampleList from 'ExampleList'

require('Navigation.sass')

class Navigation extends Component {

  componentDidMount() {
    document.addEventListener('scroll', throttle(::this.handleScroll, 500))
  }

  handleScroll() {
    const { history: { push }, location: { pathname } } = this.props
    let e = this.visibleExample()
    if (e && e.id !== this.currentExampleId()) {
      push(`${pathname}#${e.id}`)
    }
  }

  visibleExample() {
    return Array.from(document.querySelectorAll('.example'))
      .map(e => {
        var bounding = e.getBoundingClientRect()
        return {
          id: e.id,
          top: bounding.top
        }
      })
      .filter(e => e.id && e.id.length)
      .sort((a, b) => {
        if (a.top < b.top) {
          return -1
        }
        if (a.top > b.top) {
          return 1
        }
        return 0
      })
      .find(e => e.top >= 0)
  }

  currentExampleId() {
    const { location: { hash } } = this.props
    return hash.replace(/^#/, '')
  }

  exampleClass(example) {
    let classNames = []
    if (this.currentExampleId() === example.id) {
      classNames.push('active')
    }
    return classNames.join(' ')
  }

  examplePath(example) {
    const { location: { pathname } } = this.props
    return `${pathname}#${example.id}`
  }

  render() {
    return (
      <nav className='main-navigation'>
        <ul>
          {ExampleList.map(example =>
            <li key={example.id}>
              <Link
                to={this.examplePath(example)}
                className={this.exampleClass(example)}
              >
                {example.name}
              </Link>
            </li>
          )}
        </ul>
      </nav>
    )
  }
}

export default withRouter(
  connect(
    (state) => {
      return {}
    }
  )(Navigation)
)
