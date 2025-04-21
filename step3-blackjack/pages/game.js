// Import the necessary functions and classes
import { BlackjackGame } from './blackJackGameClass.js';
import { calculateHandValue } from './rules.js';
import { getRecommendedAction } from './recommendation.js';

const game = new BlackjackGame();

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- DOM cache ---------- */
  const dealerDiv = document.querySelector('.dealer-section .cards-container');
  const playerDiv = document.querySelector('.player-section .cards-container');
  const chipBtns = document.querySelectorAll('.betting-chip');
  const betDisplay = document.querySelector('.current-bet');
  const balanceLbl = document.querySelector('.balance-info .info-value');
  const resetBtn = document.getElementById('btn-reset') || document.querySelector('.bet-button');
  const betBtn = document.getElementById('btn-bet') || document.querySelectorAll('.bet-button')[1];
  const actionBtns = document.querySelectorAll('.action-button');
  const backBtn = document.querySelector('.back-button');
  const scoreBox = document.querySelector('.score-display');
  const hintBtn = document.querySelector('.hint-button'); // Hint button reference
  const hintBubble = document.querySelector('.hint-bubble'); // Hint bubble reference

  /* ---------- local state ---------- */
  let currentBet = 0;
  let betFinalized = false;
  let hintsEnabled = localStorage.getItem('hintsEnabled') === 'true' || false;
  balanceLbl.textContent = `$${game.state.money}`;

  /* ---------- helpers ---------- */
  const SUIT_MAP = { Clubs: '♣', Diamonds: '♦', Hearts: '♥', Spades: '♠' };
  const isRed = s => s === '♥' || s === '♦';

  function cardInner({ rank, suit }) {
    const sym = SUIT_MAP[suit] || suit;
    const clr = isRed(sym) ? 'red' : 'black';
    return `
      <div class="card-corner ${clr}">
        <span class="card-value">${rank}</span><span class="card-suit">${sym}</span>
      </div>
      <div class="card-center ${clr}">${sym}</div>
      <div class="card-corner-bottom ${clr}">
        <span class="card-value">${rank}</span><span class="card-suit">${sym}</span>
      </div>`;
  }

  function renderHands() {
    dealerDiv.innerHTML = '';
    playerDiv.innerHTML = '';

    game.dealerHand.forEach((card, i) => {
      const wrap = document.createElement('div');
      // hide dealer's hole card until roundOver
      if (i === 1 && !game.roundOver) {
        wrap.className = 'card card-back';
        wrap.innerHTML = '<div class="card-pattern">♦</div>';
        dealerDiv.appendChild(wrap);
        return;
      }
      // otherwise show face
      wrap.className = `card card-front ${isRed(SUIT_MAP[card.suit] || card.suit) ? 'red' : 'black'}`;
      wrap.innerHTML = cardInner(card);
      dealerDiv.appendChild(wrap);
    });

    game.playerHand.forEach(card => {
      const wrap = document.createElement('div');
      wrap.className = `card card-front ${isRed(SUIT_MAP[card.suit] || card.suit) ? 'red' : 'black'}`;
      wrap.innerHTML = cardInner(card);
      playerDiv.appendChild(wrap);
    });
  }

  function updateScore() {
    const handValue = calculateHandValue(game.playerHand);
    scoreBox.textContent = handValue;
  }

  function handleRoundOver() {
    // reveal dealer hole card & final score
    renderHands();
    updateScore();

    const result = game.lastResult.toUpperCase();
    alert(`Round over: ${result}`);

    // update balance display
    balanceLbl.textContent = `$${game.state.money}`;

    // reset bets so user can start next round
    betFinalized = false;
    currentBet = 0;
    betDisplay.textContent = 'CURRENT BET: $0';

    // Hide hint bubble when round is over
    hideHint();
  }

  /* ---------- recommendation system ---------- */
  function updateHint() {
    console.log("updateHint called, hintsEnabled:", hintsEnabled, "betFinalized:", betFinalized, "game.roundOver:", game.roundOver);

    // Check if hints are enabled in localStorage (in case it was updated in settings)
    hintsEnabled = localStorage.getItem('hintsEnabled') === 'true';
    
    // Update hint button UI
    if (hintBtn) {
      hintBtn.classList.toggle('active', hintsEnabled);
    }

    // Hide the hint if we shouldn't show it
    if (!hintsEnabled || !betFinalized || game.roundOver) {
      hideHint();
      return;
    }

    // Make sure we have enough cards to make a recommendation
    if (game.playerHand.length < 2 || game.dealerHand.length < 1) {
      console.log("Not enough cards for recommendation");
      hideHint();
      return;
    }

    // Get player hand value
    const playerHandValue = calculateHandValue(game.playerHand);
    console.log("Player hand value:", playerHandValue);

    // Always stand on 21 or higher - no need to call recommendation system
    if (playerHandValue >= 21) {
      console.log("Player has 21 or higher, recommending stand");
      showHint('stand');
      return;
    }

    // Get recommendation based on current game state
    const dealerUpcard = game.dealerHand[0];
    console.log("Getting recommendation for player hand:", game.playerHand, "dealer upcard:", dealerUpcard);
    const recommendedAction = getRecommendedAction(game.playerHand, [dealerUpcard]);
    console.log("Recommended action:", recommendedAction);

    // Check if the recommended action is still valid based on current game state
    // For example, can't double after hitting (when you have more than 2 cards)
    if (recommendedAction === 'double' && game.playerHand.length > 2) {
      // If doubling down isn't valid, fallback to hit or stand recommendation
      const fallbackAction = playerHandValue < 17 ? 'hit' : 'stand';
      console.log("Falling back to", fallbackAction, "because can't double with", game.playerHand.length, "cards");
      showHint(fallbackAction);
    } else {
      showHint(recommendedAction);
    }
  }

  function showHint(action) {
    if (!hintBubble) {
      console.log("No hint bubble found");
      return;
    }

    console.log("Showing hint for action:", action);

    // Check if recommendation has changed
    const currentText = hintBubble.textContent;
    const newText = getActionText(action);
    const recommendationChanged = currentText !== newText;
    console.log("Current text:", currentText, "New text:", newText, "Changed:", recommendationChanged);

    // Update the hint text
    hintBubble.textContent = newText;
    hintBubble.classList.remove('hidden');

    // Animate the bubble if recommendation has changed
    if (recommendationChanged && !hintBubble.classList.contains('hidden')) {
      // Remove animation class if it exists
      hintBubble.classList.remove('hint-update');

      // Force reflow to restart animation
      void hintBubble.offsetWidth;

      // Add animation class
      hintBubble.classList.add('hint-update');
    }

    // Highlight the recommended button
    actionBtns.forEach(btn => {
      if (btn.dataset.action === action) {
        btn.classList.add('recommended');

        // If recommendation changed, animate the button highlight
        if (recommendationChanged) {
          btn.classList.remove('recommend-flash');
          void btn.offsetWidth; // Force reflow to restart animation
          btn.classList.add('recommend-flash');
        }
      } else {
        btn.classList.remove('recommended');
        btn.classList.remove('recommend-flash');
      }
    });
  }

  function hideHint() {
    if (!hintBubble) return;
    hintBubble.classList.add('hidden');

    // Remove highlighting from all buttons
    actionBtns.forEach(btn => {
      btn.classList.remove('recommended');
    });
  }

  function getActionText(action) {
    switch (action) {
      case 'hit': return 'HIT recommended';
      case 'stand': return 'STAND recommended';
      case 'double': return 'DOUBLE recommended';
      case 'split': return 'SPLIT recommended (not available)';
      default: return 'Play your best move';
    }
  }

  function toggleHints() {
    hintsEnabled = !hintsEnabled;
    localStorage.setItem('hintsEnabled', hintsEnabled);

    // Update UI to show hint state
    hintBtn.classList.toggle('active', hintsEnabled);

    // Update the hint display
    if (hintsEnabled) {
      updateHint();
    } else {
      hideHint();
    }
  }

  // Function to update hint setting from the settings modal
  window.updateHintSetting = function(enabled) {
    hintsEnabled = enabled;
    
    // Update UI to show hint state
    if (hintBtn) {
      hintBtn.classList.toggle('active', hintsEnabled);
    }
    
    // Update the hint display
    if (hintsEnabled && betFinalized && !game.roundOver) {
      updateHint();
    } else {
      hideHint();
    }
  };

  /* ---------- initialization ---------- */
  // Set initial hint button state
  if (hintBtn) {
    hintBtn.classList.toggle('active', hintsEnabled);
    hintBtn.addEventListener('click', toggleHints);
  }

  /* ---------- chip selection ---------- */
  chipBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      if (betFinalized) return;
      currentBet += +btn.dataset.value;
      betDisplay.textContent = `CURRENT BET: $${currentBet}`;
      btn.classList.add('selected');
      setTimeout(() => btn.classList.remove('selected'), 120);
    })
  );

  /* ---------- reset bet ---------- */
  resetBtn.addEventListener('click', () => {
    if (betFinalized) return;
    currentBet = 0;
    betDisplay.textContent = 'CURRENT BET: $0';
  });

  /* ---------- place bet & deal ---------- */
  betBtn.addEventListener('click', () => {
    if (betFinalized || currentBet === 0) return;
    if (!game.placeBet(currentBet)) {
      alert('Invalid bet or insufficient balance.');
      return;
    }
    balanceLbl.textContent = `$${game.state.money}`;
    betFinalized = true;

    game.startRound();
    renderHands();
    updateScore();

    // Add a delay before showing the hint to let the cards render first
    setTimeout(() => {
      updateHint();
    }, 500);

    // immediate blackjack / push?
    if (game.roundOver) {
      handleRoundOver();
    }
  });

  /* ---------- player actions ---------- */
  actionBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      if (!betFinalized || game.roundOver) return;
      const action = btn.dataset.action;

      if (action === 'hit') {
        // Don't allow hitting on 21 or higher
        const currentValue = calculateHandValue(game.playerHand);
        if (currentValue >= 21) {
          alert("You already have 21! Choose STAND instead.");
          return;
        }
        
        game.playerHit();
        renderHands();
        updateScore();

        // Only update hint if the round isn't over after hitting
        if (!game.roundOver) {
          setTimeout(() => updateHint(), 300); // Delay to allow animation to complete
        }
      }
      else if (action === 'stand') {
        game.playerStand();
        renderHands();
        updateScore();
      }
      else if (action === 'double') {
        // Don't allow doubling on 21 or higher
        const currentValue = calculateHandValue(game.playerHand);
        if (currentValue >= 21) {
          alert("You already have 21! Choose STAND instead.");
          return;
        }
        
        game.playerDoubleDown();
        renderHands();
        updateScore();
      }

      if (game.roundOver) {
        handleRoundOver();
      }
    })
  );

  /* ---------- back‑button feedback ---------- */
  backBtn.addEventListener('click', function () {
    this.style.opacity = 0.7;
    setTimeout(() => (this.style.opacity = 1), 150);
  });
});
