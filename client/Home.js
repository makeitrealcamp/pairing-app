import React from 'react';
import { Link, Redirect } from 'react-router-dom';
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
    return this.state.loading ? this.renderLoading() : this.renderPage();
  }

  renderLoading() {
    return <h1>Loading</h1>;
  }

  renderPage() {
    return (
      this.state.session ?
        <Link to="/assistance">Ingresar a la sesión</Link>
      :
        <h1>No hay ninguna sesión activa en este momento</h1>
    );
  }
};
