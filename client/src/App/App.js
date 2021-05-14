import React from 'react';
import { Route, Switch, withRouter } from "react-router-dom";

import logo from '../logo.svg';
import './App.scss';

import Street from '../components/Street/Street';
import NotFound from '../components/shared/NotFound/NotFound';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Switch>
        <Route exact path="/" render={() => (<Street />)} />

        {/* catch all */}
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
}

export default withRouter(App);

