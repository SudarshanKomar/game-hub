import React, { useState } from 'react';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

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
      // Save score to leaderboard
      const scores = JSON.parse(localStorage.getItem('gameScores') || '[]');
      scores.push({
        game: 'Tic Tac Toe',
        player: gameWinner,
        score: 1,
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
          width: '80px',
          height: '80px',
          fontSize: '24px',
          fontWeight: 'bold',
          border: '2px solid #333',
          backgroundColor: isWinningSquare ? '#90EE90' : '#fff',
          cursor: (!winner && !board[index]) ? 'pointer' : 'not-allowed',
          margin: '4px'
        }}
      >
        {value}
      </button>
    );
  };

  const getStatus = () => {
    if (winner) {
      return winner === 'Draw' ? 'Game is a Draw!' : `Winner: ${winner}`;
    }
    return `Next player: ${isXNext ? 'X' : 'O'}`;
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>🎯 Tic Tac Toe</h2>
      <div style={{ marginBottom: '1rem', fontSize: '18px', fontWeight: 'bold' }}>
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
      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={resetGame}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          New Game
        </button>
      </div>
      <div style={{ marginTop: '2rem', fontSize: '14px', color: '#666' }}>
        <p>Click on any empty square to make your move.</p>
        <p>First to get 3 in a row wins!</p>
      </div>
    </div>
  );
}

export default TicTacToe;
