// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bettingChips = document.querySelectorAll('.betting-chip');
    const currentBetDisplay = document.querySelector('.current-bet');
    const actionButtons = document.querySelectorAll('.action-button');
    const backButton = document.querySelector('.back-button');
    
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