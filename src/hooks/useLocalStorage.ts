// from https://usehooks.com/useLocalStorage/

import { useState } from 'react'


export default function useLocalStorage<T>(key: string, initialValue: T) {

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      console.log('value', JSON.parse(item))
      return item ? JSON.parse(item) : initialValue
    } catch (error) {

      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  })


  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }

  return [storedValue, setValue]
}
