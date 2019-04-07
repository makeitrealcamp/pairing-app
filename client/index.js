import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/auth/github/callback" component={GithubCallback} />
          <Route component={NotFound}/>
        </Switch>
      </div>
    </Router>
  );
};

const Home = () => {
  return (
    <div>
      <h1>Este es el home, bienvenidos</h1>
      <a href="/auth/github">Ingresar con Github</a>
    </div>
  )
};

const About = () => <h1>Este es el about </h1>;

const NotFound = () => <h1>No encontrado</h1>;

class GithubCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirect: false };

    const qs = queryString.parse(location.search);
    axios.post("/auth/github/token", { code: qs.code })
      .then((response) => {
        localStorage.setItem('auth_token', response.data.token);
        this.setState({ redirect: true });
      });
  }

  render() {
    return this.state.redirect ? <Redirect to="/" /> : <h1>Autenticando ...</h1>
  }
}

render(<App />, document.getElementById('app'));
