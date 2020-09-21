import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import sessionService from 'services/sessions'

const AdminSessionIndex = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [sessions, setSessions] = useState([])
  const history = useHistory()

  useEffect(() => {
    const fetchSessions = async () => {
      const data = await sessionService.getAll()
      console.log(data)

      setSessions(data)
    }

    fetchSessions()
  }, [])

  return (
    <div className="page-common participants-page">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Asistentes</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(({ id, name, assistances }) => (
            <tr>
              <td>{name}</td>
              <td>{assistances}</td>
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
