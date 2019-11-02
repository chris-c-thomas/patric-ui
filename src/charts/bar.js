import React from 'react';
import { ResponsiveBar } from '@nivo/bar'

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

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export default function BarChart(props) {
  const {
    data, keys, indexBy,
    margin,
    xLabel, yLabel,
    xLabelOffset,
    noXLabels
  } = props

  return (
    <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={margin || { top: 50, right: 130, bottom: 100, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        enableLabel={false}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'foo'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'bar'
                },
                id: 'lines'
            }
        ]}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={noXLabels ? null : {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 25,
            legend: xLabel,
            legendPosition: 'middle',
            legendOffset: xLabelOffset || 50
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: yLabel,
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        {...props}
    />
  )
}
