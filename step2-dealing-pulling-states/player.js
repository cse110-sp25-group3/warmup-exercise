import {Deck} from './deck.js'

// Constructor for initializing the game state
export class CardManager{
    constructor(){
        // deck
        this.deck = new Deck();
        this.deck.init();
        this.deck.shuffle(); // is there an animation for shuffle?

        // hand
        this.playerHand = [];
        this.dealerHand = [];
    }

    // Deals two cards to both player and dealer
    initialDeal(){
        this.playerHand = this.deck.dealMultiple(2);
        this.dealerHand = this.deck.dealMultiple(2);
    }

    // Deals one card to the player
    hitPlayer(){
        
    }

    // Deals one card to the Dealer
    hitDealer(){

    }

    // return the current hands from both player and dealer
    getHands(){

    }

    // reset deck and clears hands
    resetGame(){
        this.deck.reset();
        this.deck.shuffle();
        this.playerHand = [];
        this.dealerHand = [];
    }
}