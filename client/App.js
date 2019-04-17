import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Login from "./Login";
import GithubCallback from "./GithubCallback";
import Assistance from "./Assistance";
import Feedback from "./Feedback";
import NotFound from "./NotFound";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import './styles/styles.scss';

library.add(fab);

export default () => {
  return (
    <React.Fragment>
      <header className="main-header">
        <span className="brand">Curso básico de JavaScript</span>
        <img src="/logo.png" />
      </header>
      <div className="content">
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/auth/github/callback" component={GithubCallback} />
            <PrivateRoute path="/assistance" component={Assistance} />
            <PrivateRoute path="/assistance/:id/feedack" component={Feedback} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    </React.Fragment>
  );
};
