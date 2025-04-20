import { BlackjackGame } from "./blackJackGameClass";

const game = new BlackjackGame();

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bettingChips = document.querySelectorAll('.betting-chip');
    const currentBetDisplay = document.querySelector('.current-bet');
    const actionButtons = document.querySelectorAll('.action-button');
    const backButton = document.querySelector('.back-button');
    let currentBalance = 1000; // Starting balance
    let betFinalized = false;

    const balanceValueSpan = document.querySelector('.balance-info .info-value');
    balanceValueSpan.textContent = `$${currentBalance}`;


    
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
    
const resetButton = document.querySelector('.bet-button'); // First .bet-button is RESET
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
});

const betButton = document.querySelectorAll('.bet-button')[1]; // Second .bet-button (BET)
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




    
    // Simple UI interaction for action buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Visual feedback
            this.style.opacity = '0.8';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);

            const action = this.dataset.action; // PLEASE READ: I don't know if this is how it should be defined
                                        // Please delete this message after confirm/change this accordingly
                                        // This only affect the following switch statements
            
            // Log the action (for demonstration)
            console.log(`${this.textContent} button clicked`);
            
            // Inject BlackjackGame logic (without deleting original code)
            switch(action){
                case 'hit':
                    game.cardManager.hitPlayer();
                    console.log('Player Hand after hit:', game.playerHand);
                    break;

                case 'stand':
                    game.playerStand();
                    console.log('Dealer Hand after stand:', game.dealerHand);
                    break;

                case 'double':
                    // This action has not been completed in the blackjack class yet
                    game.playerDoubleDown?.(); // remember to change this line
                    break;

                case 'split':
                    // This action has not been completed in the blackjack class yet
                    game.playerSplit?.(); // remember to change this line
                    break;

                default:
                    console.warn('Unknown action:', action);
            }
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