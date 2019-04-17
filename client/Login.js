import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => {
  return (
    <div className="login-page">
      <a href="/auth/github" className="btn"><FontAwesomeIcon icon={['fab', 'github']} /> Ingresar con Github</a>;
    </div>
  )
}
