import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import { isoToHumanDateTime } from '../utils/units'
import { getMeta } from '../api/ws-api'

import Dialog from '../dialogs/BasicDialog'
import ErrorMsg from '../ErrorMsg'

import Button from '@material-ui/core/Button'



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
}

const JobResultOverview = (props: Props) => {
  const {path} = props

  const [meta, setMeta] = useState(null)
  const [error, setError] = useState(null)

  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    getMeta(path)
      .then(obj => setMeta(obj.autoMeta))
      .catch(err => {
        const errMsg = err.response.data.error.data
        if (errMsg.includes('Object not found'))
          err = Error('Object not found.  This may be because your job is still running or because the job result no longer exists.')
        setError(err)
      })
  }, [path])

  return (
    <Root>
      <h2>Job Result</h2>

      {meta &&
        <div className="overview flex">
          <OverviewTable data={meta} />

          <div className="flex-column">
            <Button onClick={() => setShowDialog(true)} size="small" disableRipple>
              View Parameters
            </Button>
          </div>
        </div>
      }

      {meta && showDialog &&
        <Dialog title="Job Parameters"
          primaryBtnText="close"
          maxWidth="lg"
          content={<pre>{JSON.stringify(meta.parameters, null, 4)}</pre>}
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
    margin-right: 200px;
  }

  table {
    font-size: 1em;
    tr > td:first-child {
      font-weight: bold;
    }
  }
`

export default JobResultOverview
