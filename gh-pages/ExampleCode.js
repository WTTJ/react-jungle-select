import React from 'react'
import Prism from '@maji/react-prism'
import PrismJsx from 'prismjs/components/prism-jsx.min'
import PrismSass from 'prismjs/components/prism-sass.min'
import PrismJson from 'prismjs/components/prism-json.min'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
Tabs.setUseDefaultStyles(false)

require('!!style-loader!!css-loader!prismjs/themes/prism-okaidia.css')
require('ReactTabs.sass')

export default function ExampleCode(props) {
  return (
    <Tabs className='code'>
      <TabList>
        <Tab>JS</Tab>
        <Tab>SASS</Tab>
        <Tab>CSS</Tab>
        {props.json && <Tab>DATA</Tab>}
      </TabList>
      <TabPanel>
        <Prism language="jsx">
          {props.files.js || ''}
        </Prism>
      </TabPanel>
      <TabPanel>
        <Prism language="sass">
          {props.files.sass || ''}
        </Prism>
      </TabPanel>
      <TabPanel>
        <Prism language="css">
          {props.files.css || ''}
        </Prism>
      </TabPanel>
      {props.files.json &&
        <TabPanel>
          <Prism language="json">
            {props.files.json || ''}
          </Prism>
        </TabPanel>
      }
    </Tabs>
  )
}
