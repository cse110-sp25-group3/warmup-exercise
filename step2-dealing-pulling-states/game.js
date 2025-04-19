// game.js

import { Deck } from './deck.js';
import { GameState } from './state.js';
import { calculatePayout } from './payout.js';
import { CardManager } from './player.js';
// import { Player } from './player.js'; 
// import * as Rules from './rules.js'; 
// import * as Actions from './actions.js';
// import * as Recommendation from './recommendation.js';

export class BlackjackGame {
    
  constructor(){
    this.cardManager = new CardManager(); // Handles deck and hand management
    this.state = new GameState();
    this.roundOver=false;
  }

  /**
   * initialize the round: shuffle and deal cards
   */
  startRound() {
    this.cardManager.resetGame();
    this.cardManager.initialDeal();
    this.roundOver= false;
  }

  /**
   * For getting direct access to player's hand
   */
  get playerHand() {
    return this.cardManager.getHands().player;
  }

  /**
   * For getting direct access to dealer's hand
   */
  get dealerHand() {
    return this.cardManager.getHands().dealer;
  }

  /**
   * Player requests another card
   */
  playerHit() {
    this.cardManager.hitPlayer();
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
    const hands = this.cardManager.getHands();
    console.log('Player Hand:', hands.player);
    console.log('Dealer Hand:', hands.dealer);
  }
}