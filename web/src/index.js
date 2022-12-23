import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SnackbarProvider } from 'material-ui-snackbar-provider'
import Alert from './components/Alerts/Alert';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SnackbarProvider SnackbarComponent={Alert}>
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);