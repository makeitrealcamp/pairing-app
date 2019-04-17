import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Loading from "./Loading";
import auth from "./services/auth";
import sessions from "./services/sessions";
import assistances from "./services/assistances";

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      session: null,
      assistance: null
    };
  }

  async componentDidMount() {
    const session = await sessions.findActive();
    this.setState({
      loading: false,
      session: session,
    });
  }

  render() {
    return this.state.loading ? <Loading /> : this.renderPage();
  }

  renderPage() {
    return (
      <div className="home-page">
        { this.state.session ?
          <div className="session">
            <h1>{ this.state.session.name }</h1>
            <Link to="/assistance" className="btn">Ingresar a la sesión</Link>
          </div>
        :
          <h1>No hay ninguna sesión activa en este momento</h1> }
      </div>
    );
  }
};
