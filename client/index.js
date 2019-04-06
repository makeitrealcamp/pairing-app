import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

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
          <Route component={NotFound}/>
        </Switch>
      </div>
    </Router>
  );
};

const Home = () => {
  return (
    <div>
      <h1>Este es el home</h1>
      <a href="/auth/github">Ingresar con Github</a>
    </div>
  )
};

const About = () => <h1>Este es el about </h1>;

const NotFound = () => <h1>No encontrado</h1>;

render(<App />, document.getElementById('app'));
