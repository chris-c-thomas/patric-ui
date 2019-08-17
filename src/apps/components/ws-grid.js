import React, {useEffect, useState} from 'react';


import * as WS from '../../api/workspace-api';


export default function WSGrid(props) {
  const [objs, setObjs] = useState(null);
  const [path, setPath] = useState('/nconrad@patricbrc.org/home');


  useEffect( () => {
    WS.list({path})
      .then((data) => {
        console.log(data)
        setObjs(data)
      })

  }, [path])

  function nav(path) {
    console.log('name', path)
    setPath({path})
  }

  return (
      <table className="basic">
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Owner</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {
            objs &&
            objs.map((obj, i) => {
              const {type, name, path} = obj;
              return (
                <tr key={i}>
                  <td>
                    {
                      type == 'folder' &&
                      <a onClick={(e) => nav(path)}>{name}</a>
                    }
                    {
                      type != 'folder' && name
                    }
                  </td>
                  <td>{obj.size}</td>
                  <td>{obj.owner.split('@')[0]}</td>
                  <td>{obj.created}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
  )

}