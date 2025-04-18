import { Deck } from './deck.js';
import { GameState } from './state.js';
import { calculatePayout } from './payout.js';
import { calculateHandValue } from './utils.js';

export class BlackjackGame {

  constructor() {
    this.deck = new Deck();
    this.state = new GameState();
    this.playerHand = [];
    this.dealerHand = [];
    this.roundOver = false;
    this.playerHasBlackjack = false;
    this.dealerHasBlackjack = false;
  }

  /**
   * initialize the round: shuffle and deal cards
   */
  startRound() {
    this.deck.reset();
    this.deck.shuffle();
    this.playerHand = this.deck.dealMultiple(2);
    this.dealerHand = this.deck.dealMultiple(2);
    this.roundOver = false;
    this.playerHasBlackjack = this.checkBlackjack(this.playerHand);
    this.dealerHasBlackjack = this.checkBlackjack(this.dealerHand);
  }

  /**
   * Player requests another card
   */
  playerHit() {
    const card = this.deck.dealCard();
    if (card) this.playerHand.push(card);
    // TODO: Check bust using rules.js
    if (this.isBust(this.playerHand)) {
      this.endRound('lose');
    }
  }

  /**
   * player ends turn, dealer starts
   */
  playerStand() {
    // TODO: Implement dealer logic (draw to 17, hit soft 17)
    // TODO: Compare hands and determine result
    // TODO: Call settle() with resultType
    this.dealerPlay();
    this.determineWinner();
  }

  /**
   * player uses double down
   */
  playerDoubleDown() {
    // TODO: Implement doubling bet and dealing one more card
    if (this.state.placeBet(this.state.currentBet)) {
      this.playerHit();
      if (!this.roundOver) {
        this.dealerPlay();
        this.determineWinner();
      }
    }
  }

  /**
   * Player chooses to surrender
   */
  playerSurrender() {
    // TODO: Forfeit half bet and end round
    this.endRound('surrender');
  }

  /**
   * Player splits hand
   */
  playerSplit() {
    // TODO: Handle splitting hand logic
  }

  /**
   * Dealer's turn logic
   */
  dealerPlay() {
    while (calculateHandValue(this.dealerHand) < 17) {
      const card = this.deck.dealCard();
      if (card) this.dealerHand.push(card);
      if (this.isBust(this.dealerHand)) {
        this.endRound('win');
        return;
      }
    }
  }

  /**
   * Determine the winner of the round
   */
  determineWinner() {
    if (this.roundOver) return;
    const playerTotal = calculateHandValue(this.playerHand);
    const dealerTotal = calculateHandValue(this.dealerHand);

    if (this.playerHasBlackjack && this.dealerHasBlackjack) {
      this.endRound('tie');
    } else if (this.playerHasBlackjack) {
      this.endRound('blackjack');
    } else if (this.dealerHasBlackjack) {
      this.endRound('lose');
    } else if (playerTotal > 21) {
      this.endRound('lose');
    } else if (dealerTotal > 21) {
      this.endRound('win');
    } else if (playerTotal > dealerTotal) {
      this.endRound('win');
    } else if (playerTotal < dealerTotal) {
      this.endRound('lose');
    } else {
      this.endRound('tie');
    }
  }

  /**
   * Apply game result and adjust player's balance
   * @param {'win'|'blackjack'|'tie'|'lose'|'surrender'} resultType
   */
  endRound(resultType) {
    if (resultType === 'surrender') {
      this.state.updateMoney(Math.floor(this.state.currentBet / 2) * -1);
    } else {
      const payout = calculatePayout(resultType, this.state.currentBet);
      this.state.updateMoney(payout);
    }

    this.roundOver = true;
    //TODO: Notify frontend of result
    console.log(`Round ended with result: ${resultType}`);
  }

  /**
   * Check if a hand is bust
   * @param {Array} hand
   * @returns {boolean}
   */
  isBust(hand) {
    return calculateHandValue(hand) > 21;
  }

  /**
   * Check if a hand is Blackjack
   * @param {Array} hand
   * @returns {boolean}
   */
  checkBlackjack(hand) {
    return hand.length === 2 && calculateHandValue(hand) === 21;
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

