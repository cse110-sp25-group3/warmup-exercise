// game.js

import { Deck } from './deck.js';
import { GameState } from './state.js';
import { calculatePayout } from './payout.js';
import { CardManager } from './player.js';
import { evaluateHands, isBust , calculateHandValue, isBlackjack } from '../step3-blackjack/pages/rules.js';
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
    if (isBust(this.playerHand)) {
      this.settle('lose');
    }
  }

  /**
   * Helper functions for playerStand to execute repeating code
   */
  executeDealerHitAndSettle(playerCards){ //Note: since there only need one more hand to determine win/lose in tie condition
                                          // we settle it immediately after comparing
    this.cardManager.hitDealer();
    const playerState = evaluateHands(playerCards, this.dealerHand);
    this.settle(playerState);
  }

  /**
   * player ends turn, dealer starts
   * dealer's game logic is here
   */
  playerStand() {
    const playerCards = this.playerHand;
    let playerState = evaluateHands(playerCards, this.dealerHand);
    let dealerValue = calculateHandValue(this.dealerHand);

    while(!isBust(this.dealerHand) && (playerState === 'win' || playerState === 'tie')){ // if the current hand of dealer is impossible to win the player:
      if (playerState === 'tie'){ // if it's tie: if next hand doesn't make the dealer bust, dealer would definetly win since tie = player=dealer
        if (isBlackjack(playerCards)){
          this.settle('tie'); // if both have blackjack it's always a tie
          return;
        }
        if (dealerValue === 17 && this.dealerHand.some(card => card.rank === 'A')){ // Hit on soft 17 (ace involved)
          executeDealerHitAndSettle(playerCards); // read the helper function defined above
          return;
        } 
        if (dealerValue < 17){ // Must hit on a total of 16 or less 
          executeDealerHitAndSettle(playerCards);
          return;
        }
        if (dealerValue > 17){ // Stand on a total of 17 or more 
          playerState = evaluateHands(playerCards, this.dealerHand);
          this.settle(playerState);
          return;
        }
      }
      this.cardManager.hitDealer();
      playerState = evaluateHands(playerCards, this.dealerHand);
      if(playerState === 'win' || playerState === 'tie'){  // Note: no need to update dealerValue if playerstate is not one of these two condition
                                                           // because in that case playerState = lose and dealer wins, so we just need to proceed to call settle
        dealerValue = calculateHandValue(this.dealerHand);
      }
    }
    this.settle(playerState);
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