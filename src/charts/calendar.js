
import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';

/**
const exampleData = [
  {
    "day": "2016-01-18",
    "value": 93
  },
  {
    "day": "2015-05-22",
    "value": 320
  },
  {
    "day": "2015-04-14",
    "value": 7
  },
  {
    "day": "2018-05-05",
    "value": 388
  }
]
*/

export default function Calendar(props) {

  return (
    <ResponsiveCalendar
        from="2019-01-12"
        to={new Date().toLocaleDateString('sv-SE')}
        emptyColor="#eeeeee"
        //colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        monthBorderColor="#ccc"
        monthBorderWidth={2}
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'row',
            translateY: 36,
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: 'right-to-left'
          }
        ]}
        {...props}
    />
  )
}