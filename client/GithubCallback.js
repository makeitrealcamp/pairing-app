import React from 'react';
import { Redirect } from 'react-router-dom';
import Loading from 'components/general/Loading';
import queryString from 'query-string';
import auth from './services/auth';

export default class GithubCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirect: false };
  }

  async componentDidMount() {
    const qs = queryString.parse(location.search);
    const result = await auth.withCode(qs.code);
    if (result) {
      this.setState({ redirect: true });
    }
  }

  render() {
    return this.state.redirect ? <Redirect to="/" /> : <Loading text="Autenticando ..." />;
  }
}
