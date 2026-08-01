import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { HelmetProvider } from "react-helmet-async";
createRoot(document.getElementById('root')).render(<HelmetProvider>
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>
</HelmetProvider>);
