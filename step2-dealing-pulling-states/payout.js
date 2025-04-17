// payout.js

/**
 * goal: calculates the actual winnings and losses based on 
 * the type of outcome and the amount of money wagered
 */

/**
 * Calculate the settlement amount of the game
 * @param {'win'|'blackjack'|'tie'|'lose'} resultType
 * @param {number} bet player's bet amount
 * @returns {number} the amount the player should eventually add back
 *  ( positive number=a profit, 0 = draw,negative number = loss)
 */
export function calculatePayout(resultType, bet){
    switch (resultType){
      case 'blackjack':
        //Blackjack 3:2 odd
        return Math.floor(bet * 1.5);
      case 'win':
        // 1:1
        return bet;
      case 'tie':
        // return of principal in case of a draw
        return 0;
      case 'lose':
        // loss of principal
        return -bet;
      default:
        throw new Error(`Unknown result type: ${resultType}`);
    }
  }
  