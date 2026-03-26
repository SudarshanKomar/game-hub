import React, { useState } from 'react';

const BOARD_SIZE = 100;
const GRID_COLS = 10;

const SNAKES = {
  16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
};

const LADDERS = {
  1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
};

function SnakeLadder() {
  const player1Name = localStorage.getItem('player1Name') || 'Player A';
  const player2Name = localStorage.getItem('player2Name') || 'Player B';
  
  const [player1Position, setPlayer1Position] = useState(0);
  const [player2Position, setPlayer2Position] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceValue, setDiceValue] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState('');
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (gameOver || rolling) return;

    setRolling(true);
    setMessage('');
    
    let rolls = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      
      if (rolls >= 10) {
        clearInterval(rollInterval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setTimeout(() => movePlayer(finalRoll), 300);
      }
    }, 100);
  };

  const movePlayer = (roll) => {
    const isPlayer1 = currentPlayer === 1;
    const currentPos = isPlayer1 ? player1Position : player2Position;
    let newPos = currentPos + roll;

    if (newPos > BOARD_SIZE) {
      setMessage(`Need exact roll to win! (Need ${BOARD_SIZE - currentPos})`);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setRolling(false);
      return;
    }

    if (SNAKES[newPos]) {
      const snakeEnd = SNAKES[newPos];
      setMessage(`🐍 Snake! Moved from ${newPos} to ${snakeEnd}`);
      newPos = snakeEnd;
    } else if (LADDERS[newPos]) {
      const ladderEnd = LADDERS[newPos];
      setMessage(`🪜 Ladder! Climbed from ${newPos} to ${ladderEnd}`);
      newPos = ladderEnd;
    }

    if (isPlayer1) {
      setPlayer1Position(newPos);
    } else {
      setPlayer2Position(newPos);
    }

    if (newPos === BOARD_SIZE) {
      setGameOver(true);
      setWinner(currentPlayer);
      
      const winnerName = currentPlayer === 1 ? player1Name : player2Name;
      const gameScores = JSON.parse(localStorage.getItem('gameScores') || '[]');
      gameScores.push({
        game: 'Snake & Ladder',
        winner: winnerName,
        player1: player1Name,
        player2: player2Name,
        player1Position: isPlayer1 ? newPos : player1Position,
        player2Position: isPlayer1 ? player2Position : newPos,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('gameScores', JSON.stringify(gameScores));
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }

    setRolling(false);
  };

  const resetGame = () => {
    setPlayer1Position(0);
    setPlayer2Position(0);
    setCurrentPlayer(1);
    setDiceValue(null);
    setGameOver(false);
    setWinner(null);
    setMessage('');
    setRolling(false);
  };

  const getCellNumber = (index) => {
    const row = Math.floor(index / GRID_COLS);
    const col = index % GRID_COLS;
    const isEvenRow = row % 2 === 0;
    const cellNum = isEvenRow 
      ? BOARD_SIZE - (row * GRID_COLS + col)
      : BOARD_SIZE - (row * GRID_COLS + (GRID_COLS - 1 - col));
    return cellNum;
  };

  const renderCell = (index) => {
    const cellNum = getCellNumber(index);
    const hasPlayer1 = player1Position === cellNum;
    const hasPlayer2 = player2Position === cellNum;
    const hasSnake = SNAKES[cellNum];
    const hasLadder = LADDERS[cellNum];

    return (
      <div
        key={index}
        style={{
          width: '50px',
          height: '50px',
          border: '1px solid #404040',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: cellNum === BOARD_SIZE ? '#eab308' : 
                          hasSnake ? '#7f1d1d' : 
                          hasLadder ? '#14532d' : '#262626',
          position: 'relative',
          fontSize: '10px',
          fontWeight: 'bold'
        }}
      >
        <div style={{ fontSize: '10px', color: '#9ca3af' }}>{cellNum}</div>
        {hasSnake && <div style={{ fontSize: '12px' }}>🐍→{hasSnake}</div>}
        {hasLadder && <div style={{ fontSize: '12px' }}>🪜→{hasLadder}</div>}
        <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
          {hasPlayer1 && <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#60a5fa' }} />}
          {hasPlayer2 && <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#fb923c' }} />}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#fff' }}>Snake & Ladder</h2>
      
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '3rem' }}>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: currentPlayer === 1 ? '#1e3a8a' : '#1a1a1a',
          borderRadius: '12px',
          border: currentPlayer === 1 ? '2px solid #3b82f6' : '2px solid #404040',
          transition: 'all 0.3s'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#60a5fa' }}>{player1Name} 🔵</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>Position: {player1Position}</div>
        </div>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: currentPlayer === 2 ? '#7c2d12' : '#1a1a1a',
          borderRadius: '12px',
          border: currentPlayer === 2 ? '2px solid #f97316' : '2px solid #404040',
          transition: 'all 0.3s'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fb923c' }}>{player2Name} 🟠</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>Position: {player2Position}</div>
        </div>
      </div>

      {diceValue && (
        <div style={{ marginBottom: '2rem', fontSize: '64px' }}>
          🎲 {diceValue}
        </div>
      )}

      {message && (
        <div style={{ marginBottom: '2rem', fontSize: '18px', fontWeight: 'bold', color: '#fb923c' }}>
          {message}
        </div>
      )}

      {gameOver && (
        <div style={{ marginBottom: '2rem', fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>
          🏆 {winner === 1 ? player1Name : player2Name} Wins! 🏆
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={rollDice}
          disabled={gameOver || rolling}
          style={{
            padding: '12px 32px',
            fontSize: '18px',
            backgroundColor: gameOver || rolling ? '#404040' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: gameOver || rolling ? 'not-allowed' : 'pointer',
            marginRight: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            boxShadow: gameOver || rolling ? 'none' : '0 4px 6px rgba(34, 197, 94, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (!gameOver && !rolling) {
              e.target.style.backgroundColor = '#16a34a';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!gameOver && !rolling) {
              e.target.style.backgroundColor = '#22c55e';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {rolling ? 'Rolling...' : 'Roll Dice'}
        </button>
        <button
          onClick={resetGame}
          style={{
            padding: '12px 32px',
            fontSize: '18px',
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
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          New Game
        </button>
      </div>

      <div style={{ 
        display: 'inline-block', 
        border: '2px solid #404040',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '10px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${GRID_COLS}, 50px)`,
          gap: '0'
        }}>
          {Array.from({ length: BOARD_SIZE }, (_, i) => renderCell(i))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '14px', color: '#9ca3af', maxWidth: '600px', margin: '2rem auto' }}>
        <p><strong>How to Play:</strong></p>
        <p>🎲 Click "Roll Dice" to move forward</p>
        <p>🪜 Land on a ladder to climb up</p>
        <p>🐍 Land on a snake to slide down</p>
        <p>🏆 First player to reach 100 wins!</p>
        <p>⚠️ You need exact roll to land on 100</p>
      </div>
    </div>
  );
}

export default SnakeLadder;
