/* eslint import/no-webpack-loader-syntax: off */

import React from 'react'
import { render } from 'react-dom'
import App from 'App'

require('file-loader?name=[name].[ext]!./index.html')

render(<App />, document.getElementById('app'))
