import Home from './Home';
import Blackjack from './Blackjack';
import React from 'react';
import ReactDOM from 'react-dom/client';
export default function HomePage () {
    return (
        <div>
            <button onClick={playGame}>Play</button>
        </div>
    )
}

function playGame(){
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <Blackjack />
      );
}