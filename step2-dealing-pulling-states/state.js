// state.js

/**
 * State: managing player funds, bet validation, persistence
 */
export class GameState {
    constructor(initialMoney = 1000){
      this.moneyKey ='blackjack-money';
      this.initialMoney = initialMoney;
      this.currentBet = 0;
      this._money= this.loadMoney() ?? initialMoney;
      this.saveMoney();
    }
  
    /**
     * get the current bet amount
     */
    get money(){
      return this._money;
    }
  
    /**
     * place bets and check that if balance is sufficient
     * @param {number} amount value of bet
     * @returns {boolean} if the bet is valid
     */
    placeBet(amount) {
      if (amount > 0 && amount <= this._money) {
        this.currentBet = amount;
        this._money -= amount;
        this.saveMoney();
        return true;
      }
      return false;
    }
    /**
        Updating of balances (for post-closing add-backs or deductions)
     * @param {number} delta (positive number= profit, negative number=loss.
     */
    updateMoney(delta){
      this._money +=delta;
      this.saveMoney();
    }
    /*
     * Save the current balance to localStorage
     */
    saveMoney(){
      localStorage.setItem(this.moneyKey,JSON.stringify(this._money));
    }
  
    /*
     * Load the current balance from localStorage
     * @returns {number|null}
     */
    loadMoney() {
      const stored = localStorage.getItem(this.moneyKey);
      return stored !== null ? JSON.parse(stored) : null;
    }
  }
  