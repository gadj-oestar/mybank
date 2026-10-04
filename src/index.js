import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { DEMO } from './lib/api';
import './css/styles.css';

// La démo est servie en fichiers statiques : le routage par hash évite les 404 au rechargement.
const Router = DEMO ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
