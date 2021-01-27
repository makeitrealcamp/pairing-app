import React from 'react';
import { Route } from 'react-router-dom';
import Loading from '../general/Loading';
import NotFound from '../general/NotFound';
import auth from 'services/auth';

export default class AdminRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      authorized: false,
    };
  }

  async componentDidMount() {
    const participant = await auth.participant();
    if (participant && participant.admin) {
      this.setState({
        loading: false,
        authorized: true,
      });
    } else {
      this.setState({
        loading: false,
        authorized: false,
      });
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) =>
          this.state.authorized ? <Component {...props} /> : this.state.loading ? <Loading /> : <NotFound />
        }
      />
    );
  }
}
