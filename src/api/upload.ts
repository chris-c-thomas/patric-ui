import axios from 'axios'
import config from '../config'

import { getToken } from './auth'

import { updateAutoMetadata } from './ws-api'

import { WSObject } from './workspace.d'



const headers = {
  Authorization: 'OAuth ' + getToken()
}


export function uploadFile(file, url, workspacePath, onStart, onProgress, onComplete) {

  return new Promise((resolve, reject) => {
    var fd = new FormData()
    fd.append('upload', file)

    let inProgress = {},
      activeCount = 0,
      completeCount = 0,
      errorCount = 0,
      completedUploads = []


    inProgress[file.name] = { name: file.name, size: file.size, workspacePath }

    var req = new XMLHttpRequest()

    req.upload.addEventListener('progress', (evt) => {

      inProgress[file.name].loaded = evt.loaded
      inProgress[file.name].total = evt.total

      onProgress({
        filename: file.name,
        event: evt,
        progress: parseInt((evt.loaded / evt.total) * 100),
        url: url,
        workspacePath
      })

    })

    req.upload.addEventListener('load', (data) => {
      var p = workspacePath
      if (p.charAt(p.length - 1) != '/') {
        p += '/'
      }
      p += file.name

      updateAutoMetadata([p]).then(() => {
        activeCount--
        completeCount++
        completedUploads.push({ filename: file.name, size: file.size, workspacePath: workspacePath })

        Object.keys(inProgress).some((key) => {
          if (key == file.name) {
            delete inProgress[key]
          }
        })

        onComplete({
          filename: file.name,
          size: file.size,
          url: url,
          workspacePath: workspacePath
        })

        resolve(data)
      })
    })


    req.upload.addEventListener('error', function (error) {
      // console.log("Error Uploading File: ", error);
      activeCount--
      errorCount++
      reject(error)
    })


    req.open('PUT', url, true)

    for (let prop in headers) {
      // guard-for-in
      if (Object.prototype.hasOwnProperty.call(headers, prop)) {
        // console.log("Set Request Header: ", prop, this.headers[prop]);
        req.setRequestHeader(prop, headers[prop])
      }
    }

    onStart({
      type: 'UploadStart',
      filename: file.name,
      url: url,
      workspacePath
    })
    activeCount++

    req.send(fd)
  })
}