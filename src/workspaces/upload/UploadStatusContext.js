import React, {useState, useEffect, createContext } from 'react'

import { create } from '../../api/ws-api'
import { uploadFile } from '../../api/upload'



const UploadStatusContext = createContext([{}])

function UploadStatusProvider(props) {
  const [active, setActive] = useState({})
  const [complete, setComplete] = useState({})
  const [progress, setProgress] = useState(0)
  const [inProgress, setInProgress] = useState([])

  const [promiseMapping, setPromiseMapping] = useState({})


  // whenever active changes, update total progress
  useEffect(() => {
    const paths = Object.keys(active)

    // if no uploads, nothing to do
    if (!paths.length) return

    const sum = paths.reduce((acc, path) =>
      acc + (active[path].progress || 0)
    , 0)

    setProgress(`${parseInt(sum / paths.length)}%`)
  }, [active])


  const onStart = (obj) => {
    const {fullPath} = obj
    setActive(prev => ({...prev, [fullPath]: obj}))
    setInProgress(prev => [...prev, obj])
  }


  const onProgress = (obj) => {
    const {fullPath} = obj
    setActive(prev => ({...prev, [fullPath]: obj}))
  }


  const onComplete = (obj) => {
    const {fullPath} = obj

    setActive(prev => {
      delete prev[fullPath]
      return prev
    })

    setComplete(prev => ({...prev, [fullPath]: obj}))

    // append again to force updates
    setInProgress(prev => [...prev, obj])
    setTimeout(() => setInProgress([]), 500)
  }


  const upload = (meta, file, path) => {

    // first create node
    create(meta, true, false).then((obj) => {
      let url = obj.linkRef

      // then start upload
      const prom = uploadFile(file, url, path, onStart, onProgress, onComplete)

      // store promise for cancellation
      setPromiseMapping(prev => ({...prev, [`${path}/${file.name}`]: prom}))

    }).catch((err) => {
      // todo(nc): implemnt overwrite option
      // only show prompt if given file-already-exists error
      const msg = err.response.data.error.message
      if (msg.indexOf('overwrite flag is not set') === -1) {
        return
      }
      alert(`could not over write object: ${meta.name}`)
    })
  }


  const uploadFiles = (fileMetas, fileObjects, path) => {
    fileMetas.forEach((fMeta, i) => {
      const file = fileObjects[i]
      upload(fMeta, file, path)
    })
  }


  const cancelUpload = (path) => {
    promiseMapping[path].abort()
    removeUpload(path)
  }


  const removeUpload = (path) => {
    setActive(prev => {
      delete prev[path]
      return prev
    })

    setComplete(prev => {
      delete prev[path]
      return prev
    })
  }


  const cancelAll = () => {
    for (const path of Object.keys(promiseMapping)) {
      promiseMapping[path].abort()
    }

    setActive({})
    setProgress(0)
  }


  return (
    <UploadStatusContext.Provider value={[
      {progress, active, complete, inProgress, cancelUpload, removeUpload, cancelAll}, uploadFiles
    ]}>
      {props.children}
    </UploadStatusContext.Provider>
  )
}

export { UploadStatusContext, UploadStatusProvider }