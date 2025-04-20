// step3-blackjack/game.js
import { BlackjackGame }      from './blackJackGameClass.js';
import { calculateHandValue } from './rules.js';

const game = new BlackjackGame();

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- DOM cache ---------- */
  const dealerDiv  = document.querySelector('.dealer-section .cards-container');
  const playerDiv  = document.querySelector('.player-section .cards-container');
  const chipBtns   = document.querySelectorAll('.betting-chip');
  const betDisplay = document.querySelector('.current-bet');
  const balanceLbl = document.querySelector('.balance-info .info-value');
  const resetBtn   = document.getElementById('btn-reset') || document.querySelector('.bet-button');
  const betBtn     = document.getElementById('btn-bet')   || document.querySelectorAll('.bet-button')[1];
  const actionBtns = document.querySelectorAll('.action-button');
  const backBtn    = document.querySelector('.back-button');
  const scoreBox   = document.querySelector('.score-display');

  /* ---------- local state ---------- */
  let currentBet   = 0;
  let betFinalized = false;
  balanceLbl.textContent = `$${game.state.money}`;

  /* ---------- helpers ---------- */
  const SUIT_MAP = { Clubs:'♣', Diamonds:'♦', Hearts:'♥', Spades:'♠' };
  const isRed    = s => s === '♥' || s === '♦';

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
        wrap.className  = 'card card-back';
        wrap.innerHTML  = '<div class="card-pattern">♦</div>';
        dealerDiv.appendChild(wrap);
        return;
      }
      // otherwise show face
      wrap.className = `card card-front ${isRed(SUIT_MAP[card.suit]||card.suit)?'red':'black'}`;
      wrap.innerHTML = cardInner(card);
      dealerDiv.appendChild(wrap);
    });

    game.playerHand.forEach(card => {
      const wrap = document.createElement('div');
      wrap.className = `card card-front ${isRed(SUIT_MAP[card.suit]||card.suit)?'red':'black'}`;
      wrap.innerHTML = cardInner(card);
      playerDiv.appendChild(wrap);
    });
  }

  function updateScore() {
    scoreBox.textContent = calculateHandValue(game.playerHand);
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

      if      (action === 'hit')    game.playerHit();
      else if (action === 'stand')  game.playerStand();
      else if (action === 'double') game.playerDoubleDown();

      renderHands();
      updateScore();

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
