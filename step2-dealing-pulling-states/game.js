// game.js

import { Deck } from './deck.js';
import { GameState } from './state.js';
import { calculatePayout } from './payout.js';
// import { Player } from './player.js'; 
// import * as Rules from './rules.js'; 
// import * as Actions from './actions.js';
// import * as Recommendation from './recommendation.js';

export class BlackjackGame {
    
  constructor(){
    this.deck = new Deck();
    this.state = new GameState();
    this.playerHand = [];
    this.dealerHand =[];
    this.roundOver=false;
  }

  /**
   * initialize the round: shuffle and deal cards
   */
  startRound() {
    this.deck.reset();
    this.deck.shuffle();
    this.playerHand =this.deck.dealMultiple(2);
    this.dealerHand = this.deck.dealMultiple(2);
    this.roundOver= false;
  }

  /**
   * Player requests another card
   */
  playerHit() {
    const card = this.deck.dealCard();
    if (card) this.playerHand.push(card);
    // TODO: Check bust using rules.js
  }

  /**
   * player ends turn, dealer starts
   */
  playerStand() {
    // TODO: Implement dealer logic (draw to 17, hit soft 17)
    // TODO: Compare hands and determine result
    // TODO: Call settle() with resultType
  }

  /**
   * player uses double down
   */
  playerDoubleDown(){
    // TODO: Implement doubling bet and dealing one more card
  }

  /**
   * Player chooses to surrender
   */
  playerSurrender(){
    // TODO: Forfeit half bet and end round
  }

  /**
   * Player splits hand
   */
  playerSplit() {
    // TODO: Handle splitting hand logic
  }

  /**
   * Apply game result and adjust player's balance
   * @param {'win'|'blackjack'|'tie'|'lose'} resultType
   */
  settle(resultType){
    const payout =calculatePayout(resultType, this.state.currentBet);
    this.state.updateMoney(payout);
    this.roundOver = true;
    //TODO: Notify frontend of result
  }

  /**
   * get recommended action from recommendation.js
   */
  getRecommendedAction() {
    //TODO: Call recommendation logic and return hint (e.g., 'hit', 'stand')
  }

  /**
   * For testing
   */
  debugHands() {
    console.log("Player:", this.playerHand);
    console.log("Dealer:", this.dealerHand);
  }
}