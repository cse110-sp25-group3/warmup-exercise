//drawing the card facedown (just the back, no value)
export function cardSlideIn(cardData) {
    const card = document.createElement('div');
    card.className = 'card card-back slide-in';
    const pattern = document.createElement('div');
    pattern.className = 'card-pattern';
    pattern.textContent = cardData.suitSymbol;
    card.appendChild(pattern);
    // stash the data for flip
    card._cardData = cardData;
    return card;
}

//flipping card
export function flipCard(card) {
    const { rank, suitSymbol, color } = card._cardData;
    card.innerHTML = '';                 // clear the back
    card.className = 'card card-front';  // switch classes

    // top corner
    const top = document.createElement('div');
    top.className = `card-corner ${color}`;
    top.innerHTML = `
    <div class="card-value">${rank}</div>
    <div class="card-suit">${suitSymbol}</div>
    `;
    card.appendChild(top);

    // center pip
    const center = document.createElement('div');
    center.className = `card-center ${color}`;
    center.textContent = suitSymbol;
    card.appendChild(center);

    // bottom corner (rotated)
    const bottom = document.createElement('div');
    bottom.className = `card-corner-bottom ${color}`;
    bottom.innerHTML = `
    <div class="card-value">${rank}</div>
    <div class="card-suit">${suitSymbol}</div>
    `;
    card.appendChild(bottom);
}