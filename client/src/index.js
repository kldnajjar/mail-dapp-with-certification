import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { GunContextProvider } from './context/useGunContext';
import App from './App';

import 'broadcastchannel-polyfill';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/general.css';

ReactDOM.render(
  <BrowserRouter>
    <GunContextProvider>
      <App />
    </GunContextProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

module.hot.accept();
