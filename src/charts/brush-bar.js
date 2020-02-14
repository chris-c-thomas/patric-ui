import React from 'react'
import {BarChart, Bar, Brush,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell
} from 'recharts'

/* sample data
const data = [
  {name: '1', uv: 300, pv: 456},
  {name: '2', uv: -145, pv: 230},
  {name: '3', uv: -100, pv: 345},
  {name: '4', uv: -8, pv: 450},
  {name: '5', uv: 100, pv: 321},
  {name: '6', uv: 9, pv: 235},
  {name: '7', uv: 53, pv: 267},
  {name: '8', uv: 252, pv: -378},
  {name: '9', uv: 79, pv: -210},
];
*/

const ColoredBar = (props) => {
  const {x, y, width, height, colorBy} = props;
  if (props.colorBy)
    return <rect x={x} y={y} width={width} height={height} fill={colorBy(props)} />
}

export default function BrushBar(props)  {
  const {
    data, xDataKey, dataKey, yMax, colorBy, brushColor,
    units, showLegend
  } = props;

  return (
    <ResponsiveContainer width="100%" height="85%">
      <BarChart data={data}
        margin={{top: 20, right: 20, left: 20, bottom: 20}} {...props}
      >
        <XAxis dataKey={xDataKey} />
        <YAxis domain={[0, yMax]}/>
        <Tooltip
          formatter={(value, name, props) => `${value}${units || ''}`}
        />
        {showLegend &&
          <Legend verticalAlign="top" wrapperStyle={{lineHeight: '40px'}}/>
        }
        <CartesianGrid vertical={false} strokeDasharray="3 3"/>
        <Brush
          dataKey={xDataKey}
          height={40}
          stroke={brushColor || '#8884d8'}
          startIndex={data.length > 300 ? data.length - 300 : 0}
        />
        <Bar dataKey={dataKey} fill="#8884d8" shape={<ColoredBar colorBy={colorBy} />} />
      </BarChart>
    </ResponsiveContainer>
  );
}

