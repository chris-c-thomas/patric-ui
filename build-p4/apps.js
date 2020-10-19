
import React from 'react'
import { render } from 'react-dom'
import Annotation from '../src/apps/Annotation'
import Assembly from '../src/apps/Assembly'

import '../src/styles/styles.scss'

export function renderApp(app, ele) {
  const e = React.createElement
  const domContainer = document.querySelector(ele)

  if (app == 'Annotation')
    render(e(Annotation), domContainer)
  else if (app == 'Assembly')
    render(e(Assembly), domContainer)
}

