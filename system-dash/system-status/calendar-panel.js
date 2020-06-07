import React, {useState, useEffect, useReducer} from 'react'
import styled from 'styled-components'

import Subtitle from '../../src/home/subtitle'
import HeatmapCalendar from '../../components/heatmap-calendar/src/HeatmapCalendar'

import MenuButton from '../../components/menu-button'
import DownloadIcon from '@material-ui/icons/CloudDownloadOutlined'
import MenuItem from '@material-ui/core/MenuItem'
// import CaretIcon from '@material-ui/icons/ArrowDropDownRounded'

import { downloadFile } from '../utils/download'



const getCalendarCSV = (data, type) => {
  const serviceNames = data[data.length - 1].services.map(obj => obj.name)
  const header = ['Date', 'Passed', 'Failed', 'Total', ...serviceNames]

  const rows = data.map(({date, passed, failed, total, services}) => [
    `"${date.toLocaleString()}"`,
    passed,
    failed,
    total,
    ...serviceNames.map(name => {
      const {failed, duration} = services.filter(obj => obj.name == name)[0]

      if (type == 'failed-percents')
        return [(failed / total) * 100]
      else if (type == 'failed-counts')
        return failed
      else if ('durations')
        return duration
    })
  ])

  return [
    header.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
}


const onDownload = (data, type) => {
  downloadFile(getCalendarCSV(data, type), `service-${type}.csv`)
}


const calColorMap = {
  noValue: '#f2f2f2',
  green1: '#b2dfb0',
  green2: '#8ed88b',
  green3: '#4cc948',
  green4: '#06af00',
  red1: '#ffc5c5',
  red2: '#ff8686',
  red3: '#d34848',
  red4: '#890000'
}


const Calendar = ({data, onClick, dataKey}) =>
  <HeatmapCalendar
    data={data}
    startDate={new Date('2020-1-1')}
    endDate={new Date('2020-12-31')}
    dataKey={dataKey}
    onClick={onClick}
    tooltip={CalTooltip}
    tooltipOutline
    histogram={false}
    histogramHeight={100}
    cellW={17}
    cellH={17}
    colorForValue={(val, obj) => {
      if (val == null)
        return calColorMap.noValue

      if (val <= 0)
        return calColorMap.green2
      else if (val <= 5)
        return calColorMap.red1
      else if (val <= 10)
        return calColorMap.red2
      else if (val <= 50)
        return calColorMap.red3
      else if (val > 50)
        return calColorMap.red4
    }}
  />


const CalTooltip = ({date, value, data}) =>
  <div>
      <TTitle>{date.toDateString()}</TTitle>
      {data &&
        <div>{data.failed} events</div>
      }
  </div>


const TTitle = styled.div`
  font-size: 1.2em;
  border-bottom: 1px solid #fff;
  padding-bottom: 5px;
  margin-bottom: 5px;
`



export default function CalendarPanel({data, onDayClick, filterBy}) {

  const [openDownloadMenu, setOpenDownloadMenu] = useState(false)
  const [dataKey, setDataKey] = useState('failed');

  useEffect(() => {
    setDataKey(filterBy == 'All' ? 'failed' : filterBy + '_failures')
  }, [filterBy])

  const handleDownload = (type) => {
    setOpenDownloadMenu(false)
    onDownload(data, type)
  }

  return (
    <div>
      <Subtitle noUpper inline>
        Calendar
      </Subtitle>

      <MenuButton
        startIcon={<DownloadIcon />}
        label="Download"
        size="small"
        className="pull-right"
        open={openDownloadMenu}
      >
        <MenuItem onClick={() => handleDownload('failed-percents')}>Failure percent</MenuItem>
        <MenuItem onClick={() => handleDownload('failed-counts')}>Failure count</MenuItem>
        <MenuItem onClick={() => handleDownload('durations')}>Duration</MenuItem>
      </MenuButton>

      {
        data &&
        <Calendar data={data} onClick={onDayClick} type="linear" dataKey={dataKey}/>
      }
    </div>
  )
}



