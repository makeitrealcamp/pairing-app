import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import GithubCallback from "./GithubCallback";
import Assistance from "./Assistance";
import NotFound from "./NotFound";
import './styles/styles.scss';

export default () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute path="/assistance" component={Assistance} />
        <Route path="/auth/github/callback" component={GithubCallback} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};
