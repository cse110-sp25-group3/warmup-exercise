/* deck.js */

//deck.js module handles deck initialization, shuffling, and dealing.
export class Deck {
    constructor(){
      /**
       * @type {Array<{suit: string, rank: string}>}
       */
      this.cards= [];
    }
  
    /**
     *initialize standard 52-card deck.
     */
    init(){
      const suits =['Hearts', 'Diamonds', 'Clubs', 'Spades'];
      const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      this.cards = [];
      for (const suit of suits) {
        for (const rank of ranks){
          this.cards.push({suit,rank });
        }
      }
    }
  
    /**
     * Shuffle deck：using Fisher–Yates algorithm.
     */
    shuffle() {
      const { cards } = this;
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    }
  
    /**
     * deal a single card from the top of the deck.
     * @returns {{suit: string,rank: string}|null}
     */
    dealCard() {
      return this.cards.length> 0 ? this.cards.shift() : null;
    }
  
    /**
     * Deal multiple cards at once.
     * @param{number} count - Number of cards to deal.
     * @returns {Array<{suit: string, rank: string}>}
     */
    dealMultiple(count){
      const hand = [];
      for (let i = 0; i <count; i++) {
        const card = this.dealCard();
        if (card)hand.push(card);
        else break;
      }
      return hand;
    }
  
    /**
     * reset deck, unshuffled state.
     */
    reset(){
      this.init();
    }
  }
  