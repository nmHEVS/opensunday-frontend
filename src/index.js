import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';
import auth_config from './auth_config';
import { Auth0Provider } from "@auth0/auth0-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppWrapper from "./AppWrapper";

ReactDOM.render(
  <Auth0Provider
    domain={auth_config.domain}
    clientId={auth_config.clientId}
    redirectUri={window.location.origin}
    audience={auth_config.audience}
    useRefreshTokens={true}
  >
    <AppWrapper />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
