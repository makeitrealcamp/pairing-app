import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Alert from '../../Alert';

import sessionService from 'services/sessions'

const AdminSessionIndex = () => {
  const [alert, setAlert] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSession, setActiveSession] = useState(null)
  const [sessions, setSessions] = useState([])
  const history = useHistory()

  useEffect(() => {
    const fetchSessions = async () => {
      const data = await sessionService.getAll()
      const openSession = await sessionService.findActive()

      setSessions(data)
      setActiveSession(openSession)
    }

    fetchSessions()
  }, [])

  const handleCloseSession = async () => {
    await sessionService.closeActive()

    setAlert({ variant: "success", text: "Se cerro la sesión correctamente!" })
    setActiveSession(null)

    setTimeout(() => {
      this.setState({ alert: null });
    }, 4000);
  }

  return (
    <div className="page-common participants-page">
      {alert ? <Alert variant={alert.variant}>{alert.text}</Alert> : null}
      <div className="session-actions">
        {activeSession ? (
          <button className="btn" onClick={handleCloseSession}>
            Cerrar Sesión Activa
          </button>
        ) : (
          <button className="btn" onClick={() => history.push('/admin/sessions/new')}>
            Crear Nueva Sesión
          </button>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th># Asistentes</th>
            <th>Sin Pareja</th>
            <th>Prom. Rating</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(({ id, name, assistances, withOutPair, ratingProm }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{assistances}</td>
              <td>{withOutPair}</td>
              <td>{ratingProm?.toFixed(1) || 'No Rating'}</td>
              <td>
                <button
                  onClick={() => history.push(`/admin/sessions/${id}/assistances`)}
                  className="btn"
                >
                  Ver asistentes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminSessionIndex
