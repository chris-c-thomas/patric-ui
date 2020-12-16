
import { getToken } from './auth'
import { updateAutoMetadata } from './ws-api'


interface AbortablePromise<T> extends Promise<T> {
  abort: () => void;
}


export type UploadStatus = {
  fullPath: string
  path: string
  name: string
  size?: number
  progress?: number
}



export function uploadFile(
  file,
  url: string,
  path: string,
  onStart?: (status: UploadStatus) => void,
  onProgress?: (status: UploadStatus) => void,
  onComplete?: (status: UploadStatus) => void
) : AbortablePromise<any> {
  const {name, size} = file
  const fullPath = `${path}/${name}`

  const xhr = new XMLHttpRequest()
  let fd = new FormData()
  fd.append('upload', file)

  const promise = new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (evt) => {
      if (!onProgress) return

      onProgress({
        fullPath,
        path,
        name,
        size,
        progress: Math.floor((evt.loaded / evt.total) * 100)
      })
    })

    xhr.upload.addEventListener('load', (data) => {
      let p = path
      if (p.charAt(p.length - 1) != '/') {
        p += '/'
      }
      p += file.name

      updateAutoMetadata([p]).then(() => {
        if (!onComplete) return

        onComplete({
          fullPath,
          path,
          name,
          size,
          progress: 100
        })
        resolve(data)
      })
    })

    xhr.upload.addEventListener('error', (error) => reject(error))

    xhr.open('PUT', url, true)
    xhr.setRequestHeader( 'Authorization', 'OAuth ' + getToken())
    xhr.send(fd)

    if (!onStart) {
      return
    }

    onStart({fullPath, path, name, size})

  })

  // add promise cancel (not currently available on promises)
  const abort = () => {
    xhr.abort()
  }
  const abortablePromise = Object.assign(promise, { abort })

  return abortablePromise
}