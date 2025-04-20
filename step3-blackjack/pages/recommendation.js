//function to calculate value of a hand
//takes in array of card objects
//returns object containing total value ad whether the hand is soft
export function calculateHandValue(hand) {
    let total = 0;
    let aceCount = 0;
    let isSoft = false;
  
    //first pass 
    //count all cards except aces
    for (const card of hand) {
      const value = card.value;
      if (value === 'A') {
        aceCount++;
      } else if (value === 'K' || value === 'Q' || value === 'J') {
        total += 10;
      } else {
        total += parseInt(value, 10);
      }
    }
  
    //second pass
    //handle aces
    if (aceCount > 0) {
      //first ace can be 11 if it doesn't bust
      if (total + 11 + (aceCount - 1) <= 21) {
        total += 11;
        aceCount--;
        isSoft = true;
      }
      
      //remaining aces must be 1
      total += aceCount;
    }
  
    return {total,isSoft};
  }
  
  //function to check if a hand is a pair
  //takes in array of card objects
  //returns a boolean (true if pair)
  function isPair(hand) {
    if (hand.length !== 2) {
        return false;
    }
    const value1 = hand[0].value;
    const value2 = hand[1].value;
    
    //numerical cards
    if (!isNaN(parseInt(value1)) && !isNaN(parseInt(value2))) {
        return parseInt(value1) === parseInt(value2);
    }
    
    //face cards
    if (['K', 'Q', 'J', '10'].includes(value1) && ['K', 'Q', 'J', '10'].includes(value2)) {
        return true;
    }
    
    //other cards
    return value1 === value2;
}
  
//function to get dealer upcard
//takes in dealer's hand
//returns value of dealer upcard
function getDealerUpcard(dealerHand) {
    const upcard = dealerHand[0];
    if (upcard.value === 'A') return 'A';
    if (['K', 'Q', 'J'].includes(upcard.value)) {
        return 10;
    }
    return parseInt(upcard.value, 10);
}
  
//main function to get recommended action
//takes in player's hand and dealer's hand (and other rules)
//returns recommended action
export function getRecommendedAction(playerHand, dealerHand, canSplit = true, canDouble = true) {
    const dealerUpcard = getDealerUpcard(dealerHand);
    const { total, isSoft } = calculateHandValue(playerHand);
    
    //blackjack
    if (total === 21 && playerHand.length === 2) {
      return 'stand';
    }
    
    //pairs
    if (playerHand.length === 2 && isPair(playerHand) && canSplit) {
      const pairValue = parseInt(playerHand[0].value, 10) || 
                       (playerHand[0].value === 'A' ? 'A' : 10);
      
      return getPairRecommendation(pairValue, dealerUpcard);
    }
    
    //soft totals
    if (isSoft) {
      return getSoftTotalRecommendation(total, dealerUpcard, canDouble);
    }
    
    //hard totals
    return getHardTotalRecommendation(total, dealerUpcard, canDouble);
}
  
//function for recommendations for hard totals
//takes total, dealer upcard, and can double?
//returns recommended action
function getHardTotalRecommendation(total, dealerUpcard, canDouble) {
    //bust
    if (total > 21) return 'bust';
    
    //hard 8 or less: always hit
    if (total <= 8) return 'hit';
    
    //hard 17 or more: always stand
    if (total >= 17) return 'stand';
    
    const hardTotalStrategy = {
      //hard 9
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
      //hard 10
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
      //hard 11
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
      //hard 12
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
      //hard 13
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
      //hard 14
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
      //hard 15
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
      //hard 16
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
    
    //otherwise hit
    return 'hit';
}
  
//function for recommendations for soft totals
//takes total, dealer upcard, and can double?
//returns recommended action
function getSoftTotalRecommendation(total, dealerUpcard, canDouble) {
    //soft 20 or better: always stand
    if (total >= 20) return 'stand';
    
    //get the non-ace portion of the hand
    const nonAcePortion = total - 11;
  
    const softTotalStrategy = {
      //A,2
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
      //A,3
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
      //A,4
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
      //A,5
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
      //A,6
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
      //A,7
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
      }
    };
    
    if (softTotalStrategy[nonAcePortion] && softTotalStrategy[nonAcePortion][dealerUpcard]) {
      return softTotalStrategy[nonAcePortion][dealerUpcard];
    }
    
    // Default recommendations
    if (total >= 19) return 'stand';
    return 'hit';
}
  
//function for recommendations for pairs
//takes pair value and dealer upcard
//returns recommended action
function getPairRecommendation(pairValue, dealerUpcard) {
    const pairStrategy = {
      //2s
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
      //3s
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
      //4s
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
      //5s
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
      //6s
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
      //7s
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
      //8s
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
      //9s
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
      //As
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
    
    //otherwise default recommendations
    return 'hit';            
}