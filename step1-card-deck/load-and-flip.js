document.addEventListener('DOMContentLoaded', function() {
    const suits = [
        { name: 'Diamonds', symbol: '♦', color: 'red', icon: '../assets/card-suits/diamond.svg' },
        { name: 'Clubs', symbol: '♣', color: 'black', icon: '../assets/card-suits/club.svg' },
        { name: 'Hearts', symbol: '♥', color: 'red', icon: '../assets/card-suits/heart.svg' },
        { name: 'Spades', symbol: '♠', color: 'black', icon: '../assets/card-suits/spade.svg' },
    ];
    
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cardBackUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-back-gBwuRkY9Va4jIyQCHRy18Xs9Tfog38.svg';
    
    const container = document.getElementById('cards-container');
    
    // Generate cards for each suit
    suits.forEach(suit => {

        // Create suit row
        const suitRow = document.createElement('div');
        suitRow.className = 'suit-row';
        
        // Create suit title
        const suitTitle = document.createElement('h2');
        suitTitle.className = 'suit-title';
        
        // Add suit icon
        const suitIcon = document.createElement('img');
        suitIcon.src = suit.icon;
        suitIcon.alt = suit.name;
        suitIcon.className = 'suit-icon';
        
        suitTitle.appendChild(suitIcon);
        suitTitle.appendChild(document.createTextNode(suit.name));
        suitRow.appendChild(suitTitle);
        
        // Create cards grid for this suit
        const cardsGrid = document.createElement('div');
        cardsGrid.className = 'cards-grid';
        
        // Generate cards for this suit
        values.forEach(value => {

            // Create card container
            const card = document.createElement('div');
            card.className = 'card';
            
            // Create card inner container (for flip animation)
            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';
            
            // Create card front
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            
            // Top value
            const topValue = document.createElement('div');
            topValue.className = `card-value ${suit.color}`;
            topValue.textContent = value;
            
            // Small suit icon
            const smallSuit = document.createElement('img');
            smallSuit.src = suit.icon;
            smallSuit.alt = suit.symbol;
            smallSuit.className = 'small-suit';
            
            topValue.appendChild(smallSuit);
            cardFront.appendChild(topValue);
            
            // Center suit
            const centerSuit = document.createElement('div');
            centerSuit.className = 'center-suit';
            
            const centerSuitImg = document.createElement('img');
            centerSuitImg.src = suit.icon;
            centerSuitImg.alt = suit.symbol;
            
            centerSuit.appendChild(centerSuitImg);
            cardFront.appendChild(centerSuit);
            
            // Bottom value (rotated)
            const bottomValue = document.createElement('div');
            bottomValue.className = `card-value bottom-value ${suit.color}`;
            bottomValue.textContent = value;
            
            const bottomSmallSuit = document.createElement('img');
            bottomSmallSuit.src = suit.icon;
            bottomSmallSuit.alt = suit.symbol;
            bottomSmallSuit.className = 'small-suit';
            
            bottomValue.appendChild(bottomSmallSuit);
            cardFront.appendChild(bottomValue);
            
            // Create card back
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            
            const cardBackImg = document.createElement('img');
            cardBackImg.src = cardBackUrl;
            cardBackImg.alt = 'Card Back';
            
            cardBack.appendChild(cardBackImg);
            
            // Assemble card
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            
            // Add click event to flip card
            card.addEventListener('click', function() {
                this.classList.toggle('flipped');
            });
            
            // Add card to grid
            cardsGrid.appendChild(card);
        });
        
        // Add cards grid to suit row
        suitRow.appendChild(cardsGrid);
        
        // Add suit row to container
        container.appendChild(suitRow);
    });
});