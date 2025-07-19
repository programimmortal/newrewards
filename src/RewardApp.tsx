import React, { useState } from 'react';

const getAdToCoinRatio = (coins: number) => {
  if (coins < 500) return 1;
  if (coins < 1000) return 2;
  // Add more tiers here if needed
  return 3; // Example: 3 ads per coin for 1000+ coins
};

const RewardApp: React.FC = () => {
  const [coins, setCoins] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
  const [email, setEmail] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [withdrawMessage, setWithdrawMessage] = useState('');
  const [adWatching, setAdWatching] = useState(false);

  const adToCoin = getAdToCoinRatio(coins);

  const handleWatchAd = () => {
    setAdWatching(true);
    setTimeout(() => {
      setAdWatching(false);
      const newAdsWatched = adsWatched + 1;
      if (newAdsWatched >= adToCoin) {
        setCoins(coins + 1);
        setAdsWatched(0);
      } else {
        setAdsWatched(newAdsWatched);
      }
    }, 2000); // Simulate 2s ad
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !redeemCode) {
      setWithdrawMessage('Please enter both email and redeem code.');
      return;
    }
    if (coins === 0) {
      setWithdrawMessage('You need coins to withdraw.');
      return;
    }
    setWithdrawMessage(`Withdrawal request sent for ${coins} coins to ${email} with code ${redeemCode}.`);
    setCoins(0);
    setAdsWatched(0);
    setEmail('');
    setRedeemCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🎁 Reward System</h1>
        
        {/* Coin Display */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 mb-6 text-center">
          <div className="text-white text-lg font-semibold">Your Coins</div>
          <div className="text-white text-4xl font-bold">{coins}</div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to next coin</span>
            <span>{adsWatched}/{adToCoin}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(adsWatched / adToCoin) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Ad to Coin Ratio */}
        <div className="bg-blue-50 rounded-lg p-3 mb-6 text-center">
          <span className="text-sm text-gray-600">Current ratio: </span>
          <span className="font-semibold text-blue-700">{adToCoin} ad(s) = 1 coin</span>
        </div>

        {/* Watch Ad Button */}
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mb-8"
          onClick={handleWatchAd}
          disabled={adWatching}
        >
          {adWatching ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Watching Ad...
            </div>
          ) : (
            '📺 Watch Ad'
          )}
        </button>

        {/* Withdrawal Section */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">💰 Withdraw Coins</h2>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Redeem code"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={redeemCode}
              onChange={e => setRedeemCode(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={coins === 0}
            >
              Withdraw {coins} Coins
            </button>
          </form>
          {withdrawMessage && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              {withdrawMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardApp;