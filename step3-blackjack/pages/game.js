// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bettingChips = document.querySelectorAll('.betting-chip');
    const currentBetDisplay = document.querySelector('.current-bet');
    const actionButtons = document.querySelectorAll('.action-button');
    const backButton = document.querySelector('.back-button');
    
    // Simple UI interaction for betting chips
    let currentBet = 0; // Initialize the current bet amount

bettingChips.forEach(chip => {
    chip.addEventListener('click', function() {
        // Get chip value and convert it to a number
        const chipValue = parseInt(this.dataset.value);

        // Add chip value to the current bet
        currentBet += chipValue;

        // Update current bet display
        currentBetDisplay.textContent = `CURRENT BET: $${currentBet}`;

        // Visual feedback - optional: briefly highlight the clicked chip
        this.classList.add('selected');
        setTimeout(() => this.classList.remove('selected'), 200); // Remove highlight after 200ms
    });
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