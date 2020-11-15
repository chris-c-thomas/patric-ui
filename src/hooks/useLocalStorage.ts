/* eslint-disable react/display-name */
import {useState, useEffect, useMemo} from 'react'


const defaultSetings = {
  uiSettings: {
    showDetails: true
  }
}


function useLocalStorage (storageKey, key) {

  const initial = useMemo(() => {
    const jsonStr = localStorage.getItem(storageKey)

    let init
    try {
      init = jsonStr ? JSON.parse(jsonStr) : defaultSetings[storageKey]
    } catch (err) {
      console.warn('useLocalStorage: could not parse object.  Using default settings.')
      init = defaultSetings[storageKey]
    }

    return init
  }, [storageKey])


  const [state, setState] = useState<object>(initial)


  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [storageKey, key, state])


  const storeValue = val => {
    const value =
      val instanceof Function ? val(state[key]) : val

    setState(prev => ({...prev, [key]: value}))
  }

  return [state[key], storeValue]
}



export default useLocalStorage