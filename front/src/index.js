import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL="http://192.168.0.16:8080"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <App />
);
