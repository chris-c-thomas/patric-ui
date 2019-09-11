
import React from "react";
import { render } from "react-dom";
import Annotation from '../src/apps/Annotation';
import '../src/styles/styles.scss'

export function startApp(ele) {
  const e = React.createElement;
  const domContainer = document.querySelector(ele);
  render(e(Annotation), domContainer);
}

