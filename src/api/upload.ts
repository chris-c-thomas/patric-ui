
import { getToken } from './auth'
import { updateAutoMetadata } from './ws-api'



export function uploadFile(file, url, path, onStart, onProgress, onComplete) {
  const {name, size} = file

  return new Promise((resolve, reject) => {
    var fd = new FormData()
    fd.append('upload', file)

    var req = new XMLHttpRequest()

    req.upload.addEventListener('progress', (evt) => {
      onProgress({
        name,
        progress: parseInt((evt.loaded / evt.total) * 100),
        url,
        path
      })
    })

    req.upload.addEventListener('load', (data) => {
      let p = path
      if (p.charAt(p.length - 1) != '/') {
        p += '/'
      }
      p += file.name

      updateAutoMetadata([p]).then(() => {
        onComplete({
          name,
          size,
          url,
          path
        })

        resolve(data)
      })
    })

    req.upload.addEventListener('error', (error) => {
      reject(error)
    })

    req.open('PUT', url, true)
    req.setRequestHeader( 'Authorization', 'OAuth ' + getToken())

    onStart({
      name,
      size,
      url,
      path
    })

    req.send(fd)
  })
}