import Rollbar from 'rollbar'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN,
  environment: import.meta.env.MODE || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        code_version: '1.0.0',
        source_map_enabled: true,
      },
    },
  },
  enabled: import.meta.env.PROD || import.meta.env.MODE === 'production',
}

export const rollbar = new Rollbar(rollbarConfig)

export const providerConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: import.meta.env.PROD || import.meta.env.MODE === 'production',
}

export default rollbar
