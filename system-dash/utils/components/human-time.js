import React from 'react'
import {months} from '../../../src/utils/dates';

export default function HumanTime({date}) {
  const d = new Date(date)
  const [_, mm, dd] = [d.getFullYear(), months[d.getMonth()], d.getDate()]

  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  return (
    <>
      <span style={{ fontWeight: 800}}>
        {time}
      </span>
      <span style={{margin: '5px 5px', fontSize: '1em'}}>
        {mm} {dd}
      </span>
    </>
  )
}