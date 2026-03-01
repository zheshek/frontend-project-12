import Rollbar from 'rollbar';

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN || '3563fcd1122c43d79cc417558cd944cd8deea3b40375f3b72c7130329e08b736195c5d70983a030b109e89f65df30a83',
  environment: import.meta.env.MODE || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        code_version: '1.0.0',
        source_map_enabled: true
      }
    }
  },
  enabled: import.meta.env.PROD || process.env.NODE_ENV === 'production',
};

export const rollbar = new Rollbar(rollbarConfig);

export const providerConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN || '3563fcd1122c43d79cc417558cd944cd8deea3b40375f3b72c7130329e08b736195c5d70983a030b109e89f65df30a83',
  environment: import.meta.env.MODE || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: import.meta.env.PROD || process.env.NODE_ENV === 'production',
};

export default rollbar;
