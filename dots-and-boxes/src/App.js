import React, { useState } from 'react';

const GRID_SIZE = 5;

function DotsAndBoxes() {
  const player1Name = localStorage.getItem('player1Name') || 'Player A';
  const player2Name = localStorage.getItem('player2Name') || 'Player B';
  
  const [horizontalLines, setHorizontalLines] = useState(
    Array(GRID_SIZE + 1).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [verticalLines, setVerticalLines] = useState(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE + 1).fill(false))
  );
  const [boxes, setBoxes] = useState(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const checkBox = (row, col, newHLines, newVLines) => {
    const top = row > 0 ? newHLines[row][col] : true;
    const bottom = row < GRID_SIZE ? newHLines[row + 1][col] : true;
    const left = col > 0 ? newVLines[row][col] : true;
    const right = col < GRID_SIZE ? newVLines[row][col + 1] : true;
    
    return top && bottom && left && right;
  };

  const handleLineClick = (type, row, col) => {
    if (gameOver) return;

    let lineAlreadyDrawn = false;
    let newHLines = [...horizontalLines.map(r => [...r])];
    let newVLines = [...verticalLines.map(r => [...r])];
    
    if (type === 'horizontal') {
      if (newHLines[row][col]) return;
      newHLines[row][col] = true;
    } else {
      if (newVLines[row][col]) return;
      newVLines[row][col] = true;
    }

    let boxCompleted = false;
    let newBoxes = [...boxes.map(r => [...r])];
    
    if (type === 'horizontal') {
      if (row > 0 && !newBoxes[row - 1][col] && checkBox(row - 1, col, newHLines, newVLines)) {
        newBoxes[row - 1][col] = currentPlayer;
        boxCompleted = true;
      }
      if (row < GRID_SIZE && !newBoxes[row][col] && checkBox(row, col, newHLines, newVLines)) {
        newBoxes[row][col] = currentPlayer;
        boxCompleted = true;
      }
    } else {
      if (col > 0 && !newBoxes[row][col - 1] && checkBox(row, col - 1, newHLines, newVLines)) {
        newBoxes[row][col - 1] = currentPlayer;
        boxCompleted = true;
      }
      if (col < GRID_SIZE && !newBoxes[row][col] && checkBox(row, col, newHLines, newVLines)) {
        newBoxes[row][col] = currentPlayer;
        boxCompleted = true;
      }
    }

    setHorizontalLines(newHLines);
    setVerticalLines(newVLines);
    setBoxes(newBoxes);

    if (boxCompleted) {
      const newScores = { ...scores };
      newScores[`player${currentPlayer}`]++;
      setScores(newScores);

      const totalBoxes = GRID_SIZE * GRID_SIZE;
      if (newScores.player1 + newScores.player2 === totalBoxes) {
        setGameOver(true);
        const winner = newScores.player1 > newScores.player2 ? 1 : newScores.player2 > newScores.player1 ? 2 : 0;
        setWinner(winner);
        
        const gameScores = JSON.parse(localStorage.getItem('gameScores') || '[]');
        const winnerName = winner === 0 ? 'Draw' : (winner === 1 ? player1Name : player2Name);
        gameScores.push({
          game: 'Dots and Boxes',
          player1Score: newScores.player1,
          player2Score: newScores.player2,
          player1: player1Name,
          player2: player2Name,
          winner: winnerName,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('gameScores', JSON.stringify(gameScores));
      }
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const resetGame = () => {
    setHorizontalLines(Array(GRID_SIZE + 1).fill(null).map(() => Array(GRID_SIZE).fill(false)));
    setVerticalLines(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE + 1).fill(false)));
    setBoxes(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    setGameOver(false);
    setWinner(null);
  };

  const DOT_SIZE = 8;
  const CELL_SIZE = 60;
  const LINE_WIDTH = 4;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#fff' }}>Dots and Boxes</h2>
      
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '3rem' }}>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: currentPlayer === 1 ? '#1e3a8a' : '#1a1a1a',
          borderRadius: '12px',
          border: currentPlayer === 1 ? '2px solid #3b82f6' : '2px solid #404040',
          transition: 'all 0.3s'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#60a5fa' }}>{player1Name}</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>{scores.player1}</div>
        </div>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: currentPlayer === 2 ? '#7c2d12' : '#1a1a1a',
          borderRadius: '12px',
          border: currentPlayer === 2 ? '2px solid #f97316' : '2px solid #404040',
          transition: 'all 0.3s'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fb923c' }}>{player2Name}</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>{scores.player2}</div>
        </div>
      </div>

      {gameOver && (
        <div style={{ marginBottom: '2rem', fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
          {winner === 0 ? "It's a Draw!" : `${winner === 1 ? player1Name : player2Name} Wins!`}
        </div>
      )}

      <div style={{ display: 'inline-block', position: 'relative', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '16px', border: '2px solid #404040' }}>
        <svg width={GRID_SIZE * CELL_SIZE + DOT_SIZE} height={GRID_SIZE * CELL_SIZE + DOT_SIZE}>
          {Array.from({ length: GRID_SIZE + 1 }, (_, row) =>
            Array.from({ length: GRID_SIZE + 1 }, (_, col) => (
              <circle
                key={`dot-${row}-${col}`}
                cx={col * CELL_SIZE + DOT_SIZE / 2}
                cy={row * CELL_SIZE + DOT_SIZE / 2}
                r={DOT_SIZE / 2}
                fill="#9ca3af"
              />
            ))
          )}

          {horizontalLines.map((row, rowIndex) =>
            row.map((isDrawn, colIndex) => (
              <line
                key={`h-${rowIndex}-${colIndex}`}
                x1={colIndex * CELL_SIZE + DOT_SIZE}
                y1={rowIndex * CELL_SIZE + DOT_SIZE / 2}
                x2={(colIndex + 1) * CELL_SIZE}
                y2={rowIndex * CELL_SIZE + DOT_SIZE / 2}
                stroke={isDrawn ? '#60a5fa' : '#404040'}
                strokeWidth={LINE_WIDTH}
                style={{ cursor: isDrawn || gameOver ? 'default' : 'pointer' }}
                onClick={() => !isDrawn && handleLineClick('horizontal', rowIndex, colIndex)}
              />
            ))
          )}

          {verticalLines.map((row, rowIndex) =>
            row.map((isDrawn, colIndex) => (
              <line
                key={`v-${rowIndex}-${colIndex}`}
                x1={colIndex * CELL_SIZE + DOT_SIZE / 2}
                y1={rowIndex * CELL_SIZE + DOT_SIZE}
                x2={colIndex * CELL_SIZE + DOT_SIZE / 2}
                y2={(rowIndex + 1) * CELL_SIZE}
                stroke={isDrawn ? '#60a5fa' : '#404040'}
                strokeWidth={LINE_WIDTH}
                style={{ cursor: isDrawn || gameOver ? 'default' : 'pointer' }}
                onClick={() => !isDrawn && handleLineClick('vertical', rowIndex, colIndex)}
              />
            ))
          )}

          {boxes.map((row, rowIndex) =>
            row.map((owner, colIndex) => (
              owner && (
                <rect
                  key={`box-${rowIndex}-${colIndex}`}
                  x={colIndex * CELL_SIZE + DOT_SIZE + 2}
                  y={rowIndex * CELL_SIZE + DOT_SIZE + 2}
                  width={CELL_SIZE - DOT_SIZE - 4}
                  height={CELL_SIZE - DOT_SIZE - 4}
                  fill={owner === 1 ? '#3b82f6' : '#f97316'}
                  opacity="0.5"
                />
              )
            ))
          )}
        </svg>
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
        <p>Click on lines between dots to draw them</p>
        <p>Complete a box to score a point and get another turn</p>
        <p>Player with most boxes wins!</p>
      </div>
    </div>
  );
}

export default DotsAndBoxes;
