import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Loading from "./Loading";
import auth from "./services/auth";
import sessions from "./services/sessions";
import assistances from "./services/assistances";
import io from 'socket.io-client';

export default class Assistance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      assistance: null,
      notPaired: false // if impossible to pair
    }
  }

  async componentDidMount() {
    const session = await sessions.findActive();
    if (session) {
      const assistance = await this.findOrCreateAssistance(session);
      if (!assistance.paired) {
        this.configureWebSocket();
        this.configureTimer();
      }

      this.setState({ loading: false, assistance });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return this.state.assistance ? this.renderAssistance() : <Redirect to="/" />;
  }

  renderAssistance() {
    if (this.state.notPaired) {
      return (
        <div className="assistance-page">
          <div className="text-center">
            <p className="intro">No fue posible encontrar una pareja de trabajo. Puedes trabajar individualmente o <a href="/assistance" onClick={this.retry}>intentarlo nuevamente</a></p>
          </div>
        </div>
      );
    }

    if (this.state.assistance.paired) {
      return (
        <div className="assistance-page">
          <p className="intro">Tu pareja de trabajo para esta sesión es:</p>
          <div className="partner">
            <img src={this.state.assistance.partner.avatarUrl} />
            <div className="partner-info">
              <span className="partner-name">{this.state.assistance.partner.name}</span>
              <span className="partner-github">{this.state.assistance.partner.github}</span>
            </div>
          </div>
          <p className="footnote">Cuando termines los ejercicios no olvides <Link to={`/assistances/this.state.assistance._id/feedback`}>calificar la sesión y dejar retroalimentación</Link>.</p>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }} className="assistance-page">
          <img src="loading.svg" />
          <p style={{ fontSize: "1.2rem", marginTop: "40px" }}>Iniciando sesión de pair programming ... </p>
        </div>
      )
    }
  }

  async findOrCreateAssistance(session) {
    let assistance = await assistances.findBySession(session._id);
    if (!assistance) {
      assistance = await assistances.create(session._id);
    } else if (!assistance.paired) {
      assistance = await assistances.enqueue(assistance);
    }
    return assistance;
  }

  configureWebSocket() {
    const socket = io();
    socket.on('paired', assistance => {
      clearTimeout(this.timeout);
      this.setState({ assistance });
    });
    socket.emit("subscribe", { token: auth.token });
  }

  configureTimer() {
    this.timeout = setTimeout(async () => {
      const assistance = await assistances.dequeue(this.state.assistance);
      this.setState({ loading: false, notPaired: true, assistance });
    }, 60000);
  }

  retry() {
    window.location.reload();
  }
}
