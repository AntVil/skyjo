class Card{
    constructor(cardValue, hidden){
        this.cardValue = cardValue; 
        this.hidden = hidden;
    }

    hide(){
        this.hidden = true;
    }

    reveal(){
        this.hidden = false;
    }

    isHidden(){
        return this.hidden;
    }

    isEmpty(){
        return typeof(this.cardValue) === 'number' && isNaN(this.cardValue);
    }

    getCardValue(){
        if(this.isHidden()){
            return "hidden";
        }else{
            return this.cardValue;
        }
    }
}
