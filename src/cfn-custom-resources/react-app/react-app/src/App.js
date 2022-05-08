// Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from "react";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";
import "./App.css";

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_USER_POOL_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
    cookieStorage: {
      domain: process.env.REACT_APP_COOKIE_DOMAIN, // Use a single space " " for host-only cookies
      expires: null, // null means session cookies
      path: "/",
      secure: true, // for developing on localhost over http: set to false
      sameSite: "lax",
    },
    oauth: {
      domain: process.env.REACT_APP_USER_POOL_AUTH_DOMAIN,
      scope: process.env.REACT_APP_USER_POOL_SCOPES.split(","),
      redirectSignIn: `https://${window.location.hostname}${process.env.REACT_APP_USER_POOL_REDIRECT_PATH_SIGN_IN}`,
      redirectSignOut: `https://${window.location.hostname}${process.env.REACT_APP_USER_POOL_REDIRECT_PATH_SIGN_OUT}`,
      responseType: "code",
    },
  },
});

const App = () => {
  const [state, setState] = useState({
    email: undefined,
    username: undefined,
  });

  useEffect(() => {
    Auth.currentSession().then((user) =>
      setState({
        username: user.username,
        email: user.getIdToken().decodePayload().email,
      })
    );
    // Schedule check and refresh (when needed) of JWT's every 5 min:
    const i = setInterval(() => Auth.currentSession(), 5 * 60 * 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="App">
      <h1>Skoda-Auto Jira and Confluence Cluster Controls</h1>

      <p className="explanation">
        Welcome <strong>{state.email || state.username}</strong>. You are signed in!
      </p>

      <p className="explanation">
        <a href="https://iii96lb5h2.execute-api.us-east-1.amazonaws.com/default/start-sa-test-cluster-0-01" target="_blank"><button>START</button></a><a href="https://b9902qynn2.execute-api.us-east-1.amazonaws.com/default/stop-sa-test-cluster-0-01" target="_blank"><button>STOP</button></a><a href="https://afu8hpf1ek.execute-api.us-east-1.amazonaws.com/default/status-sa-test-cluster-0-01" target="_blank"><button>STATUS</button></a>{" "}<button onClick={() => Auth.signOut()}>Sign out</button>
      </p>

    </div>
  );
};

export default App;
