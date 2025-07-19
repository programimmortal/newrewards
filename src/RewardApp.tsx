import React, { useState, useEffect } from 'react';

interface User {
  email: string;
  coins: number;
  adsWatched: number;
  hasWithdrawn: boolean;
}

interface AdContent {
  title: string;
  description: string;
  category: string;
  duration: number; // in seconds (15 seconds)
}

const ads: AdContent[] = [
  {
    title: "Discover Amazing Travel Destinations",
    description: "Explore the world's most beautiful places with our comprehensive travel guide. From exotic beaches to mountain adventures, find your next perfect vacation spot.",
    category: "Travel",
    duration: 15
  },
  {
    title: "Revolutionary Fitness Program",
    description: "Transform your body in just 30 days with our scientifically proven workout system. Join millions who have already achieved their fitness goals.",
    category: "Health & Fitness",
    duration: 15
  },
  {
    title: "Master Digital Marketing",
    description: "Learn the secrets of successful online marketing from industry experts. Boost your business with proven strategies and techniques.",
    category: "Business",
    duration: 15
  },
  {
    title: "Smart Home Technology",
    description: "Upgrade your living space with cutting-edge smart home devices. Control everything from your smartphone and save energy costs.",
    category: "Technology",
    duration: 15
  },
  {
    title: "Gourmet Cooking Masterclass",
    description: "Become a chef in your own kitchen with professional cooking techniques. Learn to create restaurant-quality meals at home.",
    category: "Food & Cooking",
    duration: 15
  },
  {
    title: "Investment Strategies for Beginners",
    description: "Start building wealth today with proven investment strategies. Learn from financial experts and secure your future.",
    category: "Finance",
    duration: 15
  },
  {
    title: "Learn a New Language Fast",
    description: "Master any language in just 30 days with our revolutionary learning method. Speak confidently with native speakers.",
    category: "Education",
    duration: 15
  },
  {
    title: "Gaming Setup Essentials",
    description: "Build the ultimate gaming setup with the latest hardware and accessories. Dominate your favorite games like never before.",
    category: "Gaming",
    duration: 15
  }
];

const RewardApp: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'ad' | 'withdraw'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  // Ad watching state
  const [currentAd, setCurrentAd] = useState<AdContent | null>(null);
  const [adTimeRemaining, setAdTimeRemaining] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  
  // Withdrawal state
  const [withdrawalForm, setWithdrawalForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [withdrawalMessage, setWithdrawalMessage] = useState('');

  // Timer for ad watching
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWatchingAd && adTimeRemaining > 0) {
      interval = setInterval(() => {
        setAdTimeRemaining(prev => {
          if (prev <= 1) {
            // Ad finished
            setIsWatchingAd(false);
            setCurrentPage('dashboard');
            if (user) {
              const updatedUser = {
                ...user,
                coins: user.coins + 1,
                adsWatched: user.adsWatched + 1
              };
              setUser(updatedUser);
              localStorage.setItem('rewardUser', JSON.stringify(updatedUser));
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWatchingAd, adTimeRemaining, user]);

  // Load user data on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('rewardUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please enter both email and password');
      return;
    }
    if (loginForm.password.length < 6) {
      setLoginError('Password must be at least 6 characters');
      return;
    }

    // Check if user exists
    const savedUser = localStorage.getItem('rewardUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.email === loginForm.email) {
        setUser(userData);
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
        setLoginError('');
        return;
      }
    }

    // Create new user
    const newUser: User = {
      email: loginForm.email,
      coins: 0,
      adsWatched: 0,
      hasWithdrawn: false
    };
    setUser(newUser);
    localStorage.setItem('rewardUser', JSON.stringify(newUser));
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    setLoginError('');
  };

  const handleWatchAd = () => {
    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    setCurrentAd(randomAd);
    setAdTimeRemaining(randomAd.duration);
    setIsWatchingAd(true);
    setCurrentPage('ad');
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (user.coins < 100) {
      setWithdrawalMessage('You need at least 100 coins to withdraw for the first time.');
      return;
    }

    if (!withdrawalForm.cardNumber || !withdrawalForm.expiryDate || !withdrawalForm.cvv || !withdrawalForm.cardholderName) {
      setWithdrawalMessage('Please fill in all card details.');
      return;
    }

    // Simulate withdrawal
    const updatedUser = {
      ...user,
      coins: 0,
      hasWithdrawn: true
    };
    setUser(updatedUser);
    localStorage.setItem('rewardUser', JSON.stringify(updatedUser));
    setWithdrawalMessage(`Successfully withdrawn ${user.coins} coins to card ending in ${withdrawalForm.cardNumber.slice(-4)}`);
    setWithdrawalForm({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('login');
    setLoginForm({ email: '', password: '' });
    localStorage.removeItem('rewardUser');
  };

  const formatTime = (seconds: number) => {
    return `${seconds.toString().padStart(2, '0')}s`;
  };

  // Login Page
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🎁 Reward System</h1>
            <p className="text-gray-400">Login to start earning coins</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={loginForm.email}
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="Enter your password (min 6 characters)"
                required
                minLength={6}
              />
            </div>
            {loginError && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Login / Sign Up
            </button>
          </form>
          <p className="text-gray-500 text-xs text-center mt-4">
            New users will be automatically registered
          </p>
        </div>
      </div>
    );
  }

  // Ad Watching Page
  if (currentPage === 'ad' && currentAd) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">📺 Advertisement</h1>
            <div className="flex items-center space-x-4">
              <div className="text-red-400 font-mono text-lg bg-red-900 px-3 py-1 rounded-lg">
                ⏱️ {formatTime(adTimeRemaining)}
              </div>
              <div className="text-yellow-400">💰 {user?.coins} coins</div>
            </div>
          </div>
        </div>

        {/* Ad Content */}
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-gray-800 rounded-xl p-8 mb-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-blue-400 bg-blue-900 px-3 py-1 rounded-full">
                {currentAd.category}
              </div>
              <div className="text-sm text-gray-400">
                Ad {user?.adsWatched + 1} of ∞
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">{currentAd.title}</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{currentAd.description}</p>
          </div>

          {/* Fake Ad Video Player */}
          <div className="bg-black rounded-xl aspect-video flex items-center justify-center mb-6 border-2 border-gray-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
            <div className="text-center z-10">
              <div className="text-6xl mb-4 animate-pulse">📺</div>
              <div className="text-2xl text-white font-bold mb-2">Advertisement Playing...</div>
              <div className="text-lg text-red-400 font-mono bg-black/50 px-4 py-2 rounded-lg">
                ⚠️ Cannot skip • {formatTime(adTimeRemaining)} remaining
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-700 rounded-full h-4 mb-6 border border-gray-600">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
              style={{ width: `${((15 - adTimeRemaining) / 15) * 100}%` }}
            >
              {adTimeRemaining <= 10 && (
                <span className="text-white text-xs font-bold">
                  {Math.round(((15 - adTimeRemaining) / 15) * 100)}%
                </span>
              )}
            </div>
          </div>

          <div className="text-center text-gray-400 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p className="text-lg mb-2">🎯 Please watch the complete advertisement to earn your coin.</p>
            <p className="text-sm text-red-400">⚠️ Closing this page will cancel your progress and you won't earn the coin.</p>
            <p className="text-sm text-green-400 mt-2">✨ You'll earn 1 coin after this ad completes!</p>
          </div>
        </div>
      </div>
    );
  }

  // Withdrawal Page
  if (currentPage === 'withdraw') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-2 transition-colors"
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-yellow-400 bg-yellow-900 px-3 py-1 rounded-lg">💰 {user?.coins} coins</span>
              <span className="text-gray-300">{user?.email}</span>
              <button 
                onClick={handleLogout} 
                className="text-red-400 hover:text-red-300 bg-red-900 px-3 py-1 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="max-w-md mx-auto p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">💳 Withdraw Coins</h1>
          
          {user && user.coins < 100 && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
              <h3 className="text-red-300 font-bold mb-2">⚠️ Minimum Withdrawal Required</h3>
              <p className="text-red-300">You need at least 100 coins to withdraw for the first time.</p>
              <p className="text-red-400 text-sm mt-1">
                Current coins: {user.coins} | Need: {100 - user.coins} more coins
              </p>
              <div className="mt-3 bg-red-800 rounded-lg p-2">
                <div className="text-xs text-red-200">Progress to withdrawal:</div>
                <div className="bg-red-700 rounded-full h-2 mt-1">
                  <div 
                    className="bg-red-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(user.coins / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleWithdrawal} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={withdrawalForm.cardholderName}
                onChange={e => setWithdrawalForm({...withdrawalForm, cardholderName: e.target.value})}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                value={withdrawalForm.cardNumber}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                  setWithdrawalForm({...withdrawalForm, cardNumber: value});
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  value={withdrawalForm.expiryDate}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                    setWithdrawalForm({...withdrawalForm, expiryDate: value});
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  value={withdrawalForm.cvv}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '');
                    setWithdrawalForm({...withdrawalForm, cvv: value});
                  }}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!user || user.coins < 100}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {user && user.coins >= 100 ? `Withdraw ${user.coins} Coins` : 'Need 100 Coins to Withdraw'}
            </button>
          </form>

          {withdrawalMessage && (
            <div className="mt-4 p-4 bg-green-900 border border-green-700 rounded-lg text-green-300">
              ✅ {withdrawalMessage}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard Page
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with Profile */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎁 Reward Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-yellow-400 bg-yellow-900 px-3 py-2 rounded-lg font-semibold">
              💰 {user?.coins} coins
            </div>
            <div className="bg-gray-700 px-3 py-2 rounded-lg">
              <span className="text-gray-300 text-sm">👤 {user?.email}</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="text-red-400 hover:text-red-300 bg-red-900 px-3 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-yellow-400">{user?.coins}</div>
              <div className="text-gray-400">Total Coins</div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-3xl mb-2">📺</div>
              <div className="text-2xl font-bold text-blue-400">{user?.adsWatched}</div>
              <div className="text-gray-400">Ads Watched</div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-green-400">
                {user && user.coins >= 100 ? '✅' : `${user ? 100 - user.coins : 100}`}
              </div>
              <div className="text-gray-400">
                {user && user.coins >= 100 ? 'Can Withdraw' : 'Coins to Withdraw'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress to Withdrawal */}
        {user && user.coins < 100 && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <h3 className="text-lg font-bold mb-4">🎯 Progress to First Withdrawal</h3>
            <div className="bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(user.coins / 100) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{user.coins} coins earned</span>
              <span>{100 - user.coins} coins remaining</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleWatchAd}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 border-2 border-blue-500"
          >
            <div className="text-4xl mb-2">📺</div>
            <div className="text-xl mb-1">Watch Advertisement</div>
            <div className="text-sm opacity-80">Earn 1 coin • 15 seconds</div>
          </button>

          <button
            onClick={() => setCurrentPage('withdraw')}
            disabled={!user || user.coins < 100}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-6 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 border-2 border-green-500 disabled:border-gray-500"
          >
            <div className="text-4xl mb-2">💳</div>
            <div className="text-xl mb-1">Withdraw Coins</div>
            <div className="text-sm opacity-80">
              {user && user.coins >= 100 ? 'Ready to withdraw!' : 'Need 100 coins minimum'}
            </div>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4">📋 How it Works</h3>
          <div className="space-y-2 text-gray-300">
            <div className="flex items-center space-x-3">
              <span className="text-blue-400">1️⃣</span>
              <span>Watch 15-second advertisements to earn coins</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-blue-400">2️⃣</span>
              <span>Each completed ad gives you 1 coin</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-blue-400">3️⃣</span>
              <span>Collect 100 coins to unlock withdrawal</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-blue-400">4️⃣</span>
              <span>Provide card details to withdraw your earnings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardApp;