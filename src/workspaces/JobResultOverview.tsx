import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { isoToHumanDateTime } from '../utils/units'
import { getMeta } from '../api/ws-api'

import Dialog from '../dialogs/BasicDialog'
import ErrorMsg from '../ErrorMsg'


import Button from '@material-ui/core/Button'
import ListIcon from '@material-ui/icons/ListRounded'
import StdOutIcon from '@material-ui/icons/FeaturedPlayList'
import StdErrorIcon from '@material-ui/icons/WarningRounded'

// view icons
import ViewIcon from '@material-ui/icons/VisibilityRounded'
import TreeIcon from '@material-ui/icons/AccountTreeRounded'
import { WSObject } from 'api/workspace.d'


const encodePath = path => path.split('/')
  .map((p, i) => i == 1 ? p : encodeURIComponent(p)).join('/')



/**
 * takes object meta, returns appropriate viewer url
 * @param meta object meta
 */
const getViewerURL = (meta, objs) => {
  const {path, autoMeta} = meta
  const jobType = autoMeta.app.id

  let url
  if (['CodonTree', 'PhylogeneticTree'].includes(jobType)) {
    url = `/view/PhylogeneticTree?labelSearch=true&idType=genome_id&labelType=genome_name&wsTreeFolder=${encodePath(path)}`
  } else if (['GenomeAnnotation'].includes(jobType)) {
    url = `/genome/${getGenomeID(objs)}/overview`
  }

  return url
}


const getIcon = (meta) => {
  const {autoMeta} = meta
  const jobType = autoMeta.app.id

  let icn
  if (['CodonTree', 'PhylogeneticTree'].includes(jobType))
    icn = <TreeIcon />
  else
    icn = <ViewIcon />

  return icn
}


const getGenomeID = (objs) => {
  const genomes = objs.filter((o) => o.type == 'genome')
  const id = genomes[0].autoMeta.genome_id
  if (id) return id

  throw Error('Missing ID')
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
  const [viewURL, setViewURL] = useState(null)
  const [error, setError] = useState(null)

  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    getMeta(path)
      .then(obj => {
        setMeta(obj)
        setAutoMeta(obj.autoMeta)
        setViewURL(getViewerURL(obj, wsObjects))
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

          <div className="flex align-items-center">
            <OverviewTable data={autoMeta} />

            {viewURL &&
              <Button
                component={Link}
                to={viewURL}
                startIcon={getIcon(meta)}
                variant="outlined"
                disableRipple
              >
                View
              </Button>
            }
          </div>


          <div className="actions flex align-items-center">
            <div className="flex-column">
              <DevToolsTitle>Developer Tools</DevToolsTitle>
              <div>
                <Button
                  onClick={() => setShowDialog(true)}
                  startIcon={<ListIcon/>}
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
    margin-right: 100px;
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

const DevToolsTitle = styled.div`
  font-size: .8em;
  font-weight: bold;
  margin-bottom: 5px;
`

export default JobResultOverview
