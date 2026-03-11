import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './i18n'
import App from './App'
import { store } from './store'
import './index.css'

// Простая конфигурация как в инструкции
const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN,
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  </React.StrictMode>,
)
