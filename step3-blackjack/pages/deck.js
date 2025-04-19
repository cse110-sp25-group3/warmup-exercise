//build and shuffle deck

const suits = [
    { symbol: '♦', color: 'red',   icon: '../assets/card-suits/diamond.svg' },
    { symbol: '♣', color: 'black', icon: '../assets/card-suits/club.svg'    },
    { symbol: '♥', color: 'red',   icon: '../assets/card-suits/heart.svg'   },
    { symbol: '♠', color: 'black', icon: '../assets/card-suits/spade.svg'   },
];
const values     = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

export function buildDeck(){
    const deck = [];
    suits.forEach(suit => {
    values.forEach(rank => {
    deck.push({ rank, suitSymbol: suit.symbol, color: suit.color, iconUrl: suit.icon });
        });
    });
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    
    }
    return deck;
}
/**
 * Draw a card from the top of the deck.
 */
export function drawCard(deck) {
    return deck.pop();
}

/**
 * calculate the total hand value, treating Aces as 1 or 11.
 */
export function calculateHandValue(hand) {
    let total = 0;
    let aces = 0;
    hand.forEach(card => {
        if (card.rank === 'A') {
            aces++;
            total += 11;
        } else if (['J', 'Q', 'K'].includes(card.rank)) {
            total += 10;
        } else {
            total += parseInt(card.rank, 10);
        }
    });
    //Reduce Ace value from 11 to 1 while bust
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    return total;
}
