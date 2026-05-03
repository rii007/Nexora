import { useCallback, useState } from 'react'

function useAsyncAction(asyncFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const run = useCallback(
    async (...args) => {
      setLoading(true)
      setError('')
      setSuccess('')

      try {
        const result = await asyncFn(...args)
        return result
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Something went wrong'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [asyncFn],
  )

  return {
    loading,
    error,
    success,
    setError,
    setSuccess,
    clearMessages: () => {
      setError('')
      setSuccess('')
    },
    run,
  }
}

export { useAsyncAction }
