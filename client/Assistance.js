import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Loading from "./Loading";
import Chat from "./Chat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import auth from "./services/auth";
import sessions from "./services/sessions";
import assistances from "./services/assistances";
import io from 'socket.io-client';

export default class Assistance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      session: null,
      assistance: null,
      showUnpairLink: false
    }
  }

  async componentDidMount() {
    try {
      this.socket = await this.configureWebSocket();
      const session = await sessions.findActive();
      if (session) {
        const assistance = await this.findOrCreateAssistance(session);
        if (assistance.status === "enqueued") {
          this.configureTimer();
        }
        const state = { loading: false, assistance, session }
        if (assistance.status === "paired") {
          state.showUnpairLink = true;
        }
        this.setState(state);
      } else {
        this.setState({ loading: false });
      }
    } catch (err) {
      console.log(err);
    }
  }

  componentWillUnmount() {
    this.socket.disconnect();
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
      <div className=" page-common assistance-page">
        <div className="enqueued">
          <img src="loading.svg" />
          <p>Iniciando sesión de pair programming ... </p>
        </div>
      </div>
    )
  }

  renderNotPaired() {
    return (
      <div className="page-common assistance-page">
        <div className="text-center">
          <p className="intro">No fue posible encontrar una pareja de trabajo. Puedes <a href="#" onClick={this.solo.bind(this)}>trabajar individualmente</a> o <a href="/assistance" onClick={this.retry}>intentarlo nuevamente</a></p>
        </div>
      </div>
    );
  }

  renderPaired() {
    return (
      <div className="page-common assistance-page">
        <div className="paired">
          <div>
            <p className="intro">Tu pareja de trabajo para esta sesión es:</p>
            <div className="partner">
              <img src={this.state.assistance.partner.avatarUrl} />
              <div className="partner-info">
                <span className="partner-name">{this.state.assistance.partner.name}</span>
                <span className="partner-github">{this.state.assistance.partner.github}</span>
              </div>
            </div>
            {this.state.session.exercisesUrl ? <p className="footnote"><a href={this.state.session.exercisesUrl} target="_blank">Abrir los ejercicios&nbsp;<FontAwesomeIcon icon={['fas', 'external-link-alt']} /></a></p> : null}
            <p className="footnote">Cuando termines los ejercicios no olvides <Link to={`/assistances/${this.state.assistance._id}/feedback`}>calificar la sesión y dejar retroalimentación</Link>.</p>
            {this.state.showUnpairLink ? <div className="notification">Si no te pudiste comunicar con tu pareja <a href="#" onClick={this.unpair.bind(this)}>haz click acá</a> para buscar nuevamente.</div> : null}
          </div>
          <Chat assistance={this.state.assistance} />
        </div>
      </div>
    );
  }

  renderSolo() {
    return (
      <div className="page-common assistance-page">
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

  async configureWebSocket(assistance) {
    const socket = io();
    socket.on('assistance-changed', assistance => {
      clearTimeout(this.timeout);
      if (assistance.status === "paired") {
        setTimeout(() => this.setState({ showUnpairLink: true }), 10000);
      }
      this.setState({ assistance });
    });

    const participant = await auth.participant();
    socket.emit("subscribe", { participantId: participant._id });
    return socket;
  }

  configureTimer() {
    this.timeout = setTimeout(async () => {
      const assistance = await assistances.dequeue(this.state.assistance);
      this.setState({ loading: false, assistance });
    }, 180000);
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

  async unpair(e) {
    e.preventDefault();
    const assistance = await assistances.enqueue(this.state.assistance);
    this.setState({ assistance });
  }
}
