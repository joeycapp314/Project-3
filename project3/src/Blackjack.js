import Home from './Home';
import React from 'react';
import ReactDOM from 'react-dom/client';
export default function Blackjack(){
    
    /*Joey: If there are less than 30 cards remaining, shuffle (shuffle function available from API).
    Then, if the player has placed a bet of at least 1, the initial cards are dealt.
    First, the player is dealt a card face up, then the dealer is dealt a card face up,
    then the player is dealt a second card face up, then the dealer is dealt a second card face down*/
    function Deal(){

    }

    /*Demetrius: The player draws a card from the deck (draw function available from API).
    If their total is greater than 21, they bust and their turn is over,
    otherwise they can continue playing.*/
    function Hit(){

    }
    /*Joey: After the player has finished their turn, the dealer draws cards until they reach at least 17.
    If the dealer reaches a total greater than 21, they "bust", and the player automatically wins unless they also busted.
    At the end of the dealer's turn they evaluate the player's hand against their own to determine the winner*/
    function DealersTurn(){

    }

    /*Demetrius: When the player has exactly two cards in their hand, they can double their bet.
    They will then draw one card and their turn will be over*/
    function DoubleDown(){

    }

    /*This might be tricky to implement since it will require changes to other functions, so we'll only do this if we have time.
    If a player has two cards of the same value they can split them into two separate hands by matching their initial bet.
    They can then play out the first hand like normal, then move on to the second hand.
    Once both hands are done the dealer takes their turn, then each hand is evaluated separately against the dealer*/
    function Split(){

    }

    /*Joey: Once the dealer's turn is over, the dealer evaluates the player's hand against their own.
    If the player busted, the player loses. If the player did not bust, but the dealer did, the player wins.
    If one of the player or the dealer has blackjack (A, 1o) but not the other, whoever has blackjack wins.
    If both the player and the dealer have blackjack it's a push.
    Otherwise whoever has the greatest total wins.
    If the player wins, they recieve a payout equal to their bet. If they lose, they lose their bet.
    If it's a push, they keep their bet, but don't win anything.*/
    function calculateWinner(){

    }

    /*Han: Arrange and style these elements as you see fit. Also display the total value for each hand,
    as well as the player's current bet, and how much money they have left.
    The player's and dealer's cards should both be displayed as well (images available from API).
    Whenever a card is drawn by the dealer or player, that card should be displayed alongside the rest of the hand.
    Once the game is over, no cards should be displayed. Also display a win/lose message at the end of the game.*/
    return(
        <div>
            <input></input>
            <button onClick={Deal}>Place Bet</button>
            <button onClick={Hit}>Hit</button>
            <button onClick={DealersTurn}>Stay</button>
            <button onClick={DoubleDown}>Double Down</button>
            <button onClick={Split}>Split</button>
        </div>
    )
}
