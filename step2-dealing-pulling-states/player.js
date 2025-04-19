import { Deck } from './deck.js';

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
        this.dealtCards = [];
    }

    // Deals two cards to both player and dealer
    initialDeal(){
        this.playerHand = this.deck.dealMultiple(2);
        this.dealerHand = this.deck.dealMultiple(2);
    }

    // Deals one card to the player
    hitPlayer(){
        const card = this.deck.dealCard();
        if (card) this.playerHand.push(card);
        return card; // lets other code that call this function know what was dealt
    }

    // Deals one card to the Dealer
    hitDealer(){
        const card = this.deck.dealCard();
        if (card) this.dealerHand.push(card);
        return card; // lets other code that call this function know what was dealt
    }

    /*
    can try the following in the testing html, it will give 3 cards instead of 2 because further edition
    of the hands would reflect on the console
    getHands(){
        return {
        player: this.playerHand,
        dealer: this.dealerHand,
        };
    }
    */
    // return the current hands from both player and dealer
    getHands(){
        const playersHand = this.playerHand.slice();
        const dealersHand = this.dealerHand.slice();
        return{ // returns the copy of the original hand so that further action won't directly affect the appearance of previous dealing
            dealer: dealersHand,
            player: playersHand
        };
    }

    

    // reset deck and clears hands
    resetGame(){
        this.deck.reset();
        this.deck.shuffle();
        this.playerHand = [];
        this.dealerHand = [];
    }
}