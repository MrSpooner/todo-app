import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import { GlobalStyle } from "./styles/GlobalStyle";
import { Provider } from "react-redux";
import { store } from './store';
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <GlobalStyle />
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
