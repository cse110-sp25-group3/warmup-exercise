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