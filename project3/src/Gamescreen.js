import React from 'react';

const GameScreen = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Blackjack</h1>

      {/* dealer area */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Dealer</h2>
        <div className="flex space-x-2">
          <div className="w-16 h-24 bg-gray-300 rounded shadow">🂠</div>
          <div className="w-16 h-24 bg-white rounded shadow flex items-center justify-center">10♠</div>
        </div>
      </div>

      {/* player area */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">You</h2>
        <div className="flex space-x-2">
          <div className="w-16 h-24 bg-white rounded shadow flex items-center justify-center">7♦</div>
          <div className="w-16 h-24 bg-white rounded shadow flex items-center justify-center">8♣</div>
        </div>
      </div>

      {/* button */}
      <div className="text-center mt-6">
        <button className="bg-green-600 text-white px-4 py-2 rounded mr-2">Hit</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded">Stand</button>
      </div>
    </div>
  );
};

export default GameScreen;