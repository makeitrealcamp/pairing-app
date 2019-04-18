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
      assistance: null
    }
  }

  async componentDidMount() {
    const session = await sessions.findActive();
    if (session) {
      const assistance = await this.findOrCreateAssistance(session);
      if (assistance.status === "enqueued") {
        this.configureWebSocket(assistance);
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
    const status = this.state.assistance.status;

    if (status === "enqueued" || status === "pairing") {
      return this.renderEnqueued();
    } else if (status === "not_paired") {
      return this.renderNotPaired();
    } else if (status === "paired") {
      return this.renderPaired();
    } else if (status === "solo") {
      return this.renderSolo();
    } else if (status === "rated") {
      return <Redirect to={`/assistances/${this.state.assistance._id}/feedback`} />;
    }
  }

  renderEnqueued() {
    return (
      <div style={{ textAlign: "center" }} className="assistance-page">
        <img src="loading.svg" />
        <p style={{ fontSize: "1.2rem", marginTop: "40px" }}>Iniciando sesión de pair programming ... </p>
      </div>
    )
  }

  renderNotPaired() {
    return (
      <div className="assistance-page">
        <div className="text-center">
          <p className="intro">No fue posible encontrar una pareja de trabajo. Puedes <a href="#" onClick={this.solo.bind(this)}>trabajar individualmente</a> o <a href="/assistance" onClick={this.retry}>intentarlo nuevamente</a></p>
        </div>
      </div>
    );
  }

  renderPaired() {
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
        <p className="footnote">Cuando termines los ejercicios no olvides <Link to={`/assistances/${this.state.assistance._id}/feedback`}>calificar la sesión y dejar retroalimentación</Link>.</p>
      </div>
    );
  }

  renderSolo() {
    return (
      <div className="assistance-page">
        <p className="intro">Estás en una sesión individual</p>
        <p className="footnote">Cuando termines los ejercicios no olvides <Link to={`/assistances/${this.state.assistance._id}/feedback`}>calificar la sesión y dejar retroalimentación</Link>.</p>
      </div>
    );
  }

  async findOrCreateAssistance(session) {
    let assistance = await assistances.findBySession(session._id);
    if (!assistance) {
      assistance = await assistances.create(session._id);
    } else if (assistance.status === "not_paired") {
      assistance = await assistances.enqueue(assistance);
    }
    return assistance;
  }

  configureWebSocket(assistance) {
    const socket = io();
    socket.on('paired', assistance => {
      clearTimeout(this.timeout);
      this.setState({ assistance });
    });
    socket.emit("subscribe", { assistanceId: assistance._id, token: auth.token });
  }

  configureTimer() {
    this.timeout = setTimeout(async () => {
      const assistance = await assistances.dequeue(this.state.assistance);
      this.setState({ loading: false, assistance });
    }, 60000);
  }

  async solo(e) {
    e.preventDefault();

    this.setState({ loading: true });
    const assistance = await assistances.update(this.state.assistance, { status: "solo" });
    this.setState({ loading: false, assistance });
  }

  retry() {
    window.location.reload();
  }
}
