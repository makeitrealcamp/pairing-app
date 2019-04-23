import React from 'react';

export default ({ participant }) => {
  return (
    <tr>
      <td><img src={participant.avatarUrl} /></td>
      <td>{participant.email}</td>
      <td>{participant.name}</td>
      <td>{participant.github}</td>
    </tr>
  )
}
