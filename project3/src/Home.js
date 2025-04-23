import Home from './Home';
import Blackjack from './Blackjack';
import React from 'react';
import ReactDOM from 'react-dom/client';
export default function HomePage () {

    function playGame(){
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <Blackjack />
          );
    }

    /*Han: Display the play button in the center of the page. Add a title and some graphics. Style everything as you see fit*/
    return (
        <div>
            <button onClick={playGame}>Play</button>
        </div>
    )
}

