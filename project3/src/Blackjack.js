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
    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);

    /*stores the image of the dealers second card since it will be face down to start*/
    const [hiddenCard, setHiddenCard] = useState("");

    /*use these to dislay each hand*/
    const playerHand = playerCards.map(playerCard => <div><img src={playerCard.image} /></div>)
    const dealerHand = dealerCards.map(dealerCard => <div><img src={dealerCard.image} /></div>)

    /*store the players funds and current bet*/
    const [funds, setFunds] = useState(1000);
    const [bet, setBet] = useState(0);

    /*stores whether or not the player is in the middle of a game*/
    const [inGame, setInGame] = useState(false);

    /*stores the result of the game*/
    const [gameResult, setGameResult] = useState("");

    /*stores the codes of the cards that need to be returned to the deck*/
    //const [returnToDeck, setReturnToDeck] = useState([]);

    /*update the bet if the player is not in the middle of a game*/
    function handleChange(){
        if(!inGame){
            setBet(document.getElementById("bet").value);
        }
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

    /*determines whether to show the value of only the dealers first card or all cards, based on whether or not the game has ended*/
    function dealerValue(){
        //if(dealerCards){
            if(inGame && dealerCards[1]){
                if(dealerCards[1].value == 'ACE'){
                    if(dealerCards[0].value == 'ACE'){
                        return getValue(dealerCards) - 1;
                    }
                    else{
                        return getValue(dealerCards) - 11;
                    }
                }
                else if((dealerCards[1].value == 'JACK') || (dealerCards[1].value == 'KING') || (dealerCards[1].value == 'QUEEN')){
                    return getValue(dealerCards) - 10;
                }
                else{
                    return getValue(dealerCards) - parseInt(dealerCards[1].value);
                }
            }
            else{
                return getValue(dealerCards);
            }
        //}
        //else{
            //return 0;
        //}
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
            setGameResult("");

            /*locally stores the remaining cards in the deck*/
            //let cardsRemaining = remaining;

            /*Return any cards drawn in DealerTurn that weren't used to the deck (only matters after first game).
            Update cardsRemaining. Empty returnToDeck when done*/
            // if(returnToDeck){
            //     for(let i = returnToDeck.length - 1; i >= 0; i--){
            //         console.log(returnToDeck[i]);
            //         fetch('https://deckofcardsapi.com/api/deck/'+deckId+'/return/?cards='+returnToDeck[i])
            //         .then((response) => response.json())
            //         .then((json) => {
            //             console.log(json);
            //             cardsRemaining = json.remaining;
            //             console.log(cardsRemaining);
            //         })
            //         .catch((error) => {
            //             console.error(error);
            //         });
            //     }
            //     setReturnToDeck([]);
            // }

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
            
            /*temporary arrays to store the cards locally*/
            const newPlayerCards = [];
            const newDealerCards = [];

            /*draw the initial 4 cards*/
            fetch('https://deckofcardsapi.com/api/deck/'+deckId+'/draw/?count=4')
                .then((response) => response.json())
                .then((json) => {   
                    console.log(json);      
                    setRemaining(json.remaining);
                    /*append the new cards to each array*/
                    newPlayerCards.push({value: json.cards[0].value, image: json.cards[0].image});
                    newDealerCards.push({value: json.cards[1].value, image: json.cards[1].image}); 
                    newPlayerCards.push({value: json.cards[2].value, image: json.cards[2].image});
                    newDealerCards.push({value: json.cards[3].value, image: 'https://deckofcardsapi.com/static/img/back.png'});
                    setPlayerCards(newPlayerCards);
                    // playerCards.push({value: json.cards[0].value, image: json.cards[0].image});
                    // dealerCards.push({value: json.cards[1].value, image: json.cards[1].image});
                    // playerCards.push({value: json.cards[2].value, image: json.cards[2].image});
                    // dealerCards.push({value: json.cards[3].value, image: 'https://deckofcardsapi.com/static/img/back.png'});
                    setHiddenCard(json.cards[3].image);
                    console.log(newPlayerCards);
                    console.log(newDealerCards);
                    console.log(remaining);
                    console.log(getValue(newPlayerCards));
                    console.log(getValue(newDealerCards));
                     /*check for blackjacks, set result if necessary, show hidden card if there is a blackjack*/
                    if(getValue(newDealerCards) == 'blackjack'){
                        if(getValue(newPlayerCards) == 'blackjack'){
                            payout('push', bet);
                        }
                        else{
                            payout('loss', bet);
                        }
                        newDealerCards[1].image = json.cards[3].image;
                        setDealerCards(newDealerCards);
                    }
                    else if(getValue(newPlayerCards) == 'blackjack'){
                        payout('blackjack win', bet);
                        newDealerCards[1].image = json.cards[3].image;
                        setDealerCards(newDealerCards);
                    }
                    else{
                        console.log('no blackjacks');
                        console.log(getValue(newPlayerCards));
                        console.log(getValue(newDealerCards));
                        setDealerCards(newDealerCards);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        else{
            console.log('failure');
        }
    }

    /*Demetrius: The player draws a card from the deck (draw function available from API).
    If their total is greater than 21, they bust and their turn is over,
    otherwise they can continue playing.*/
    function Hit(){
        if(inGame){
            //declare a local array to store playerCards
            const myPlayerCards = playerCards;
            //call API to draw a card
            fetch('https://deckofcardsapi.com/api/deck/'+deckId+'/draw/?count=10')
                .then((response) => response.json())
                .then((json) => {  
                    console.log(remaining);     //
                    console.log(hiddenCard);
                    console.log(funds);
                    console.log(playerCards);
                    console.log(dealerCards);
                    console.log(getValue(playerCards));
                    console.log(getValue(dealerCards));
                    //inside the API call, append the new card to the local player array, then set playerCards to the local player array
                    //still inside the API call, check if the player busted using getValue(local player array)
                    console.log(json);                                                          //debugging purposes
                    myPlayerCards.push({value:json.cards[0].value, image:json.cards[0].image}); //appends new card to local player array
                    setPlayerCards(myPlayerCards);                                              //set playercards to local player array
                                    
                    //if the player busted, declare a local array to store dealerCards, set the image of the second card equal to hiddenCard
                    if(getValue(myPlayerCards) == 'bust' ) {
                        const myDealerCards = dealerCards;
                        myDealerCards[1].image = hiddenCard;
                        setDealerCards(myDealerCards);      //set dealercards to local dealer cards. 
                        payout('loss', bet);                // call payout function
                    }

                    console.log(remaining); 
                    setRemaining(json.remaining);    
                })
                .catch((error) => {
                    console.error(error);
            });
        }
        else {
            console.log("not in game");     //game is over or has not started. 
        }
    }
    /*Joey: After the player has finished their turn, the dealer draws cards until they reach at least 17.
    If the dealer reaches a total greater than 21, they "bust", and the player automatically wins unless they also busted.
    At the end of the dealer's turn they evaluate the player's hand against their own to determine the winner*/
    function DealersTurn(pCards, betAmt){
        if(inGame){
            //debugging help
            console.log(remaining);
            console.log(hiddenCard);
            console.log(funds);
            console.log(playerCards);
            console.log(dealerCards);
            console.log(getValue(playerCards));
            console.log(getValue(dealerCards));

            /*stores the dealers cards locally, shows the hidden card*/
            const newDealerCards = dealerCards;
            newDealerCards[1].image = hiddenCard;
            //const returnCards = [];

            /*determine when the dealer should stop drawing cards*/
            function stop(){
                if(getValue(newDealerCards) == 'bust'){
                    return true;
                }
                else if(getValue(newDealerCards) < 17){
                    return false;
                }
                else{
                    return true;
                }
            }

            /*call the API to draw 10 cards*/
            fetch('https://deckofcardsapi.com/api/deck/'+deckId+'/draw/?count=10')
            .then((response) => response.json())
            .then((json) => {  
                /*append each card to the dealer's hand until stop returns true or all 10 cards have been added
                (if all 10 cards are added, there is an error. mathematically, the most the dealer can draw is 9)*/
                for(let i = 0; i<10; i++){
                    if(!stop()){
                        console.log(json);      
                        newDealerCards.push({value: json.cards[i].value, image: json.cards[i].image});
                        console.log(newDealerCards);
                        console.log(getValue(newDealerCards));
                        if(i == 9){
                            console.log('loop error');
                        }
                    }
                    else{
                        console.log('stopped');
                        // returnCards.push(json.cards[i].code);
                        // console.log(returnCards);
                    }
                }
                //setReturnToDeck(returnCards);

                /*update appropriate states, then call calculateWinner*/
                setRemaining(json.remaining);
                setDealerCards(newDealerCards);
                console.log(remaining);
                calculateWinner(newDealerCards, pCards, betAmt);
            })
            .catch((error) => {
                console.error(error);
            });
            console.log('loop done');
        }
        else{
            console.log('not in game');
        }
    }

    /*Demetrius: When the player has exactly two cards in their hand, they can double their bet.
    They will then draw one card and their turn will be over and it will be the dealer's turn*/
    function DoubleDown(){
        if(inGame){
            //declare a local array to store playerCards
            //Check if the player has exactly two cards, only execute the function if exactly two cards
            //declare a local array to store dealerCards, then set the image of the second card equal to hiddenCard
            //set dealerCards to the local dealer array
            //call the API to draw a card
            const myPlayerCards = playerCards;
            if ((myPlayerCards.length == 2) && (funds >= (2*bet))) {
                const myDealerCards = dealerCards; 
                myDealerCards[1].image = hiddenCard;
                setDealerCards(myDealerCards);

                //inside the API call, append the new card to the local player array, then set playerCards to the local player array
                //still inside the API call, check if the player busted using getValue(local player array)
                fetch('https://deckofcardsapi.com/api/deck/'+deckId+'/draw/?count=1')
                    .then((response) => response.json())
                    .then((json) => {  
                        // console.log(remaining);     //
                        // console.log(hiddenCard);
                        // console.log(funds);
                        // console.log(playerCards);
                        // console.log(dealerCards);
                        // console.log(getValue(playerCards));
                        // console.log(getValue(dealerCards));

                        console.log(json);                                                          //debugging purposes
                        myPlayerCards.push({value:json.cards[0].value, image:json.cards[0].image}); //appends new card to local player array
                        setPlayerCards(myPlayerCards);                                              //set playercards to local player array
                                        
                        //if the player busted, call payout('loss', 2*bet), otherwise call DealersTurn(local player array, 2*bet)
                        if(getValue(myPlayerCards) == 'bust' ) {
                            payout('loss', 2* bet);                // call payout function
                        }
                        else {
                            DealersTurn(myPlayerCards, 2*bet);
                        }

                        console.log(remaining); 
                        console.log("funds are " + funds)
                        setRemaining(json.remaining);    
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            else {
                console.log('cannot double down, have more than 2 cards');
            }


        }
        else{
            console.log('not in game');
        }
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
    function calculateWinner(dCards, pCards, betAmt){
        if(getValue(dCards) == 'bust'){
            payout('win', betAmt);
        }
        else if(getValue(pCards) == getValue(dCards)){
            payout('push', betAmt);
        }
        else if(getValue(pCards) > getValue(dCards)){
            payout('win', betAmt)
        }
        else{
            payout('loss', betAmt);
        }
    }

    /*determine the payout based on the result of the game. Set inGame to false*/
    function payout(result, betAmt){
        if(result == 'win'){
            setFunds(funds + parseInt(betAmt));
            console.log('win');
        }
        else if(result == 'push'){
            console.log('push');
        }
        else if(result == 'blackjack win'){
            setFunds(funds + (1.5*betAmt));
            console.log('blackjack win');
        }
        else{
            setFunds(funds - betAmt);
            console.log('loss');
        }
        setGameResult(result);
        setInGame(false);
    }

    /*Han: Arrange and style these elements as you see fit. Also display the total value for each hand,
    as well as the player's current bet, and how much money they have left.
    The player's and dealer's cards should both be displayed as well (images available from API).
    Whenever a card is drawn by the dealer or player, that card should be displayed alongside the rest of the hand.
    Once the game is over, no cards should be displayed. Also display a win/lose message at the end of the game.*/
    return (
        <div>
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
              <div>Dealer Score: {dealerValue()}</div>
              <div>Your Score: {getValue(playerCards)}</div>
            </div>

            {/* Game result message (placeholder) */}
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'green',
            }}>
              {gameResult}
            </div>
          </div>

          {/* scoreboard and betting */}
          <div>
            <input
              type="number"
              id="bet"
              value={bet}
              onChange={handleChange}
            />
            <button onClick={Deal}>Place Bet</button>
          </div>
          <div>
            <button onClick={Hit}>Hit</button>
            <button onClick= {() => DealersTurn(playerCards, bet)}>Stay</button>
            <button onClick={DoubleDown}>Double Down</button>
            <button onClick={Split}>Split</button>
          </div>

            <div style={{ fontWeight: 'bold', marginTop: '12px' }}>
              Funds: ${funds}
            </div>
      
          {/* dealer card */}
          <div>
            <h2>Dealer</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {dealerHand}
            </div>
          </div>
      
          {/* player card */}
          <div>
            <h2>Player</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {playerHand}
            </div>
          </div>
        </div>
      );
}
