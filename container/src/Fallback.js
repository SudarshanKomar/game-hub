import React from 'react';

function Fallback() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ffebee', borderRadius: '8px' }}>
      <h3>⚠️ Failed to Load</h3>
      <p>Unable to load this microfrontend. Please check if all servers are running.</p>
      <p>Make sure the following ports are accessible:</p>
      <ul style={{ textAlign: 'left', display: 'inline-block' }}>
        <li>Tic Tac Toe: http://localhost:3001</li>
        <li>Snake: http://localhost:3002</li>
        <li>Leaderboard: http://localhost:3003</li>
      </ul>
    </div>
  );
}

export default Fallback;
