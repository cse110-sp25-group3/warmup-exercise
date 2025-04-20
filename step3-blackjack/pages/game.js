import { BlackjackGame }      from './blackJackGameClass.js';
import { calculateHandValue } from './rules.js';     // hand‑value helper

const game = new BlackjackGame();

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- DOM cache ---------- */
  const dealerDiv   = document.querySelector('.dealer-section .cards-container');
  const playerDiv   = document.querySelector('.player-section .cards-container');
  const chipBtns    = document.querySelectorAll('.betting-chip');
  const betDisplay  = document.querySelector('.current-bet');
  const balanceLbl  = document.querySelector('.balance-info .info-value');
  const resetBtn    = document.getElementById('btn-reset')  || document.querySelector('.bet-button');
  const betBtn      = document.getElementById('btn-bet')    || document.querySelectorAll('.bet-button')[1];
  const actionBtns  = document.querySelectorAll('.action-button');
  const backBtn     = document.querySelector('.back-button');
  const scoreBox    = document.querySelector('.score-display');

  /* ---------- state ---------- */
  let currentBet   = 0;
  let betFinalized = false;
  balanceLbl.textContent = `$${game.state.money}`;

  /* ---------- suit → symbol helper ---------- */
  const SUIT_MAP = { Clubs:'♣', Diamonds:'♦', Hearts:'♥', Spades:'♠' };
  const isRed    = s => s === '♥' || s === '♦';

  /* ---------- build inner HTML for a face‑up card ---------- */
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

  /* ---------- draw & flip both hands ---------- */
  function renderHands() {
    dealerDiv.innerHTML = '';
    playerDiv.innerHTML = '';

    const render = (card, where) => {
      const wrap = document.createElement('div');
      wrap.className = 'card card-back';
      wrap.innerHTML = '<div class="card-pattern">♦</div>';     // back design
      where.appendChild(wrap);
      requestAnimationFrame(() => {
        const sym = SUIT_MAP[card.suit] || card.suit;
        wrap.className = `card card-front ${isRed(sym)?'red':'black'}`;
        wrap.innerHTML = cardInner(card);
      });
    };

    game.dealerHand.forEach(c => render(c, dealerDiv));
    game.playerHand.forEach(c => render(c, playerDiv));
  }

  /* ---------- update score box ---------- */
  function updateScore() {
    scoreBox.textContent = calculateHandValue(game.playerHand);
  }

  /* ---------- chip clicks ---------- */
  chipBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      if (betFinalized) return;
      currentBet += +btn.dataset.value;
      betDisplay.textContent = `CURRENT BET: $${currentBet}`;
      btn.classList.add('selected');
      setTimeout(() => btn.classList.remove('selected'), 120);
    })
  );

  /* ---------- RESET ---------- */
  resetBtn.addEventListener('click', () => {
    if (betFinalized) return;
    currentBet = 0;
    betDisplay.textContent = 'CURRENT BET: $0';
  });

  /* ---------- BET ---------- */
  betBtn.addEventListener('click', () => {
    if (betFinalized || currentBet === 0) return;

    if (!game.placeBet(currentBet)) {
      alert('Invalid bet or insufficient balance.');
      return;
    }

    balanceLbl.textContent = `$${game.state.money}`;
    betFinalized = true;

    game.startRound();   // shuffle & deal
    renderHands();
    updateScore();
  });

  /* ---------- HIT / STAND / DOUBLE ---------- */
  actionBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      if (!betFinalized) return;
      const action = btn.dataset.action;
      if      (action === 'hit')    game.cardManager.hitPlayer();
      else if (action === 'stand')  game.playerStand();
      else if (action === 'double') game.playerDoubleDown?.();
      renderHands();
      updateScore();
    })
  );

  /* ---------- Back‑button visual feedback ---------- */
  backBtn.addEventListener('click', function () {
    this.style.opacity = 0.7;
    setTimeout(() => (this.style.opacity = 1), 150);
  });
});