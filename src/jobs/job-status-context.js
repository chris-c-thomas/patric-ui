import React, {useState, useEffect} from 'react';

import { getStatus } from '../api/app-service';

const JobStatusContext = React.createContext([{}]);

const JobStatusProvider = (props) => {
  const [state, setState] = useState({
    queued: '',
    inProgress: '',
    completed: '...'
  });

  useEffect(() => {
    getStatus().then(status => {
      const queued = status.queued || 0,
            inProgress = status['in-progress'] || 0,
            completed = status.completed || 0;

      setState({queued, inProgress, completed})
    })
  }, [])

  return (
    <JobStatusContext.Provider value={[state]}>
      {props.children}
    </JobStatusContext.Provider>
  );
}

export { JobStatusContext, JobStatusProvider };