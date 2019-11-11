import React, {useState, useEffect, createContext} from 'react';
import config from './live-test-config'
import {get, all} from 'axios'

const TIMEOUT = 5000;

const LiveStatusContext = createContext([{}]);

const LiveStatusProvider = (props) => {
  const [state, setState] = useState({});
  const [time, setTime] = useState(null);

  // make ping requests, update state
  const updateState = () => {
    const proms = Object.keys(config).map(key => {
      return get(config[key].url).then(res => {
        if (res.status !== 200) throw res;
        if (key == 'dataAPI' && res.data.response.docs.length != 25) throw res;

        setState(obj => ({...obj, [key]: true}))
      }).catch(e => {
        setState(obj => ({...obj, [key]: false}))
      })
    })

    // update time
    all(proms).then(() => setTime(getTime()))


    setTimeout(updateState, TIMEOUT)
  }

  useEffect(() => {
    updateState()
  }, [])

  return (
    <LiveStatusContext.Provider value={[state, time]}>
      {props.children}
    </LiveStatusContext.Provider>
  );
}


const getTime = () =>  {
  var time = new Date().toTimeString().split(' ')[0];
  var hours = parseInt(time.split(':')[0]);
  hours = (hours + 11) % 12 + 1;
  return hours + time.slice(time.indexOf(':'));
}

export { LiveStatusContext, LiveStatusProvider };