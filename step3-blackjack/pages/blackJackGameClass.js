// game.js
import { GameState } from '../../step2-dealing-pulling-states/state.js';
import { calculatePayout } from '../../step2-dealing-pulling-states/payout.js';
import { CardManager } from '../../step2-dealing-pulling-states/player.js';
import {
  evaluateHands,
  isBust,
  calculateHandValue,
  isBlackjack
} from './rules.js';
import { getRecommendedAction } from './recommendation.js';

export class BlackjackGame {
  constructor() {
    this.cardManager = new CardManager(); // Handles deck and hand management
    this.state       = new GameState();
    this.roundOver   = false;
  }

  /**
   * Allow the UI to call placeBet directly
   */
  placeBet(amount) {
    return this.state.placeBet(amount);
  }

  /**
   * initialize the round: shuffle and deal cards
   */
  startRound() {
    this.cardManager.resetGame();
    this.cardManager.initialDeal();
    this.roundOver = false;
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
   * Helper function for playerStand to execute repeating code
   */
  executeDealerHitAndSettle(playerCards) {
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
    let playerState   = evaluateHands(playerCards, this.dealerHand);
    let dealerValue   = calculateHandValue(this.dealerHand);

    while (!isBust(this.dealerHand) && (playerState === 'win' || playerState === 'tie')) {
      if (playerState === 'tie') {
        if (isBlackjack(playerCards)) {
          this.settle('tie');
          return;
        }
        if (dealerValue === 17 && this.dealerHand.some(card => card.rank === 'A')) {
          this.executeDealerHitAndSettle(playerCards);
          return;
        }
        if (dealerValue < 17) {
          this.executeDealerHitAndSettle(playerCards);
          return;
        }
        if (dealerValue > 17) {
          playerState = evaluateHands(playerCards, this.dealerHand);
          this.settle(playerState);
          return;
        }
      }
      this.cardManager.hitDealer();
      playerState = evaluateHands(playerCards, this.dealerHand);
      if (playerState === 'win' || playerState === 'tie') {
        dealerValue = calculateHandValue(this.dealerHand);
      }
    }

    this.settle(playerState);
  }

  /**
   * player uses double down
   */
  playerDoubleDown() {
    // TODO: Implement doubling bet and dealing one more card
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
  settle(resultType) {
    const payout = calculatePayout(resultType, this.state.currentBet);
    this.state.updateMoney(payout);
    this.roundOver = true;
    // TODO: Notify frontend of result
  }

  /**
   * get recommended action from recommendation.js
   */
  getRecommendedAction() {
    // TODO: Call recommendation logic and return hint (e.g., 'hit', 'stand')
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
