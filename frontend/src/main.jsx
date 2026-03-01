import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Provider as RollbarProvider, ErrorBoundary } from "@rollbar/react";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { store } from "./store";
import "./i18n";
import "./index.css";

// Простая конфигурация как в инструкции
const rollbarConfig = {
  accessToken:
    "3563fcd1122c43d79cc417558cd944cd8deea3b40375f3b72c7130329e08b736195c5d70983a030b109e89f65df30a83", // замените на ваш токен
  environment: "production",
  captureUncaught: true,
  captureUnhandledRejections: true,
};

ReactDOM.createRoot(document.getElementById("root")).render(
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
);
