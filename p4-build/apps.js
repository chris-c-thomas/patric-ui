
import React from "react";
import { render } from "react-dom";
import Annotate from '../src/apps/annotate';


export function startApp(ele) {
  const e = React.createElement;
  const domContainer = document.querySelector(ele);
  render(e(Annotate), domContainer);
}

