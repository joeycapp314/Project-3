import React from 'react';
import Blackjack from './Blackjack';

// Main screen that wraps the Blackjack game
const GameScreen = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '24px', backgroundColor: '#f0f0f0' }}>
      
      {/* Page title */}
      <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '24px', fontWeight: 'bold' }}>
        Blackjack
      </h1>

      {/* Main game container */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>

        {/* Scoreboard and message */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          
          {/* scores */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '12px',
          }}>
            <div>Dealer Score: ??</div>
            <div>Your Score: ??</div>
          </div>

          {/* Game result message (placeholder) */}
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'green',
          }}>
            Game Message Here
          </div>

        </div>

        <Blackjack />

      </div>
    </div>
  );
};

export default GameScreen;