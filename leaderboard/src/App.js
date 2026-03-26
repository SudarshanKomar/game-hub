import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [filter, setFilter] = useState('all');
  const [playerStats, setPlayerStats] = useState({});

  useEffect(() => {
    const loadScores = () => {
      const storedScores = JSON.parse(localStorage.getItem('gameScores') || '[]');
      setScores(storedScores);
      
      // Calculate aggregated player statistics
      const stats = {};
      storedScores.forEach(score => {
        if (score.game === 'Tic Tac Toe') {
          const winner = score.player;
          if (!stats[winner]) stats[winner] = { wins: 0, games: 0 };
          stats[winner].wins++;
          stats[winner].games++;
        } else if (score.game === 'Dots and Boxes') {
          ['Player 1', 'Player 2'].forEach(player => {
            if (!stats[player]) stats[player] = { wins: 0, games: 0 };
            stats[player].games++;
          });
          if (score.winner !== 'Draw') {
            if (!stats[score.winner]) stats[score.winner] = { wins: 0, games: 0 };
            stats[score.winner].wins++;
          }
        } else if (score.game === 'Snake & Ladder') {
          ['Player 1', 'Player 2'].forEach(player => {
            if (!stats[player]) stats[player] = { wins: 0, games: 0 };
            stats[player].games++;
          });
          if (!stats[score.winner]) stats[score.winner] = { wins: 0, games: 0 };
          stats[score.winner].wins++;
        }
      });
      setPlayerStats(stats);
    };

    loadScores();
    
    const handleStorageChange = () => {
      loadScores();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const clearScores = () => {
    if (window.confirm('Are you sure you want to clear all scores?')) {
      localStorage.removeItem('gameScores');
      setScores([]);
    }
  };

  const addMockScores = () => {
    const mockScores = [
      { game: 'Tic Tac Toe', player: 'X', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { game: 'Dots and Boxes', player1Score: 12, player2Score: 13, winner: 'Player 2', timestamp: new Date(Date.now() - 43200000).toISOString() },
      { game: 'Snake & Ladder', winner: 'Player 1', player1Position: 100, player2Position: 87, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { game: 'Tic Tac Toe', player: 'O', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { game: 'Dots and Boxes', player1Score: 15, player2Score: 10, winner: 'Player 1', timestamp: new Date().toISOString() },
    ];
    
    const existingScores = JSON.parse(localStorage.getItem('gameScores') || '[]');
    const allScores = [...existingScores, ...mockScores];
    localStorage.setItem('gameScores', JSON.stringify(allScores));
    setScores(allScores);
  };

  const filteredScores = scores.filter(score => {
    if (filter === 'all') return true;
    if (filter === 'tic-tac-toe') return score.game === 'Tic Tac Toe';
    if (filter === 'dots-and-boxes') return score.game === 'Dots and Boxes';
    if (filter === 'snake-ladder') return score.game === 'Snake & Ladder';
    return true;
  });

  const sortedScores = [...filteredScores].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getGameIcon = (game) => {
    if (game === 'Tic Tac Toe') return '🎯';
    if (game === 'Dots and Boxes') return '⬛';
    if (game === 'Snake & Ladder') return '🎲';
    return '�';
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return '#333';
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>🏆 Leaderboard</h2>
      
      {Object.keys(playerStats).length > 0 && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#e3f2fd', borderRadius: '8px', maxWidth: '800px', margin: '0 auto 2rem' }}>
          <h3>📊 Player Statistics</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {Object.entries(playerStats).map(([player, stats]) => (
              <div key={player} style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', minWidth: '150px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0.5rem' }}>{player}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Wins: {stats.wins}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Games: {stats.games}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Win Rate: {((stats.wins / stats.games) * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            backgroundColor: filter === 'all' ? '#4CAF50' : '#f0f0f0',
            color: filter === 'all' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          All Games
        </button>
        <button
          onClick={() => setFilter('tic-tac-toe')}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            backgroundColor: filter === 'tic-tac-toe' ? '#4CAF50' : '#f0f0f0',
            color: filter === 'tic-tac-toe' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🎯 Tic Tac Toe
        </button>
        <button
          onClick={() => setFilter('dots-and-boxes')}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            backgroundColor: filter === 'dots-and-boxes' ? '#4CAF50' : '#f0f0f0',
            color: filter === 'dots-and-boxes' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ⬛ Dots & Boxes
        </button>
        <button
          onClick={() => setFilter('snake-ladder')}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            backgroundColor: filter === 'snake-ladder' ? '#4CAF50' : '#f0f0f0',
            color: filter === 'snake-ladder' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🎲 Snake & Ladder
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={addMockScores}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Sample Scores
        </button>
        <button
          onClick={clearScores}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear All
        </button>
      </div>

      {sortedScores.length === 0 ? (
        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p>No scores yet! Play some games to see your scores here.</p>
        </div>
      ) : (
        <div style={{ display: 'inline-block', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1rem' }}>
          <table style={{ borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Rank</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Game</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Result</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.map((score, index) => {
                let resultText = '';
                if (score.game === 'Tic Tac Toe') {
                  resultText = `Winner: ${score.player}`;
                } else if (score.game === 'Dots and Boxes') {
                  resultText = `${score.winner} (P1: ${score.player1Score}, P2: ${score.player2Score})`;
                } else if (score.game === 'Snake & Ladder') {
                  resultText = `${score.winner} reached 100!`;
                }
                
                return (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: getRankColor(index + 1) }}>
                      #{index + 1}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {getGameIcon(score.game)} {score.game}
                    </td>
                    <td style={{ padding: '12px' }}>{resultText}</td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>
                      {formatDate(score.timestamp)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '2rem', fontSize: '14px', color: '#666' }}>
        <p>Total scores: {scores.length}</p>
        <p>Scores are automatically saved when you complete a game!</p>
      </div>
    </div>
  );
}

export default Leaderboard;
