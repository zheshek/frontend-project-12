import { useRollbar } from '@rollbar/react'

export const useErrorLogger = () => {
  const rollbar = useRollbar()

  const logError = (error, customData = {}) => {
    console.error('Error:', error)
    rollbar?.error(error, customData)
  }

  const logWarning = (message, customData = {}) => {
    rollbar?.warning(message, customData)
  }

  const logInfo = (message, customData = {}) => {
    rollbar?.info(message, customData)
  }

  return {
    logError,
    logWarning,
    logInfo,
  }
}
