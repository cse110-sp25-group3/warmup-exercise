// Wait for the DOM to be fully loaded


document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bettingChips = document.querySelectorAll('.betting-chip');
    const currentBetDisplay = document.querySelector('.current-bet');
    const actionButtons = document.querySelectorAll('.action-button');
    const backButton = document.querySelector('.back-button');


    // 1) your card data
    const suits = [
        { symbol: '♦', color: 'red',   icon: '../assets/card-suits/diamond.svg' },
        { symbol: '♣', color: 'black', icon: '../assets/card-suits/club.svg'    },
        { symbol: '♥', color: 'red',   icon: '../assets/card-suits/heart.svg'   },
        { symbol: '♠', color: 'black', icon: '../assets/card-suits/spade.svg'   },
    ];
    const values     = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const cardBackUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-back-gBwuRkY9Va4jIyQCHRy18Xs9Tfog38.svg';

    // 2) build & shuffle a deck
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

    // 3) grab your existing player container + action buttons
    const playerContainer = document.querySelector('.player-section .cards-container');

    // 4) helper: create a face‑down card element
    function drawCardElement(cardData) {
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

    // 5) helper: flip that same element to face‑up
    function flipCard(card) {
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

      
    
    // Simple UI interaction for betting chips
    bettingChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Get chip value
            const chipValue = this.dataset.value;
            
            // Update current bet display
            currentBetDisplay.textContent = `CURRENT BET: $${chipValue}`;
            
            // Visual feedback - highlight selected chip
            bettingChips.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Simple UI interaction for action buttons
    function calculatePlayerSum() {
        let sum = 0, aces = 0;
      
        // grab every .card in the player hand
        const cards = playerContainer.querySelectorAll('.card');
        cards.forEach(cardEl => {
          // 1) if this card was created by drawCardElement(), use its stash
          let rank, isDynamic = false;
          if (cardEl._cardData) {
            rank = cardEl._cardData.rank;
            isDynamic = true;
          } else {
            // 2) otherwise it must be one of your initial .card-front elements:
            //    find the first .card-value inside it
            const valEl = cardEl.querySelector('.card-value');
            if (!valEl) return;                // no rank found? skip it
            rank = valEl.textContent.trim();   // eg "10", "Q", ...
          }
      
          // 3) now tally it up
          if (rank === 'A') {
            sum  += 11;
            aces += 1;
          }
          else if (['J','Q','K'].includes(rank)) {
            sum += 10;
          }
          else {
            sum += parseInt(rank, 10);
          }
        });
      
        // 4) downgrade aces from 11→1 if bust
        while (sum > 21 && aces > 0) {
          sum  -= 10;
          aces -= 1;
        }
        return sum;
      }
      
      function updatePlayerScore() {
        document.querySelector('.score-display').textContent = calculatePlayerSum();
      }

    // handlers for action buttons 
    function handleHit() {
        if (deck.length === 0) return alert('No more cards!');
        const cardData = deck.pop();
        const cardEl   = drawCardElement(cardData);
        playerContainer.appendChild(cardEl);
    
        // flip once slide‑in finishes (0.4s in CSS)
        cardEl.addEventListener('animationend', () => flipCard(cardEl), { once: true });

        updatePlayerScore();
      }
      

    function handleStand() {
        // e.g. run dealer AI, compare totals, resolve round…
        console.log('STAND logic here');
    }

    function handleDouble() {
        // e.g. double bet, draw one card, then auto‑stand…
        console.log('DOUBLE logic here');
    }

    // mapping buttons to handlers
    const handlers = {
        hit:    handleHit,
        stand:  handleStand,
        double: handleDouble,
    };

    actionButtons.forEach(btn => {
        const action = btn.dataset.action;
        const fn     = handlers[action];
        if (!fn) return;
        btn.addEventListener('click', () => fn());
    });


    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Visual feedback
            this.style.opacity = '0.8';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
            
            // Log the action (for demonstration)
            console.log(`${this.textContent} button clicked`);
        });
    });
    
    // Back button interaction
    backButton.addEventListener('click', function() {
        console.log('Back button clicked');
        // Visual feedback
        this.style.opacity = '0.8';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 200);
    });
});