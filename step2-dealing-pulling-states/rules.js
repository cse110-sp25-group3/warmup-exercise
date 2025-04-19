// Calculates total value of a hand with correct ace handling
// note: Blackjack rules: face = 10, Ace = 11 or 1
export function calculateHandValue(hand) {
    // todo
    // consider the flowers inequality
}

// Checks if hand is a natural blackjack (exactly 2 cards = 21)
export function isBlackjack(hand) {
    const handValue = calculateHandValue(hand);
    if (hand.length === 2 && handValue ===21){
        return true;
    }
}

// Checks if the hand has exceeded 21.
export function isBust(hand) {
    const handValue = calculateHandValue(hand);
    if(handValue > 21){
        return true;
    }
}

//Determines the game result.
// Use hand value and rules to decide winner
export function evaluateHands(playerHand, dealerHand) {
    if(isBlackjack(playerHand)){ //be careful for the hands get modified after using the calculateHandValue function
        // playey wins
    }
    // what if both player and dealer have blackjack?
    else if(isBust(playerHand)){
        // player lose
    }
    else if(isBust(dealerHand)){
        // player win
    }

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if(playerValue > dealerValue){
        // player wins
    }
    else if(playerValue === dealerValue){
        // ties
    }
    // maybe there are more condition of winning? for example have more than 5 cards?
    else{
        // player lose
    }
}


// should I add the dealer ai here?
/**
export function dealerShouldHit(hand){
    // todo
}
 */
