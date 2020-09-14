import React, {useState, useEffect, createContext, useCallback} from 'react'

import { getStatus } from '../api/app-service'

const TIME_OUT = 9999999999

/*
interface State {
  queued: number,
  inProgress: number,
  completed: number,
  failed: number
}
*/

const JobStatusContext = createContext([{}])

const JobStatusProvider = (props) => {
  const [state, setState] = useState({
    queued: null,
    inProgress: null,
    completed: null,
    failed: null
  })

  useEffect(() => {
    const timer = poll()
    return () => timer.then(to => clearTimeout(to))
  }, [poll])

  const poll = useCallback(() => {
    return getStatus().then(status => {
      const queued = status.queued || 0,
        inProgress = status['in-progress'] || 0,
        completed = status.completed || 0,
        failed = status.failed || 0

      setState({queued, inProgress, completed, failed})
      return setTimeout(() => {
        poll()
      }, TIME_OUT)
    })
  }, [])



  return (
    <JobStatusContext.Provider value={[state]}>
      {props.children}
    </JobStatusContext.Provider>
  )
}

export { JobStatusContext, JobStatusProvider }