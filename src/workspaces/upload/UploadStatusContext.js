import React, {useState, useEffect, createContext } from 'react'

import { create } from '../../api/ws-api'
import { uploadFile } from '../../api/upload'



const UploadStatusContext = createContext([{}])

function UploadStatusProvider(props) {
  const [active, setActive] = useState({})
  const [progress, setProgress] = useState(0)


  // whenever active changes, update total progress
  useEffect(() => {
    const names = Object.keys(active)

    // if no uploads, nothing to do
    if (!names.length) return

    const sum = names.reduce((acc, name) =>
      acc + (active[name].progress || 0)
    , 0)

    setProgress(`${parseInt(sum / names.length)}%`)
  }, [active])


  const upload = (meta, file, path) => {

    // create node
    create(meta, true, false).then((obj) => {
      let url = obj.linkRef

      // start upload
      uploadFile(file, url, path, (obj) => {
        // onStarted
        const {name} = obj
        setActive(prev => ({...prev, [name]: obj}))
      }, (obj) => {
        // progress
        const {name} = obj
        setActive(prev => ({...prev, [name]: obj}))
      }, (obj) => {
        // completed
        const {name} = obj
        setActive(prev => {
          delete prev[name]
          return prev
        })
      })

    }).catch((err) => {
      // todo(nc): implemnt overwrite
      const msg = err.response.data.error.message
      // only show prompt if given file-already-exists error
      if (msg.indexOf('overwrite flag is not set') === -1) {
        return
      }

      // const message = 'Are you sure you want to overwrite <i>' + fileMeta.path + fileMeta.name + '</i> ?'
      // implement overwrite dialog
      alert(`could not over write object: ${meta.name}`)
    })
  }


  const uploadFiles = (fileMetas, fileObjects, path) => {
    fileMetas.forEach((fMeta, i) => {
      const file = fileObjects[i]
      upload(fMeta, file, path)
    })
  }


  return (
    <UploadStatusContext.Provider value={[{progress, active}, uploadFiles]}>
      {props.children}
    </UploadStatusContext.Provider>
  )
}

export { UploadStatusContext, UploadStatusProvider }