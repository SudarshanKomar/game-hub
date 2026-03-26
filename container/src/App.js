import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Fallback from './Fallback';

const TicTacToe = lazy(() => import('ticTacToe/App').catch(err => {
  console.error('Failed to load TicTacToe:', err);
  return { default: () => <div>Failed to load Tic Tac Toe</div> };
}));

const DotsAndBoxes = lazy(() => import('dotsAndBoxes/App').catch(err => {
  console.error('Failed to load DotsAndBoxes:', err);
  return { default: () => <div>Failed to load Dots and Boxes</div> };
}));

const SnakeLadder = lazy(() => import('snakeLadder/App').catch(err => {
  console.error('Failed to load SnakeLadder:', err);
  return { default: () => <div>Failed to load Snake & Ladder</div> };
}));

const Leaderboard = lazy(() => import('leaderboard/App').catch(err => {
  console.error('Failed to load Leaderboard:', err);
  return { default: () => <div>Failed to load Leaderboard</div> };
}));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#ffebee', borderRadius: '8px', margin: '2rem' }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.toString()}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Navigation() {
  const location = useLocation();
  console.log('Navigation rendering, current path:', location.pathname);
  
  const navStyle = {
    backgroundColor: '#333',
    padding: '1rem',
    marginBottom: '2rem'
  };
  
  const linkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    margin: '0 1rem',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    backgroundColor: location.pathname === path ? '#555' : 'transparent',
    transition: 'background-color 0.3s'
  });

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle('/')}>🏠 Home</Link>
      <Link to="/tic-tac-toe" style={linkStyle('/tic-tac-toe')}>🎯 Tic Tac Toe</Link>
      <Link to="/dots-and-boxes" style={linkStyle('/dots-and-boxes')}>⬛ Dots & Boxes</Link>
      <Link to="/snake-ladder" style={linkStyle('/snake-ladder')}>🎲 Snake & Ladder</Link>
      <Link to="/leaderboard" style={linkStyle('/leaderboard')}>🏆 Leaderboard</Link>
    </nav>
  );
}

function Home() {
  console.log('Home component rendering...');
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>🎮 Welcome to Game Hub</h1>
      <p style={{ fontSize: '18px', marginBottom: '2rem' }}>
        A microfrontend-based 1v1 gaming platform - Challenge your friends!
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>🎯 Tic Tac Toe</h2>
          <p>Classic 2-player game. Get 3 in a row to win!</p>
          <Link to="/tic-tac-toe" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Play Now
          </Link>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>⬛ Dots & Boxes</h2>
          <p>Connect dots to form boxes. Most boxes wins!</p>
          <Link to="/dots-and-boxes" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Play Now
          </Link>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>🎲 Snake & Ladder</h2>
          <p>Roll dice, climb ladders, avoid snakes. First to 100 wins!</p>
          <Link to="/snake-ladder" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Play Now
          </Link>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>🏆 Leaderboard</h2>
          <p>View aggregated scores from all games!</p>
          <Link to="/leaderboard" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            View Scores
          </Link>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#e3f2fd', borderRadius: '8px', maxWidth: '600px', margin: '3rem auto 0' }}>
        <h3>ℹ️ About This Project</h3>
        <p>This is a 1v1 gaming platform using microfrontend architecture:</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>React 18</li>
          <li>Webpack Module Federation</li>
          <li>React Router</li>
          <li>Independent deployable apps</li>
          <li>Player vs Player games</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
          <Navigation />
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/tic-tac-toe" 
                element={
                  <Suspense fallback={<Fallback />}>
                    <TicTacToe />
                  </Suspense>
                } 
              />
              <Route 
                path="/dots-and-boxes" 
                element={
                  <Suspense fallback={<Fallback />}>
                    <DotsAndBoxes />
                  </Suspense>
                } 
              />
              <Route 
                path="/snake-ladder" 
                element={
                  <Suspense fallback={<Fallback />}>
                    <SnakeLadder />
                  </Suspense>
                } 
              />
              <Route 
                path="/leaderboard" 
                element={
                  <Suspense fallback={<Fallback />}>
                    <Leaderboard />
                  </Suspense>
                } 
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
