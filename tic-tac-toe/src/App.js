import React, { useState } from 'react';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const player1Name = localStorage.getItem('player1Name') || 'Player A';
  const player2Name = localStorage.getItem('player2Name') || 'Player B';

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      // Save score to leaderboard with player names
      const winnerName = gameWinner === 'X' ? player1Name : player2Name;
      const scores = JSON.parse(localStorage.getItem('gameScores') || '[]');
      scores.push({
        game: 'Tic Tac Toe',
        player: gameWinner,
        winner: winnerName,
        player1: player1Name,
        player2: player2Name,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('gameScores', JSON.stringify(scores));
    } else if (newBoard.every(square => square !== null)) {
      setWinner('Draw');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderSquare = (index) => {
    const value = board[index];
    const isWinningSquare = winner && value === winner;
    
    return (
      <button
        className={`square ${isWinningSquare ? 'winner' : ''}`}
        onClick={() => handleClick(index)}
        disabled={!!winner || !!board[index]}
        style={{
          width: '100px',
          height: '100px',
          fontSize: '36px',
          fontWeight: 'bold',
          border: '2px solid #404040',
          backgroundColor: isWinningSquare ? '#166534' : '#1a1a1a',
          color: value === 'X' ? '#60a5fa' : value === 'O' ? '#fb923c' : '#666',
          cursor: (!winner && !board[index]) ? 'pointer' : 'not-allowed',
          margin: '4px',
          borderRadius: '8px',
          transition: 'all 0.2s',
          boxShadow: isWinningSquare ? '0 0 20px #22c55e' : 'none'
        }}
        onMouseEnter={(e) => {
          if (!winner && !board[index]) {
            e.target.style.backgroundColor = '#262626';
            e.target.style.borderColor = '#525252';
          }
        }}
        onMouseLeave={(e) => {
          if (!winner && !board[index]) {
            e.target.style.backgroundColor = '#1a1a1a';
            e.target.style.borderColor = '#404040';
          }
        }}
      >
        {value}
      </button>
    );
  };

  const getStatus = () => {
    if (winner) {
      if (winner === 'Draw') return 'Game is a Draw!';
      const winnerName = winner === 'X' ? player1Name : player2Name;
      return `Winner: ${winnerName} (${winner})`;
    }
    const currentPlayerName = isXNext ? player1Name : player2Name;
    const currentSymbol = isXNext ? 'X' : 'O';
    return `Next player: ${currentPlayerName} (${currentSymbol})`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#fff' }}>Tic Tac Toe</h2>
      
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <div style={{ padding: '1rem 1.5rem', backgroundColor: isXNext ? '#1e3a8a' : '#1a1a1a', borderRadius: '12px', border: isXNext ? '2px solid #3b82f6' : '2px solid #404040', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '16px', color: '#60a5fa', fontWeight: 'bold' }}>{player1Name} (X)</div>
        </div>
        <div style={{ padding: '1rem 1.5rem', backgroundColor: !isXNext ? '#7c2d12' : '#1a1a1a', borderRadius: '12px', border: !isXNext ? '2px solid #f97316' : '2px solid #404040', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '16px', color: '#fb923c', fontWeight: 'bold' }}>{player2Name} (O)</div>
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem', fontSize: '20px', fontWeight: 'bold', color: '#e5e5e5' }}>
        {getStatus()}
      </div>
      <div style={{ display: 'inline-block' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => (
            <div key={index}>
              {renderSquare(index)}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '3rem' }}>
        <button
          onClick={resetGame}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.3)';
          }}
        >
          New Game
        </button>
      </div>
      <div style={{ marginTop: '2rem', fontSize: '14px', color: '#9ca3af' }}>
        <p>Click on any empty square to make your move.</p>
        <p>First to get 3 in a row wins!</p>
      </div>
    </div>
  );
}

export default TicTacToe;
