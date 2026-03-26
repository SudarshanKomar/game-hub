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
      
      const gameScores = JSON.parse(localStorage.getItem('gameScores') || '[]');
      gameScores.push({
        game: 'Snake & Ladder',
        winner: `Player ${currentPlayer}`,
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
          border: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: cellNum === BOARD_SIZE ? '#FFD700' : 
                          hasSnake ? '#ffebee' : 
                          hasLadder ? '#e8f5e9' : '#fff',
          position: 'relative',
          fontSize: '10px',
          fontWeight: 'bold'
        }}
      >
        <div style={{ fontSize: '10px', color: '#666' }}>{cellNum}</div>
        {hasSnake && <div style={{ fontSize: '12px' }}>🐍→{hasSnake}</div>}
        {hasLadder && <div style={{ fontSize: '12px' }}>🪜→{hasLadder}</div>}
        <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
          {hasPlayer1 && <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2196F3' }} />}
          {hasPlayer2 && <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF9800' }} />}
        </div>
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>🎲 Snake & Ladder</h2>
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '3rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: currentPlayer === 1 ? '#e3f2fd' : '#fff',
          borderRadius: '8px',
          border: currentPlayer === 1 ? '2px solid #2196F3' : '2px solid transparent'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196F3' }}>Player 1 🔵</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Position: {player1Position}</div>
        </div>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: currentPlayer === 2 ? '#fff3e0' : '#fff',
          borderRadius: '8px',
          border: currentPlayer === 2 ? '2px solid #FF9800' : '2px solid transparent'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9800' }}>Player 2 🟠</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Position: {player2Position}</div>
        </div>
      </div>

      {diceValue && (
        <div style={{ marginBottom: '1rem', fontSize: '48px' }}>
          🎲 {diceValue}
        </div>
      )}

      {message && (
        <div style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 'bold', color: '#FF5722' }}>
          {message}
        </div>
      )}

      {gameOver && (
        <div style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
          🎉 Player {winner} Wins! 🎉
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={rollDice}
          disabled={gameOver || rolling}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: gameOver || rolling ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: gameOver || rolling ? 'not-allowed' : 'pointer',
            marginRight: '1rem'
          }}
        >
          {rolling ? 'Rolling...' : 'Roll Dice'}
        </button>
        <button
          onClick={resetGame}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          New Game
        </button>
      </div>

      <div style={{ 
        display: 'inline-block', 
        border: '2px solid #333',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${GRID_COLS}, 50px)`,
          gap: '0'
        }}>
          {Array.from({ length: BOARD_SIZE }, (_, i) => renderCell(i))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '14px', color: '#666', maxWidth: '600px', margin: '2rem auto' }}>
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
