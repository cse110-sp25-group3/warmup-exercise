// step3-blackjack/blackJackGameClass.js
import { GameState } from "../../step2-dealing-pulling-states/state.js";
import { calculatePayout } from "../../step2-dealing-pulling-states/payout.js";
import { CardManager } from "../../step2-dealing-pulling-states/player.js";
import {
  evaluateHands,
  isBust,
  calculateHandValue,
  isBlackjack,
} from "./rules.js";
import { getRecommendedAction } from "./recommendation.js";

export class BlackjackGame {
  constructor() {
    this.cardManager = new CardManager();
    this.state = new GameState();
    this.roundOver = false;
    this.lastResult = null; // 'win' | 'lose' | 'tie' | 'blackjack'
  }

  placeBet(amount) {
    return this.state.placeBet(amount);
  }

  startRound() {
    this.roundOver = false;
    this.lastResult = null;
    this.cardManager.resetGame();
    this.cardManager.initialDeal();

    // immediate natural-blackjack check
    const playerBJ = isBlackjack(this.playerHand);
    const dealerBJ = isBlackjack(this.dealerHand);
    if (playerBJ || dealerBJ) {
      let outcome;
      if (playerBJ && dealerBJ) outcome = "tie";
      else if (playerBJ) outcome = "blackjack";
      else outcome = "lose";
      this.settle(outcome);
    }
  }

  get playerHand() {
    return this.cardManager.getHands().player;
  }

  get dealerHand() {
    return this.cardManager.getHands().dealer;
  }

  /**
   * Player hits once, then we check for bust and auto‑settle.
   */
  playerHit() {
    if (this.roundOver) return;
    this.cardManager.hitPlayer();
    if (isBust(this.playerHand)) {
      this.settle("lose");
    }
  }

  /**
   * Player stands: dealer reveals hole, draws to (soft) 17, then settle.
   */
  playerStand() {
    if (this.roundOver) return;

    // If player already busted (e.g. via direct cardManager.hitPlayer), bail out.
    if (isBust(this.playerHand)) {
      this.settle("lose");
      return;
    }

    // Dealer hits on <17 or soft‑17
    const dealerShouldHit = (hand) => {
      const value = calculateHandValue(hand);
      const hasA = hand.some((c) => c.rank === "A");
      return value < 17 || (value === 17 && hasA);
    };

    while (!isBust(this.dealerHand) && dealerShouldHit(this.dealerHand)) {
      this.cardManager.hitDealer();
    }

    const outcome = evaluateHands(this.playerHand, this.dealerHand);
    this.settle(outcome);
  }

  /**
   * Double down: double your bet, deal exactly one more card, then stand.
   */
  playerDoubleDown() {
    if (this.roundOver) return;
    if (this.playerHand.length !== 2)
      throw new Error("Can only double on first two cards.");

    const currentBet = this.state.currentBet;
    if (!this.state.placeBet(currentBet)) {
      throw new Error("Insufficient funds to double down.");
    }
    this.state.currentBet = 2 * this.state.currentBet;

    this.cardManager.hitPlayer();
    // whether or not you bust, we immediately go to dealer
    this.playerStand();
  }

  /**
   * Splitting is not implemented yet.
   */
  playerSplit() {
    throw new Error("Split is not implemented yet.");
  }

  /**
   * Finalize the round, adjust money, and record the result.
   */
  settle(resultType) {
    if (this.roundOver) return;
    this.lastResult = resultType;
    const payout = calculatePayout(resultType, this.state.currentBet);
    this.state.updateMoney(payout);
    this.roundOver = true;
  }

  /**
   * Hook up your basic‑strategy advisor.
   */
  getRecommendedAction() {
    // Dealer’s up‑card is dealerHand[0]
    return getRecommendedAction(this.playerHand, this.dealerHand[0]);
  }
}
