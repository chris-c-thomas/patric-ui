import React, {useState, useEffect, createContext} from 'react'

import { getStatus } from '../api/app-service'

const JobStatusContext = createContext([{}])

const JobStatusProvider = (props) => {
  const [state, setState] = useState({
    queued: '',
    inProgress: '',
    completed: '',
    failed: ''
  })

  useEffect(() => {
    const timer = poll()
    return () => clearTimeout(timer)
  }, [])

  const poll = () => {
    console.log('fetching jobs status')
    return getStatus().then(status => {
      const queued = status.queued || 0,
        inProgress = status['in-progress'] || 0,
        completed = status.completed || 0,
        failed = status.failed || 0

      setState({queued, inProgress, completed, failed})
      return setTimeout(() => {
        poll()
      }, 5000)
    })
  }


  return (
    <JobStatusContext.Provider value={[state]}>
      {props.children}
    </JobStatusContext.Provider>
  )
}

export { JobStatusContext, JobStatusProvider }