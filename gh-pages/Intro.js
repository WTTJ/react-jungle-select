import React from 'react'

require('./Example.sass')

export default function Example(props) {
  return (
    <div className='example'>
      <div className='preview'>
        <h1>React Jungle Select</h1>
        <div className='preview-description'>
          <p><a href='https://github.com/WTTJ/react-jungle-select' target='_blank'>React Jungle Select</a> aims to let you create powerful lists and selects.</p>
          <p>Here are some of the main advantages of this library compared to others:</p>
          <ul>
            <li>We use it in production on different projects with various usecases. That's why we wanted it to be <strong>easily and fully customizable</strong>.</li>
            <li><strong>It's not just a simple "select"</strong>: if you want a <strong>list</strong>, you can get it, with or without <strong>search</strong>, with or without <strong>keyboard navigation</strong>, with or without <strong>groups</strong>, with or without <strong>multiple selections</strong>, and so on.</li>
            <li>It works well with <a href='https://github.com/erikras/redux-form' target='_blank'>Redux Form</a>, <a href='https://github.com/malte-wessel/react-custom-scrollbars' target='_blank'>react-custom-scrollbars</a> and other indispensable libraries (see examples below).</li>
            <li>We also provide a <strong>clean DOM</strong>: easy to customize (with or without our example stylesheet).</li>
          </ul>
          <p>Give it a try and feel free to <a href='https://github.com/WTTJ/react-jungle-select/pulls' target='_blank'>contribute</a>!</p>
          <p className='text-small'>React Jungle Select is made with love by the <a href='https://www.welcometothejungle.co/' target='_blank'>Welcome to the Jungle</a> Tech team.</p>
        </div>
      </div>
      <div className='code'>
      </div>
    </div>
  )
}
