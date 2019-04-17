import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Login from "./Login";
import GithubCallback from "./GithubCallback";
import Assistance from "./Assistance";
import Feedback from "./Feedback";
import Message from "./Message";
import NotFound from "./NotFound";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './styles/styles.scss';

library.add(fab);
library.add(far);
library.add(fas);

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
            <PrivateRoute path="/assistances/:id/feedback" component={Feedback} />
            <Route path="/thank-you" component={Message} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    </React.Fragment>
  );
};
