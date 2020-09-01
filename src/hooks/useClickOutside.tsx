import {useEffect} from 'react'



export default function useClickOutside(
  ref: {current: HTMLElement},
  callback: () => void,
  except: string = 'button'
) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (except && event.target.closest(except))
        return

      if (ref.current && !ref.current.contains(event.target))
        callback()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}
