// Calculates total value of a hand with correct ace handling
// note: Blackjack rules: face = 10, Ace = 11 or 1
export function calculateHandValue(hand) {
    let handValue = 0;
    let aces = 0;

    for(const card of hand){
        const rank = card.rank;

        if(rank === 'A'){
            sum += 11;
            aces += 1;
        } else if (rank === 'K' || rank === 'Q' || rank === 'J') {
            sum += 10;
        } else {
            sum += Number(rank);
        }
    }

    // to adapt the rule that an ace can both be 1 or 11
    while(sum > 21 && aces > 0) {
        aces -= 1;
        sum -= 10; // to replace the value of 11 to 1
    }

    return sum;
}

// Checks if hand is a natural blackjack (exactly 2 cards = 21)
export function isBlackjack(hand) {
    const handValue = calculateHandValue(hand);
    if (hand.length === 2 && handValue ===21){
        return true;
    }
}

// 5 cards charlie rule
export function winByCharlieRule(hand){
    if(hand.length >= 5){
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
