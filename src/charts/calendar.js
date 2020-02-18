
import React from 'react';
import { CalendarCanvas } from '@nivo/calendar';
import { AutoSizer } from 'react-virtualized';

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
    <AutoSizer>
      {({ height, width }) => (
        <CalendarCanvas
          width={width}
          height={height}
          to={new Date().toLocaleDateString('sv-SE')}
          emptyColor="#eeeeee"
          margin={{ top: 40, right: 40, bottom: 70, left: 40 }}
          monthBorderColor="#ccc"
          monthBorderWidth={2}
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'row',
              itemCount: props.colors.length || 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: 'right-to-left'
            }
          ]}
          tooltip={({ day, value, color }) => (
            <><b>{day}</b>: {value.toString().slice(0, 6)}%</>
          )}
          {...props}
        />
      )}
    </AutoSizer>
  )
}
