// Function to calculate value of a hand
// Takes in array of card objects
// Returns object containing total value and whether the hand is soft
export function calculateHandValue(hand) {
  let total = 0;
  let aceCount = 0;
  let isSoft = false;

  // First pass 
  // Count all cards except aces
  for (const card of hand) {
    const value = card.rank || card.value;
    if (value === 'A') {
      aceCount++;
    } else if (value === 'K' || value === 'Q' || value === 'J') {
      total += 10;
    } else {
      total += parseInt(value, 10);
    }
  }

  // Second pass
  // Handle aces
  if (aceCount > 0) {
    // First ace can be 11 if it doesn't bust
    if (total + 11 + (aceCount - 1) <= 21) {
      total += 11;
      aceCount--;
      isSoft = true;
    }
    
    // Remaining aces must be 1
    total += aceCount;
  }

  return {total, isSoft};
}

// Function to check if a hand is a pair
// Takes in array of card objects
// Returns a boolean (true if pair)
function isPair(hand) {
  if (hand.length !== 2) {
      return false;
  }
  const value1 = hand[0].rank || hand[0].value;
  const value2 = hand[1].rank || hand[1].value;
  
  // Numerical cards
  if (!isNaN(parseInt(value1)) && !isNaN(parseInt(value2))) {
      return parseInt(value1) === parseInt(value2);
  }
  
  // Face cards
  if (['K', 'Q', 'J', '10'].includes(value1) && ['K', 'Q', 'J', '10'].includes(value2)) {
      return true;
  }
  
  // Other cards
  return value1 === value2;
}

// Function to get dealer upcard
// Takes in dealer's hand
// Returns value of dealer upcard
function getDealerUpcard(dealerHand) {
  const upcard = dealerHand[0];
  const value = upcard.rank || upcard.value;
  if (value === 'A') return 'A';
  if (['K', 'Q', 'J'].includes(value)) {
      return 10;
  }
  return parseInt(value, 10);
}

// Main function to get recommended action
// Takes in player's hand and dealer's hand (and other rules)
// Returns recommended action
export function getRecommendedAction(playerHand, dealerHand, canSplit = true, canDouble = true) {
  const handValue = calculateHandValue(playerHand);
  const dealerUpcard = getDealerUpcard(dealerHand);
  
  // If player has 21 or higher, always stand
  if (handValue.total >= 21) {
      return 'stand';
  }
  
  // Blackjack
  if (handValue.total === 21 && playerHand.length === 2) {
      return 'stand';
  }
  
  // Pairs
  if (playerHand.length === 2 && isPair(playerHand) && canSplit) {
      const pairValue = playerHand[0].rank || playerHand[0].value;
      const pairNum = pairValue === 'A' ? 'A' : 
                      ['K', 'Q', 'J'].includes(pairValue) ? 10 : 
                      parseInt(pairValue, 10);
      
      return getPairRecommendation(pairNum, dealerUpcard);
  }
  
  // Soft totals
  if (handValue.isSoft) {
      return getSoftTotalRecommendation(handValue.total, dealerUpcard, canDouble);
  }
  
  // Hard totals
  return getHardTotalRecommendation(handValue.total, dealerUpcard, canDouble);
}

// Function for recommendations for hard totals
// Takes total, dealer upcard, and can double?
// Returns recommended action
function getHardTotalRecommendation(total, dealerUpcard, canDouble) {
  // Bust
  if (total > 21) return 'bust';
  
  // Hard 17+ always stand
  if (total >= 17) return 'stand';
  
  // Hard 8 or less: always hit
  if (total <= 8) return 'hit';
  
  const hardTotalStrategy = {
      // Hard 9
      9: {
          2: canDouble ? 'double' : 'hit',
          3: canDouble ? 'double' : 'hit',
          4: canDouble ? 'double' : 'hit',
          5: canDouble ? 'double' : 'hit',
          6: canDouble ? 'double' : 'hit',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // Hard 10
      10: {
          2: canDouble ? 'double' : 'hit',
          3: canDouble ? 'double' : 'hit',
          4: canDouble ? 'double' : 'hit',
          5: canDouble ? 'double' : 'hit',
          6: canDouble ? 'double' : 'hit',
          7: canDouble ? 'double' : 'hit',
          8: canDouble ? 'double' : 'hit',
          9: canDouble ? 'double' : 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // Hard 11
      11: {
          2: canDouble ? 'double' : 'hit',
          3: canDouble ? 'double' : 'hit',
          4: canDouble ? 'double' : 'hit',
          5: canDouble ? 'double' : 'hit',
          6: canDouble ? 'double' : 'hit',
          7: canDouble ? 'double' : 'hit',
          8: canDouble ? 'double' : 'hit',
          9: canDouble ? 'double' : 'hit',
          10: canDouble ? 'double' : 'hit',
          'A': 'hit'
      },
      // Hard 12
      12: {
          2: 'hit',
          3: 'hit',
          4: 'stand',
          5: 'stand',
          6: 'stand',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // Hard 13
      13: {
          2: 'stand',
          3: 'stand',
          4: 'stand',
          5: 'stand',
          6: 'stand',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // Hard 14
      14: {
          2: 'stand',
          3: 'stand',
          4: 'stand',
          5: 'stand',
          6: 'stand',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // Hard 15
      15: {
          2: 'stand',
          3: 'stand',
          4: 'stand',
          5: 'stand',
          6: 'stand',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // Hard 16
      16: {
          2: 'stand',
          3: 'stand',
          4: 'stand',
          5: 'stand',
          6: 'stand',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      }
  };
  
  if (hardTotalStrategy[total] && hardTotalStrategy[total][dealerUpcard]) {
      return hardTotalStrategy[total][dealerUpcard];
  }
  
  // Otherwise hit
  return 'hit';
}

// Function for recommendations for soft totals
// Takes total, dealer upcard, and can double?
// Returns recommended action
function getSoftTotalRecommendation(total, dealerUpcard, canDouble) {
  // Soft 21: always stand
  if (total >= 21) return 'stand';
  
  // Soft 20 or 19: always stand
  if (total >= 19) return 'stand';
  
  // Get the non-ace portion of the hand
  const nonAcePortion = total - 11;

  const softTotalStrategy = {
      // A,2
      2: {
          2: 'hit',
          3: 'hit',
          4: 'hit',
          5: canDouble ? 'double' : 'hit',
          6: canDouble ? 'double' : 'hit',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // A,3
      3: {
          2: 'hit',
          3: 'hit',
          4: 'hit',
          5: canDouble ? 'double' : 'hit',
          6: canDouble ? 'double' : 'hit',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // A,4
      4: {
          2: 'hit',
          3: 'hit',
          4: canDouble ? 'double' : 'hit',
          5: canDouble ? 'double' : 'hit',
          6: canDouble ? 'double' : 'hit',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // A,5
      5: {
          2: 'hit',
          3: 'hit',
          4: canDouble ? 'double' : 'hit',        
          5: canDouble ? 'double' : 'hit',
          6: canDouble ? 'double' : 'hit',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // A,6
      6: {
          2: 'hit',
          3: canDouble ? 'double' : 'hit',
          4: canDouble ? 'double' : 'hit',
          5: canDouble ? 'double' : 'hit',
          6: canDouble ? 'double' : 'hit',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // A,7
      7: {
          2: 'stand',
          3: canDouble ? 'double' : 'stand',
          4: canDouble ? 'double' : 'stand',
          5: canDouble ? 'double' : 'stand',
          6: canDouble ? 'double' : 'stand',
          7: 'stand',
          8: 'stand',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // A,8
      8: {
          2: 'stand',
          3: 'stand',
          4: 'stand',
          5: 'stand',
          6: 'stand',
          7: 'stand',
          8: 'stand',
          9: 'stand',
          10: 'stand',
          'A': 'stand'
      },
      // A,9
      9: {
          2: 'stand',
          3: 'stand',
          4: 'stand',
          5: 'stand',
          6: 'stand',
          7: 'stand',
          8: 'stand',
          9: 'stand',
          10: 'stand',
          'A': 'stand'
      }
  };
  
  if (softTotalStrategy[nonAcePortion] && softTotalStrategy[nonAcePortion][dealerUpcard]) {
      return softTotalStrategy[nonAcePortion][dealerUpcard];
  }
  
  // Default recommendations
  if (total >= 19) return 'stand';
  return 'hit';
}

// Function for recommendations for pairs
// Takes pair value and dealer upcard
// Returns recommended action
function getPairRecommendation(pairValue, dealerUpcard) {
  const pairStrategy = {
      // 2s
      2: {
          2: 'split',
          3: 'split',
          4: 'split',
          5: 'split',
          6: 'split',
          7: 'split',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // 3s
      3: {
          2: 'split',
          3: 'split',
          4: 'split',
          5: 'split',
          6: 'split',
          7: 'split',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // 4s
      4: {
          2: 'hit',
          3: 'hit',
          4: 'hit',
          5: 'split',
          6: 'split',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // 5s
      5: {
          2: 'double',
          3: 'double',
          4: 'double',
          5: 'double',
          6: 'double',
          7: 'double',
          8: 'double',
          9: 'double',
          10: 'hit',
          'A': 'hit'
      },
      // 6s
      6: {
          2: 'split',
          3: 'split',
          4: 'split',
          5: 'split',
          6: 'split',
          7: 'hit',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // 7s
      7: {
          2: 'split',
          3: 'split',
          4: 'split',
          5: 'split',
          6: 'split',
          7: 'split',
          8: 'hit',
          9: 'hit',
          10: 'hit',
          'A': 'hit'
      },
      // 8s
      8: {
          2: 'split',
          3: 'split',
          4: 'split',
          5: 'split',
          6: 'split',
          7: 'split',
          8: 'split',
          9: 'split',
          10: 'hit',
          'A': 'hit'
      },
      // 9s
      9: {
          2: 'split',
          3: 'split',
          4: 'split',
          5: 'split',
          6: 'split',
          7: 'stand',
          8: 'split',
          9: 'split',
          10: 'stand',
          'A': 'stand'
      },
      // 10s (including face cards)
      10: {
          2: 'stand',
          3: 'stand',
          4: 'stand',
          5: 'stand',
          6: 'stand',
          7: 'stand',
          8: 'stand',
          9: 'stand',
          10: 'stand',
          'A': 'stand'
      },
      // As
      'A': {
          2: 'split',
          3: 'split',
          4: 'split',
          5: 'split',
          6: 'split',
          7: 'split',
          8: 'split',
          9: 'split',
          10: 'split',
          'A': 'hit'
      }
  };
  
  if (pairStrategy[pairValue] && pairStrategy[pairValue][dealerUpcard]) {
      return pairStrategy[pairValue][dealerUpcard];
  }
  
  // Otherwise default recommendations
  return 'hit';            
}