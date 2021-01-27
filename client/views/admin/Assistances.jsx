import React, { useEffect, useState } from 'react';
import assitanceService from 'services/assistances';

const AdminAssistancesIndex = ({ match }) => {
  const sessionId = match.params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [assistances, setAssistances] = useState([]);

  useEffect(() => {
    const fetchAssistances = async () => {
      try {
        const data = await assitanceService.getAll(sessionId);
        console.log(data);

        setAssistances(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchAssistances();
  }, []);

  return (
    <div className="page-common participants-page">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Github</th>
            <th>Emparejado</th>
            <th>Clase</th>
            <th>Ejercicio</th>
            <th>Pareja</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {assistances.map(({ status, feedback, participant: user }, idx) => (
            <tr key={idx}>
              <td>{user.name}</td>
              <td>{user.github}</td>
              <td>{status !== 'solo' && status !== 'not_paired' ? 'Sí' : 'No'}</td>
              <td>{feedback?.class}</td>
              <td>{feedback?.exercises}</td>
              <td>{feedback?.partner}</td>
              <td>{feedback?.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAssistancesIndex;
