// Wait for the DOM to be fully loaded
/**
 * Todo import other classes
 */

import { buildDeck } from './deck.js';

let selectedBetAmount = 0;
//const overlay = document.getElementById('overlay');



document.addEventListener('DOMContentLoaded', function() {
    // ★ DOMContentLoaded  ->searchy overlay & result modal
    const overlay      = document.getElementById('overlay');
    const resultModal  = document.getElementById('result-modal');
    const titleEl      = document.getElementById('result-title');
    const detailEl     = document.getElementById('result-detail');
    const closeBtn     = document.getElementById('result-close');
    const winAmountEl  = document.getElementById('win-amount');    
    const playAgainBtn = document.getElementById('play-again');
    const quitBtn      = document.getElementById('quit');


    function hideResultModal() {
        overlay.style.display = 'none';
        resultModal.classList.add('hidden');
    }
    //console.log('closeBtn is', closeBtn);
    //closeBtn    .addEventListener('click', hideResultModal);
    playAgainBtn.addEventListener('click', hideResultModal);
    quitBtn     .addEventListener('click', () => location.href = 'start.html');

    // DOM Elements
    const bettingChips     = document.querySelectorAll('.betting-chip');
    const currentBetDisplay= document.querySelector('.current-bet');
    const actionButtons    = document.querySelectorAll('.action-button');
    const backButton       = document.querySelector('.back-button');
    const balanceValueSpan = document.querySelector('.balance-info .info-value');
    const roundValueSpan   = document.querySelector('.round-info .info-value');
    const resetButton       = document.querySelector('.bet-button');
    const betButton         = document.querySelectorAll('.bet-button')[1];
    const hitButton         = document.querySelector('.hit-button');
    const standButton       = document.querySelector('.stand-button');
    
    let currentBalance = 1000;
    let betFinalized   = false;
    let deck, playerHand, dealerHand, hasDealt = false;
    let roundCount     = 1;



    // Initialize UI
    balanceValueSpan.textContent = `$${currentBalance}`;
    roundValueSpan.textContent   = roundCount;

    
    // Simple UI interaction for betting chips
    let currentBet = 0; // Initialize the current bet amount
    
     
     
    bettingChips.forEach(chip => {
        chip.addEventListener('click', function() {
            if (betFinalized) return; // Prevent bet change after finalized
    
            const chipValue = parseInt(this.dataset.value);
            currentBet += chipValue;
            currentBetDisplay.textContent = `CURRENT BET: $${currentBet}`;
    
            this.classList.add('selected');
            setTimeout(() => this.classList.remove('selected'), 200);
        });
    });
    
/**
    resetButton.addEventListener('click', function () {
        if (betFinalized) return; // Prevent reset after bet is finalized

        currentBet = 0;
        currentBetDisplay.textContent = `CURRENT BET: $${currentBet}`;
        betFinalized = false;

        this.style.opacity = '0.8';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 200);

        console.log('Bet has been reset.');
    });*/
    resetButton.addEventListener('click', function () {
        overlay.style.display    = 'none';
        resultModal.classList.add('hidden');
      
        currentBalance = 1000;
        balanceValueSpan.textContent = `$${currentBalance}`;
        roundCount = 1;
        roundValueSpan.textContent = roundCount;
      
        currentBet = 0;
        betFinalized = false;
        hasDealt = false;
        currentBetDisplay.textContent = 'CURRENT BET: $0';
        document.querySelector('.player-section .cards-container').innerHTML = '';
        document.querySelector('.dealer-section .cards-container').innerHTML = '';
        dealInitialCards();
      
        this.style.opacity = '0.8';
        setTimeout(() => this.style.opacity = '1', 200);
      
        console.log('Game reset: balance, round, bet cleared and new cards dealt.');
      });

    betButton.addEventListener('click', function () {
        if (betFinalized) return; // Prevent repeated deductions

        if (currentBet > 0 && currentBet <= currentBalance) {
            currentBalance -= currentBet;
            balanceValueSpan.textContent = `$${currentBalance}`;
            betFinalized = true;
            console.log(`Balance updated: $${currentBalance}`);
        } else {
            alert("Invalid bet or insufficient balance.");
        }

        this.style.opacity = '0.8';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 200);
    });
    bettingChips.forEach(chip => {
        chip.addEventListener('click', () => {
          if (betFinalized) return;
          currentBet += +chip.dataset.value;
          currentBetDisplay.textContent = `CURRENT BET: $${currentBet}`;
        });
      });
    
      
      
    
      // BET +  deal the initial hand
      betButton.addEventListener('click', () => {
        if (betFinalized) return;
        if (currentBet > 0 && currentBet <= currentBalance) {
          currentBalance -= currentBet;
          balanceValueSpan.textContent = `$${currentBalance}`;
          betFinalized = true;
          dealInitialCards();
        } else {
          alert("Invalid bet or insufficient balance.");
        }
      });


    // Simple UI interaction for action buttons
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

function dealInitialCards() {
        deck = buildDeck();
        playerHand = [];
        dealerHand = [];
        hasDealt = true;

        document.querySelector('.player-section .cards-container').innerHTML = '';
        document.querySelector('.dealer-section .cards-container').innerHTML = '';

        for (let i = 0; i < 2; i++) {
            playerHand.push(deck.pop());
            dealerHand.push(deck.pop());
        }
        updateHandUI(playerHand, '.player-section .cards-container', false);
        updateHandUI(dealerHand, '.dealer-section .cards-container', true);
    }

    function calculateHandValue(hand) {
        let total = 0, aces = 0;
        hand.forEach(c => {
            if (c.rank === 'A') { aces++; total += 11; }
            else if (['J','Q','K'].includes(c.rank)) total += 10;
            else total += parseInt(c.rank, 10);
        });
        while (total > 21 && aces > 0) { total -= 10; aces--; }
        return total;
    }

    function updateHandUI(hand, selector, hideFirst) {
        const container = document.querySelector(selector);
        container.innerHTML = '';
        hand.forEach((card, i) => {
            const div = document.createElement('div');
            if (hideFirst && i === 0) {
                div.className = 'card card-back';
                div.innerHTML = '<div class="card-pattern">?</div>';
            } else {
                div.className = 'card card-front';
                div.innerHTML = `
                  <div class="card-corner ${card.color}">
                    <span class="card-value">${card.rank}</span>
                    <span class="card-suit">${card.suitSymbol}</span>
                  </div>
                  <div class="card-center ${card.color}">${card.suitSymbol}</div>
                  <div class="card-corner-bottom ${card.color}">
                    <span class="card-value">${card.rank}</span>
                    <span class="card-suit">${card.suitSymbol}</span>
                  </div>`;
            }
            container.appendChild(div);
        });
    }

    function handleHit() {
        if (!betFinalized || !hasDealt) return;
        playerHand.push(deck.pop());
        updateHandUI(playerHand, '.player-section .cards-container', false);
        if (calculateHandValue(playerHand) > 21) {
            determineOutcome();
        }
    }

    function handleStand() {
        if (!betFinalized || !hasDealt) return;
        updateHandUI(dealerHand, '.dealer-section .cards-container', false);
        while (
          calculateHandValue(dealerHand) < 17 ||
          (calculateHandValue(dealerHand) === 17 && dealerHand.some(c => c.rank === 'A'))
        ) {
            dealerHand.push(deck.pop());
            updateHandUI(dealerHand, '.dealer-section .cards-container', false);
        }
        determineOutcome();
    }

    //Win/Loss Determination and Show Results Popups
    function determineOutcome() {
        const playerTotal = calculateHandValue(playerHand);
        const dealerTotal = calculateHandValue(dealerHand);
        const playerBJ = playerHand.length === 2 && playerTotal === 21;
        const dealerBJ = dealerHand.length === 2 && dealerTotal === 21;
    
        // Judgment win/draw/loss
        const playerWins = (playerBJ && !dealerBJ) ||
                        (playerTotal <= 21 && 
                            (dealerTotal > 21 || playerTotal > dealerTotal));
        const push = !playerBJ && !dealerBJ && playerTotal === dealerTotal;
    
        // Calculate the odds
        let payout = 0;
        if (playerBJ && !dealerBJ)    payout = currentBet * 2.5;
        else if (push)                payout = currentBet;
        else if (playerWins)          payout = currentBet * 2;
        // other case payout = 0
    
        //update balance and rounds
        currentBalance += payout;
        balanceValueSpan.textContent = `$${currentBalance}`;
        roundCount++;
        roundValueSpan .textContent = roundCount;
    
        // Reset game state
        betFinalized = false;
        hasDealt     = false;
        currentBet   = 0;
        currentBetDisplay.textContent = `CURRENT BET: $0`;
    
        // Update UI
        titleEl.textContent     = playerWins ? 'YOU WIN!!' : (push ? 'PUSH' : 'YOU LOSE');
        winAmountEl.textContent = payout.toFixed(0);
        //detailEl.textContent    = playerWins? 'You won $' + payout.toFixed(0)
        //: (push ? 'It\'s a push.' : 'Better luck next time.');
    
        // Show result modal
        overlay.style.display    = 'block';
        resultModal.classList.remove('hidden');
    }
  

    // Event Listeners
    document.querySelector('.hit-button').addEventListener('click', handleHit);
    document.querySelector('.stand-button').addEventListener('click', handleStand);
    betButton.addEventListener('click', () => {
      if (betFinalized && !hasDealt) dealInitialCards();
    });
    hitButton .addEventListener('click', handleHit);
    standButton.addEventListener('click', handleStand);
});

