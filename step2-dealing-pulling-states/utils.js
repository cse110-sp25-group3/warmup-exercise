export function calculateHandValue(hand) {
    let total = 0;
    let aceCount = 0;

    for (const card of hand) {
        let value;
        if (typeof card.rank !== 'undefined') {
            value = card.rank; // Use rank if available (from deck.js)
        } else if (typeof card.value !== 'undefined') {
            value = card.value; // Or value if available (from step 3)
        } else {
            continue; // Skip card if no value
        }

        if (value === 'A') {
            aceCount++;
            total += 11;
        } else if (['K', 'Q', 'J'].includes(value)) {
            total += 10;
        } else {
            total += parseInt(value, 10);
        }
    }

    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return total;
}