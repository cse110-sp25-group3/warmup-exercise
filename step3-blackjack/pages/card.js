//drawing the card facedown (just the back, no value)
export function cardSlideIn(cardData) {
    const card = document.createElement('div');
    card.className = 'card card-back slide-in';
    const pattern = document.createElement('div');
    pattern.className = 'card-pattern';
    pattern.textContent = cardData.suitSymbol;
    card.appendChild(pattern);
    // stash the data for flip
    card._cardData = cardData;
    return card;
}

//flipping card
export function flipCard(card) {
    const { rank, suitSymbol, color } = card._cardData;
    card.innerHTML = '';                 // clear the back
    card.className = 'card card-front';  // switch classes

    // top corner
    const top = document.createElement('div');
    top.className = `card-corner ${color}`;
    top.innerHTML = `
    <div class="card-value">${rank}</div>
    <div class="card-suit">${suitSymbol}</div>
    `;
    card.appendChild(top);

    // center pip
    const center = document.createElement('div');
    center.className = `card-center ${color}`;
    center.textContent = suitSymbol;
    card.appendChild(center);

    // bottom corner (rotated)
    const bottom = document.createElement('div');
    bottom.className = `card-corner-bottom ${color}`;
    bottom.innerHTML = `
    <div class="card-value">${rank}</div>
    <div class="card-suit">${suitSymbol}</div>
    `;
    card.appendChild(bottom);
}

/** add on
 * <playing-card> Web Component
 * Attributes: rank="A|2|...|K" suit="♠|♥|♣|♦" color="red|black"
 * Click to flip the card
 */
class PlayingCard extends HTMLElement {
    constructor() {
      super();
      this._faceUp = false;
      this.attachShadow({ mode: 'open' });
      this._cardData = {
        rank: this.getAttribute('rank'),
        suitSymbol: this.getAttribute('suit'),
        color: this.getAttribute('color')
      };
      this._container = document.createElement('div');
      this.shadowRoot.appendChild(this._container);
    }
  
    static get observedAttributes() {
      return ['rank', 'suit', 'color'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (name === 'rank') this._cardData.rank = newValue;
        if (name === 'suit') this._cardData.suitSymbol = newValue;
        if (name === 'color') this._cardData.color = newValue;
        this.render();
      }
    }
  
    connectedCallback() {
      this.render();
      this._container.addEventListener('click', () => this.flip());
    }
  
    render() {
      // clear
      this._container.innerHTML = '';
      // draw either face-down or face-up
      const cardEl = this._faceUp
        ? document.createElement('div')
        : document.createElement('div');
  
      if (!this._faceUp) {
        // back
        cardEl.className = 'card card-back';
        const pattern = document.createElement('div');
        pattern.className = 'card-pattern';
        pattern.textContent = this._cardData.suitSymbol;
        cardEl._cardData = this._cardData;
        cardEl.appendChild(pattern);
      } else {
        // front
        cardEl.className = 'card card-front';
        cardEl._cardData = this._cardData;
        flipCard(cardEl);
      }
  
      this._container.appendChild(cardEl);
    }
  
    flip() {
      this._faceUp = true;
      this.render();
    }
  }
  
  customElements.define('playing-card', PlayingCard);
  
  export { PlayingCard };
  