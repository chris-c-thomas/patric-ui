import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useAppParams() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const jsonStr = params.get('input')

  const [value, setValue] = useState<any>(JSON.parse(jsonStr))

  useEffect(() => {
    if (!jsonStr) return

    setValue(JSON.parse(jsonStr))
  }, [jsonStr])

  return value
}
