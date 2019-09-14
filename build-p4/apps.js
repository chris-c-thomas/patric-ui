
import React from "react";
import { render } from "react-dom";
import Annotation from '../src/apps/Annotation';
import Assembly from '../src/apps/Assembly';

import '../src/styles/styles.scss'

export function startApp(app, ele) {
  const e = React.createElement;
  const domContainer = document.querySelector(ele);

  if (app == 'Annotation')
    render(e(Annotation), domContainer);
  else (app == 'Assembly')
    render(e(Assembly), domContainer);
}

