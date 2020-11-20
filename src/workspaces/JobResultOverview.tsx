import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { isoToHumanDateTime } from '../utils/units'
import { getMeta } from '../api/ws-api'

import Dialog from '../dialogs/BasicDialog'
import ErrorMsg from '../ErrorMsg'

import Button from '@material-ui/core/Button'

import ListIcon from '@material-ui/icons/ListAltRounded'
import StdOutIcon from '@material-ui/icons/FeaturedPlayList'
import StdErrorIcon from '@material-ui/icons/WarningRounded'
import ChartIcon from '@material-ui/icons/AssessmentRounded'
import TreeIcon from '@material-ui/icons/AccountTreeRounded'
import CodeIcon from '@material-ui/icons/CodeRounded'

import { WSObject } from 'api/workspace.d'


const encodePath = path => path.split('/')
  .map((p, i) => i == 1 ? p : encodeURIComponent(p)).join('/')



type ViewButton = {
  icon: JSX.Element,
  label: string,
  url: string
}

const getViewBtns = (meta: WSObject, objs: WSObject[]) : ViewButton[] => {
  const {autoMeta, path} = meta
  const jobType = autoMeta.app.id

  // defaults
  const icon = <ListIcon />, label = 'View'

  if (['GenomeAssembly2'].includes(jobType)) {
    return [{
      icon: <ChartIcon />,
      label: 'View report',
      url: `/files${getReportPath(objs)}`
    }]

  } else if (['GenomeAnnotation'].includes(jobType)) {
    return [{
      icon,
      label: 'View genome',
      url: `/genome/${getGenomeID(objs)}/overview`
    }]

  } else if (['CodonTree', 'PhylogeneticTree'].includes(jobType)) {
    return [{
      icon: <TreeIcon />,
      label,
      url: `/view/PhylogeneticTree?labelSearch=true&idType=genome_id&labelType=genome_name&wsTreeFolder=${encodePath(path)}`
    }]

  } else if (['ComprehensiveGenomeAnalysis'].includes(jobType)) {
    return [
      {icon: <ListIcon />, label: 'View genome', url: `/genome/${getGenomeID(objs)}/overview`},
      {icon: <ChartIcon />, label: 'View genome report', url: `/files${getReportPath(objs)}`}
    ]
  }

  return []
}


const getGenomeID = (objs: WSObject[]) => {
  if (!objs) return

  const genomes = objs.filter(o => o.type == 'genome')
  const id = genomes[0]?.autoMeta?.genome_id
  if (id) return id

  throw Error('Could not find genome_id')
}


const getReportPath = (objs: WSObject[]) => {
  if (!objs) return

  const htmls = objs.filter(o => o.type == 'html')
  const id = htmls[0]?.path
  if (id) return id

  throw Error('Could not find a report path')
}


const OverviewTable = ({data}) => {
  return (
    <table>
      <tbody>
        <tr><td>Job ID</td><td>{data.id}</td></tr>
        <tr><td>Start time</td><td>{isoToHumanDateTime(data.start_time * 1000)}</td></tr>
        <tr><td>End time</td><td>{isoToHumanDateTime(data.end_time * 1000)}</td></tr>
      </tbody>
    </table>
  )
}


type Props = {
  path: string
  wsObjects: WSObject[]
}

const JobResultOverview = (props: Props) => {
  const {path, wsObjects} = props


  const [meta, setMeta] = useState(null)
  const [autoMeta, setAutoMeta] = useState(null)
  const [viewBtns, setViewBtns] = useState(null)
  const [error, setError] = useState(null)

  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    getMeta(path)
      .then(obj => {
        setMeta(obj)
        setAutoMeta(obj.autoMeta)
        setViewBtns(getViewBtns(obj, wsObjects))
      })
      .catch(err => {
        const errMsg = err.response.data.error.data
        if (errMsg.includes('Object not found'))
          err = Error('Object not found.  This may be because your job is still running or because the job result no longer exists.')
        setError(err)
      })
  }, [path, wsObjects])

  return (
    <Root>
      <h2>{autoMeta ? autoMeta.app.id : ''} Job Result</h2>

      {autoMeta &&
        <div className="overview flex space-between">

          <div className="flex align-items-end">
            <OverviewTable data={autoMeta} />

            {viewBtns &&
              <ViewButtons>
                {viewBtns.map(btn =>
                  <Button
                    component={Link}
                    to={btn.url}
                    startIcon={btn.icon}
                    variant="outlined"
                    disableRipple
                    key={btn.label}
                  >
                    {btn.label}
                  </Button>
                )}
              </ViewButtons>
            }
          </div>


          <div className="actions flex align-items-end">
            <div className="flex-column">
              <DevToolsTitle>Developer Tools</DevToolsTitle>
              <div>
                <Button
                  onClick={() => setShowDialog(true)}
                  startIcon={<CodeIcon />}
                  size="small"
                  disableRipple
                >
                  Parameters
                </Button>
                <Button
                  onClick={() => alert('todo: implement')}
                  startIcon={<StdOutIcon/>}
                  size="small"
                  disableRipple
                >
                  Std Out
                </Button>
                <Button
                  onClick={() => alert('todo: implement')}
                  startIcon={<StdErrorIcon/>}
                  size="small"
                  disableRipple
                >
                  Std Error
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {autoMeta && showDialog &&
        <Dialog title="Job Parameters"
          primaryBtnText="close"
          maxWidth="lg"
          content={<pre>{JSON.stringify(autoMeta.parameters, null, 4)}</pre>}
          onClose={() => setShowDialog(false)}
          onPrimaryClick={() => setShowDialog(false)}
        />
      }

      {error &&
        <ErrorMsg error={error} noContact/>
      }
    </Root>
  )
}

const Root = styled.div`
  .overview table {
    min-width: 250px;
  }

  .actions .MuiButton-root {
    margin-right: 20px;
  }

  table {
    font-size: 1em;
    tr > td:first-child {
      font-weight: bold;
    }
  }
`

const ViewButtons = styled.div`
  .MuiButton-root {
    margin: 10px 10px 0 0;
  }
`

const DevToolsTitle = styled.div`
  font-size: .8em;
  font-weight: bold;
  margin-bottom: 5px;
`

export default JobResultOverview
