import React from 'react';
import { BarCanvas } from '@nivo/bar'
import { AutoSizer } from 'react-virtualized';

/*
const exampleData =
[
  {
    "country": "AD",
    "hot dog": 13,
    "hot dogColor": "hsl(174, 70%, 50%)",
    "burger": 109,
    "burgerColor": "hsl(62, 70%, 50%)",
    "sandwich": 60,
    "sandwichColor": "hsl(170, 70%, 50%)",
    "kebab": 149,
    "kebabColor": "hsl(41, 70%, 50%)",
    "fries": 102,
    "friesColor": "hsl(7, 70%, 50%)",
    "donut": 181,
    "donutColor": "hsl(310, 70%, 50%)"
  },
  {
    "country": "AE",
    "hot dog": 44,
    "hot dogColor": "hsl(93, 70%, 50%)",
    "burger": 15,
    "burgerColor": "hsl(180, 70%, 50%)",
    "sandwich": 139,
    "sandwichColor": "hsl(39, 70%, 50%)",
    "kebab": 185,
    "kebabColor": "hsl(110, 70%, 50%)",
    "fries": 28,
    "friesColor": "hsl(307, 70%, 50%)",
    "donut": 13,
    "donutColor": "hsl(85, 70%, 50%)"
  },
]
*/

export default function BarChart(props) {
  const {
    margin,
  } = props

  return (
    <AutoSizer>
      {({ height, width }) => (
        <BarCanvas
          height={height}
          width={width}
          margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
          colors={{ scheme: 'nivo' }}
          enableLabel={false}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          axisTop={null}
          axisRight={null}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          legends={[]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          {...props}
        />
      )}
    </AutoSizer>
  )
}
