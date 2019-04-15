import React from 'react';
import { Redirect } from 'react-router-dom';
import sessions from "./services/sessions";
import assistances from "./services/assistances";

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
      this.setState({ loading: false, assistance });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.loading) {
      return <h1>Loading ...</h1>;
    }

    return this.state.assistance ? this.renderAssistance() : <Redirect to="/" />;
  }

  renderAssistance() {
    if (this.state.assistance.paired) {
      return <h1>Paired</h1>;
    } else {
      return <h1>Not Paired</h1>;
    }
  }

  async findOrCreateAssistance(session) {
    let assistance = await assistances.findBySession(session._id);
    if (!assistance) {
      assistance = await assistances.create(session._id);
    }
    return assistance;
  }
}
