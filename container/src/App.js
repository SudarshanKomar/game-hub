import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FallingPattern } from './components/ui/falling-pattern';
import { Input } from './components/ui/input';
import { FlippingCard } from './components/ui/flipping-card';
import './index.css';
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
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black border-b border-neutral-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex gap-6 justify-center flex-wrap">
        <Link 
          to="/" 
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            isActive('/') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          Home
        </Link>
        <Link 
          to="/tic-tac-toe" 
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            isActive('/tic-tac-toe') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          Tic Tac Toe
        </Link>
        <Link 
          to="/dots-and-boxes" 
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            isActive('/dots-and-boxes') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          Dots & Boxes
        </Link>
        <Link 
          to="/snake-ladder" 
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            isActive('/snake-ladder') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          Snake & Ladder
        </Link>
        <Link 
          to="/leaderboard" 
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            isActive('/leaderboard') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          Leaderboard
        </Link>
      </div>
    </nav>
  );
}

function PlayerNameSection() {
  const [player1Name, setPlayer1Name] = React.useState(() => {
    return localStorage.getItem('player1Name') || 'Player A';
  });
  const [player2Name, setPlayer2Name] = React.useState(() => {
    return localStorage.getItem('player2Name') || 'Player B';
  });
  const [tempPlayer1Name, setTempPlayer1Name] = React.useState(player1Name);
  const [tempPlayer2Name, setTempPlayer2Name] = React.useState(player2Name);

  const handleSaveNames = () => {
    const name1 = tempPlayer1Name.trim() || 'Player A';
    const name2 = tempPlayer2Name.trim() || 'Player B';
    
    setPlayer1Name(name1);
    setPlayer2Name(name2);
    localStorage.setItem('player1Name', name1);
    localStorage.setItem('player2Name', name2);
    
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="max-w-2xl mx-auto mb-12 px-4">
      <h3 className="text-2xl font-bold mb-6 text-white text-center">Enter Player Names</h3>
      <div className="flex gap-4 flex-wrap justify-center items-end">
        <div className="flex-1 min-w-[250px]">
          <label className="block mb-2 font-semibold text-blue-400">
            Player 1
          </label>
          <Input
            type="text"
            value={tempPlayer1Name}
            onChange={(e) => setTempPlayer1Name(e.target.value)}
            placeholder="Player A"
            className="w-full"
          />
        </div>
        <div className="flex-1 min-w-[250px]">
          <label className="block mb-2 font-semibold text-orange-400">
            Player 2
          </label>
          <Input
            type="text"
            value={tempPlayer2Name}
            onChange={(e) => setTempPlayer2Name(e.target.value)}
            placeholder="Player B"
            className="w-full"
          />
        </div>
        <button
          onClick={handleSaveNames}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105"
        >
          Save Names
        </button>
      </div>
    </div>
  );
}

function GameCard({ title, description, to, imageSrc }) {
  const frontContent = (
    <div className="flex flex-col h-full w-full p-4">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-auto object-cover flex-grow min-h-0 rounded-md"
      />
      <div className="p-2">
        <h3 className="text-xl font-bold mt-2 text-center">{title}</h3>
      </div>
    </div>
  );

  const backContent = (
    <div className="flex flex-col items-center justify-center h-full w-full p-6">
      <p className="text-sm mt-2 text-muted-foreground text-center mb-6">
        {description}
      </p>
      <Link 
        to={to}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm transition-colors duration-300"
      >
        Play Now
      </Link>
    </div>
  );

  return <FlippingCard width={280} height={320} frontContent={frontContent} backContent={backContent} />;
}

function Home() {
  console.log('Home component rendering...');
  
  const gamesData = [
    {
      title: 'Tic Tac Toe',
      description: 'Classic 2-player game. Get 3 in a row to win!',
      to: '/tic-tac-toe',
      imageSrc: '/images/tic-tac-toe.jpg'
    },
    {
      title: 'Dots and Boxes',
      description: 'Connect dots to form boxes. Most boxes wins!',
      to: '/dots-and-boxes',
      imageSrc: '/images/dot-and-box.jpg'
    },
    {
      title: 'Snake & Ladder',
      description: 'Roll the dice and race to 100. Watch out for snakes!',
      to: '/snake-ladder',
      imageSrc: '/images/snake-ladder.jpg'
    },
    {
      title: 'Leaderboard',
      description: 'View aggregated scores from all games!',
      to: '/leaderboard',
      imageSrc: '/images/leader-board.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Falling Pattern Background */}
      <div className="relative min-h-[600px] overflow-hidden">
        <FallingPattern 
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" 
          color="#3b82f6"
          backgroundColor="#000000"
        />
        
        <div className="relative z-10 w-full py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-8">
            {/* Left: Text Content */}
            <div className="text-left space-y-6">
              <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Battle Arena
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-gray-300">
                Challenge Your Friends in Epic 1v1 Battles!
              </p>
              <p className="text-lg text-gray-400">
                Choose your game, enter the arena, and prove who's the champion
              </p>
            </div>
            
            {/* Right: GIF */}
            <div className="flex justify-center md:justify-end">
              <img 
                src="https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif"
                alt="Gaming"
                className="max-w-full h-auto rounded-2xl shadow-2xl border-4 border-blue-500/30"
                style={{ maxWidth: '400px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Player Name Section */}
      <div className="py-12 bg-black">
        <PlayerNameSection />
      </div>

      {/* Game Cards Section */}
      <div className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Choose Your Game</h2>
          <div className="flex gap-6 flex-wrap justify-center">
            {gamesData.map((game) => (
              <GameCard key={game.title} {...game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
          <Navigation />
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
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
