import React from 'react'
import { Link } from 'react-router-dom'
import Loading from 'components/general/Loading'

import sessionService from 'services/sessions'

export default class AdminSessionsNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      session: { name: '' },
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  onNameChange(e) {
    this.setState({...this.state, session: { name: e.target.value }})
  }
  
  async submit() {
    if (this.state.session.name === '') {
      this.setState({ alert: { variant: "error", text: "Debes nombrar la sesión para crearla" } });

      setTimeout(() => {
        this.setState({ alert: null });
      }, 4000);
    } else {
      await sessionService.create(this.state.session);

      this.props.history.push('/admin/sessions');
    }
  }

  render() {
    if (this.state.loading) return <Loading />

    const session = this.state.session
    return ( 
      <div className="page-common session-form">
        <div className="form-group">
          <label htmlFor="session-name">Nombre de la sesión</label>
          <input type="text" onChange={this.onNameChange} value={session.name} autoFocus={true}></input>
        </div>

        <div className="actions">
          <Link to="/admin/sessions">Volver</Link>
          <button onClick={this.submit} disabled={session.name === ''} className="btn">Crear</button>
        </div>
      </div>
    )
  }
}
