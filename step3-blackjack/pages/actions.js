



//calculate the sum of cards in hand (player or dealer)
export function calculateHand(hand) {
    let sum = 0, aces = 0;
  
    const cards = hand.querySelectorAll('.card');

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
  
      //adding values together
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
  
    //checking with ace value should be used (1 or 11)
    while (sum > 21 && aces > 0) {
      sum  -= 10;
      aces -= 1;
    }
    return sum;
  }
