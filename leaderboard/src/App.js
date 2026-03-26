import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [filter, setFilter] = useState('all');
  const [playerStats, setPlayerStats] = useState({});

  useEffect(() => {
    const loadScores = () => {
      const storedScores = JSON.parse(localStorage.getItem('gameScores') || '[]');
      setScores(storedScores);
      
      // Calculate aggregated player statistics using actual player names
      const stats = {};
      storedScores.forEach(score => {
        if (score.game === 'Tic Tac Toe' && score.winner) {
          const p1 = score.player1 || 'Player A';
          const p2 = score.player2 || 'Player B';
          
          if (!stats[p1]) stats[p1] = { wins: 0, games: 0 };
          if (!stats[p2]) stats[p2] = { wins: 0, games: 0 };
          stats[p1].games++;
          stats[p2].games++;
          
          if (score.winner !== 'Draw') {
            stats[score.winner].wins++;
          }
        } else if (score.game === 'Dots and Boxes') {
          const p1 = score.player1 || 'Player A';
          const p2 = score.player2 || 'Player B';
          
          if (!stats[p1]) stats[p1] = { wins: 0, games: 0 };
          if (!stats[p2]) stats[p2] = { wins: 0, games: 0 };
          stats[p1].games++;
          stats[p2].games++;
          
          if (score.winner !== 'Draw') {
            stats[score.winner].wins++;
          }
        } else if (score.game === 'Snake & Ladder') {
          const p1 = score.player1 || 'Player A';
          const p2 = score.player2 || 'Player B';
          
          if (!stats[p1]) stats[p1] = { wins: 0, games: 0 };
          if (!stats[p2]) stats[p2] = { wins: 0, games: 0 };
          stats[p1].games++;
          stats[p2].games++;
          
          if (score.winner) {
            stats[score.winner].wins++;
          }
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
      setPlayerStats({});
    }
  };

  const resetPlayerNames = () => {
    if (window.confirm('Reset player names to default (Player A and Player B)? This will also clear all game history.')) {
      localStorage.setItem('player1Name', 'Player A');
      localStorage.setItem('player2Name', 'Player B');
      localStorage.removeItem('gameScores');
      setScores([]);
      setPlayerStats({});
      window.dispatchEvent(new Event('storage'));
    }
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
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>Leaderboard</h2>
      
      {Object.keys(playerStats).length > 0 && (
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {Object.entries(playerStats).map(([player, stats]) => (
              <div key={player} style={{ 
                padding: '1.5rem', 
                backgroundColor: '#1a1a1a', 
                borderRadius: '12px',
                border: '2px solid #404040',
                minWidth: '180px'
              }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa' }}>{player}</div>
                <div style={{ fontSize: '16px', color: '#9ca3af', marginTop: '0.5rem' }}>
                  Wins: {stats.wins} | Games: {stats.games}
                </div>
                <div style={{ fontSize: '16px', color: '#22c55e', fontWeight: 'bold' }}>
                  Win Rate: {stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '10px 20px',
            margin: '0 6px',
            backgroundColor: filter === 'all' ? '#3b82f6' : '#262626',
            color: 'white',
            border: filter === 'all' ? '2px solid #3b82f6' : '2px solid #404040',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
        >
          All Games
        </button>
        <button
          onClick={() => setFilter('tic-tac-toe')}
          style={{
            padding: '10px 20px',
            margin: '0 6px',
            backgroundColor: filter === 'tic-tac-toe' ? '#3b82f6' : '#262626',
            color: 'white',
            border: filter === 'tic-tac-toe' ? '2px solid #3b82f6' : '2px solid #404040',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
        >
          Tic Tac Toe
        </button>
        <button
          onClick={() => setFilter('dots-and-boxes')}
          style={{
            padding: '10px 20px',
            margin: '0 6px',
            backgroundColor: filter === 'dots-and-boxes' ? '#3b82f6' : '#262626',
            color: 'white',
            border: filter === 'dots-and-boxes' ? '2px solid #3b82f6' : '2px solid #404040',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
        >
          Dots & Boxes
        </button>
        <button
          onClick={() => setFilter('snake-ladder')}
          style={{
            padding: '10px 20px',
            margin: '0 6px',
            backgroundColor: filter === 'snake-ladder' ? '#3b82f6' : '#262626',
            color: 'white',
            border: filter === 'snake-ladder' ? '2px solid #3b82f6' : '2px solid #404040',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
        >
          Snake & Ladder
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={clearScores}
          style={{
            padding: '10px 24px',
            margin: '0 6px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            boxShadow: '0 4px 6px rgba(220, 38, 38, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#b91c1c';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Clear All Scores
        </button>
        <button
          onClick={resetPlayerNames}
          style={{
            padding: '10px 24px',
            margin: '0 6px',
            backgroundColor: '#9333ea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#7e22ce';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#9333ea';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Reset Player Names
        </button>
      </div>

      {sortedScores.length === 0 ? (
        <div style={{ padding: '3rem', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '2px solid #404040' }}>
          <p style={{ fontSize: '18px', color: '#9ca3af' }}>No scores yet! Play some games to see your scores here.</p>
        </div>
      ) : (
        <div style={{ display: 'inline-block', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '2px solid #404040', padding: '1.5rem' }}>
          <table style={{ borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #404040' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#60a5fa', fontSize: '16px' }}>Rank</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#60a5fa', fontSize: '16px' }}>Game</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#60a5fa', fontSize: '16px' }}>Result</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#60a5fa', fontSize: '16px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.map((score, index) => {
                let resultText = '';
                if (score.game === 'Tic Tac Toe') {
                  const p1 = score.player1 || 'Player A';
                  const p2 = score.player2 || 'Player B';
                  resultText = score.winner ? `Winner: ${score.winner}` : `${p1} vs ${p2}`;
                } else if (score.game === 'Dots and Boxes') {
                  const p1 = score.player1 || 'Player A';
                  const p2 = score.player2 || 'Player B';
                  resultText = `${score.winner} wins! (${p1}: ${score.player1Score}, ${p2}: ${score.player2Score})`;
                } else if (score.game === 'Snake & Ladder') {
                  resultText = `${score.winner} reached 100!`;
                }
                
                return (
                  <tr key={index} style={{ borderBottom: '1px solid #404040' }}>
                    <td style={{ padding: '14px', fontWeight: 'bold', color: getRankColor(index + 1), fontSize: '16px' }}>
                      #{index + 1}
                    </td>
                    <td style={{ padding: '14px', color: '#e5e5e5', fontSize: '15px' }}>
                      {score.game}
                    </td>
                    <td style={{ padding: '14px', color: '#9ca3af', fontSize: '14px' }}>{resultText}</td>
                    <td style={{ padding: '14px', fontSize: '13px', color: '#6b7280' }}>
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
