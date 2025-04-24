import Home from './Home';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';

export default function Blackjack(){
    /*stores the deckId from the API*/
    const [deckId, setDeckId] = useState("");
    const [remaining, setRemaining] = useState("");

    /*Get a new shuffled deck of cards using 6 decks, update deckId*/
    if(!deckId){
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
            .then((response) => response.json())
            .then((json) => {   
                console.log(json);      
                setDeckId(json.deck_id);
                setRemaining(json.remaining);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    /*arrays to store the value and image of each card in the hand*/
    const playerCards = [];
    const dealerCards = [];

    /*stores the image of the dealers second card since it will be face down to start*/
    const [hiddenCard, setHiddenCard] = useState("");

    /*use these to dislay each hand*/
    const playerHand = playerCards.map(playerCard => <div><image src={playerCard.image} /></div>)
    const dealerHand = dealerCards.map(dealerCard => <div><image src={dealerCard.image} /></div>)

    /*store the players funds and current bet*/
    const [funds, setFunds] = useState(1000);
    const [bet, setBet] = useState(0);

    /*stores whether or not the player is in the middle of a game*/
    const [inGame, setInGame] = useState(false);

    /*stores the result of the game: win, push, or loss*/
    const [result, setResult] = useState("");

    /*stores the values of each hand*/
    const [dealerValue, setDealerValue] = useState('0');
    const [playerValue, setPlayerValue] = useState('0');

    /*update the bet*/
    function handleChange(){
        setBet(document.getElementById("bet").value);
    }
    /*First replace the value of all kings, queens, jacks with 10, then check for blackjack.
    If no blackjack, iterate through the cards in the hand and start adding them up.
    If there is one Ace, 11 is added to highValue and 1 is added to lowValue.
    If there are multiple Aces, for all Aces after the first, 1 is added to the value.
    Return highValue if it is not a bust, otherwise return lowValue.*/
    function getValue(cardsArr){
        let numAces = 0;
        let highValue = 0;
        let lowValue = 0;
        for(let i = 0; i <cardsArr.length; i++){
            if(cardsArr[i].value == 'ACE'){
                numAces++
                lowValue++;
                if(numAces > 1){
                    highValue++;
                }
                else{
                    highValue = highValue + 11;
                }
            }
            else{
                if((cardsArr[i].value == 'JACK') || (cardsArr[i].value == 'QUEEN') || (cardsArr[i].value == 'KING')){
                    lowValue = lowValue + 10;
                    highValue = highValue + 10;
                }
                else{
                    lowValue = lowValue + parseInt(cardsArr[i].value, 10);
                    highValue = highValue + parseInt(cardsArr[i].value, 10);
                }
            }
        }
        if((highValue == 21) && (cardsArr.length == 2)){
            return 'blackjack';
        }
        else if(highValue > 21){
            if(lowValue > 21){
                return 'bust';
            }
            else{
                return lowValue;
            }
        }
        else{
            return highValue;
        }
    }
    
    /*Joey: If there are less than 30 cards remaining, shuffle (shuffle function available from API).
    Then, if the player has placed a bet of at least 1 and less than their remaining funds, the initial cards are dealt.
    First, the player is dealt a card face up, then the dealer is dealt a card face up,
    then the player is dealt a second card face up, then the dealer is dealt a second card face down*/
    function Deal(){
        /*update the bet if the player is not already in a game*/
        if(!inGame){
            setBet(document.getElementById("bet").value);
            console.log(bet);
        }

        /*check if the bet is at least 1 and within the player's funds, also checks if they are already in a game*/
        if((bet > 0) && (bet <= funds) && !inGame){
            console.log('success');
            setInGame(true);
            setFunds(funds - bet);

            /*check if the deck needs to be reshuffled*/
            if(remaining < 30){
                fetch('https://deckofcardsapi.com/api/deck/'+deckId+'/shuffle/?deck_count=6')
                    .then((response) => response.json())
                    .then((json) => {   
                        console.log(json);      
                        setDeckId(json.deck_id);
                        setRemaining(json.remaining);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

            /*draw the initial 4 cards*/
            fetch('https://deckofcardsapi.com/api/deck/'+deckId+'/draw/?count=4')
                .then((response) => response.json())
                .then((json) => {   
                    console.log(json);      
                    setRemaining(json.remaining);
                    playerCards.push({value: json.cards[0].value, image: json.cards[0].image});
                    dealerCards.push({value: json.cards[1].value, image: json.cards[1].image});
                    playerCards.push({value: json.cards[2].value, image: json.cards[2].image});
                    dealerCards.push({value: json.cards[3].value, image: 'https://deckofcardsapi.com/static/img/back.png'});
                    setHiddenCard(json.cards[3].image);
                    console.log(playerCards);
                    console.log(dealerCards);
                    console.log(remaining);
                    console.log(getValue(playerCards));
                })
                .catch((error) => {
                    console.error(error);
                });
            
            /*check for blackjacks, set result if necessary*/
            if(getValue(dealerCards) == 'blackjack'){
                if(getValue(playerCards) == 'blackjack'){
                    setResult('push');
                }
                else{
                    setResult('loss');
                }
            }
            else if(getValue(playerCards) == 'blackjack'){
                setResult('win');
            }
        }
        else{
            console.log('failure');
        }
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
        console.log(remaining);
        console.log(hiddenCard);
        console.log(funds);
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
            <input
                type="number"
                id="bet"
                value={bet}
                onChange={handleChange}
            />
            <button onClick={Deal}>Place Bet</button>
            <button onClick={Hit}>Hit</button>
            <button onClick={DealersTurn}>Stay</button>
            <button onClick={DoubleDown}>Double Down</button>
            <button onClick={Split}>Split</button>
        </div>
    )
}
