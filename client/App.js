import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

// TODO: Migrate all views
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Login from './Login';
import GithubCallback from './GithubCallback';
import Assistance from './Assistance';
import Feedback from './Feedback';
import Message from './Message';
import Participants from './Participants';
// New Style
import AdminRoute from './components/admin/AdminRoute';
import AdminSessions from 'views/admin/Sessions';
import AdminSessionsNew from 'views/admin/SessionsNew';
import AdminParticipants from 'views/admin/Assistances';

import NotFound from 'components/general/NotFound';

import './styles/styles.scss';

library.add(fab);
library.add(far);
library.add(fas);

const App = () => {
  return (
    <>
      <header className="main-header">
        <span className="brand">Curso básico de Python</span>
        <img src="/logo-white.png" />
      </header>

      <div className="content">
        <div className="page-wrapper">
          <Router>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/auth/github/callback" component={GithubCallback} />
              <PrivateRoute path="/assistance" component={Assistance} />
              <PrivateRoute path="/assistances/:id/feedback" component={Feedback} />
              <Route path="/thank-you" component={Message} />

              {/* Admin Routes */}
              <AdminRoute exact path="/admin/participants" component={Participants} />
              <AdminRoute exact path="/admin/sessions" component={AdminSessions} />
              <AdminRoute exact path="/admin/sessions/new" component={AdminSessionsNew} />
              <AdminRoute exact path="/admin/sessions/:id/assistances" component={AdminParticipants} />

              <Route component={NotFound} />
            </Switch>
          </Router>
        </div>
      </div>
    </>
  );
};

export default App;
