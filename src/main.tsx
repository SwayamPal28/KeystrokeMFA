import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Import the main App component
import './index.css'; // Import global styles

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
