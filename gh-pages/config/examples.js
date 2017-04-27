/* eslint import/no-webpack-loader-syntax: off */

let examples = require('./examples.json')

let defaultFiles = {
  sass: require('!!raw-loader!../../src/JungleSelect.sass'),
  css: require('!!raw-loader!!sass-loader?outputStyle=expanded!../../src/JungleSelect.sass'),
}

examples.forEach((e, i) => {
  examples[i].jsComponent = require('../examples/' + e.js + '.js')
  examples[i].files = {}
  examples[i].files.js = require('!!raw-loader!../examples/' + e.js + '.js')
  examples[i].files.sass = defaultFiles.sass
  examples[i].files.css = defaultFiles.css
  if (e.sass) {
    examples[i].files.sass += '\n' + require('!!raw-loader!../examples/' + e.js + '.sass')
    examples[i].files.css += '\n' + require('!!raw-loader!!sass-loader?outputStyle=expanded!../examples/' + e.js + '.sass')
  }
  if (e.json) {
    examples[i].files.json = require('!!raw-loader!../data/'+ e.json +'.json')
  }
})

module.exports = examples
