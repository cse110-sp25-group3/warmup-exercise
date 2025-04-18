import {buildDeck} from "./deck.js"
import {calculateHand} from "./actions.js"
import {cardSlideIn, flipCard} from "./card.js"

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bettingChips = document.querySelectorAll('.betting-chip');
    const currentBetDisplay = document.querySelector('.current-bet');
    const actionButtons = document.querySelectorAll('.action-button');
    const backButton = document.querySelector('.back-button');
    const playerContainer = document.querySelector('.player-section .cards-container');
    const dealerContainer = document.querySelector('.dealer-section .cards-container');


    const deck = buildDeck();

    const playerWin = false;
    const dealerWin = false;

    
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


    function updatePlayerScore() { //updating sum on the screen 
        document.querySelector('.score-display').textContent = calculateHand(playerContainer);
      }

    function check21(hand){
        return (calculateHand(hand) >= 21);
    }

    // handlers for action buttons 
    function addCard(hand){
        if (deck.length === 0) return alert('No more cards!');
        const cardData = deck.pop(); //card from top of the deck
        const cardElement = cardSlideIn(cardData); //setting it up to be displayed 
        hand.appendChild(cardElement);
    
        //once slide in has completed, slide card in
        if(hand == playerContainer ){ //but only if it's the player hand, don't flip for dealer
            cardElement.addEventListener('animationend', () => flipCard(cardElement), { once: true });
        }
    }

    function handleHit() { //drawing a card from the deck
        addCard(playerContainer);

        updatePlayerScore(); // updating after card has been added 

        if(check21(playerContainer)){
            //player win or loss? round end 
        }
      }
      

    function handleStand() {
        // e.g. run dealer AI, compare totals, resolve round…
        console.log('STAND logic here');

        addCard(dealerContainer);
        if(check21(dealerContainer)){
            //dealer win or loss? round end 
        }
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