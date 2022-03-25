class CardDeck{
    constructor(game){
        this.game = game;
        
        this.cards = [];
        this.recycledCards = [];

        for(let cardString of Object.keys(CARD_OCCURRENCES)){
            let cardValue = parseInt(cardString);
            let occurrence = CARD_OCCURRENCES[cardString];
            for(let i=0;i<occurrence;i++){
                this.cards.push(new Card(cardValue, true));
            }
        }

        this.redrawPossible = true;
        this.topCardSelected = false;
    }

    shuffle(){
        for(let i=0;i<this.cards;i++){
            this.cards[i].hide();
        }

        for(let i=0;i<this.cards.length;i++){
            let swapIndex = Math.floor(Math.random() * this.cards.length);
            let swapCard = this.cards[swapIndex];
            this.cards[swapIndex] = this.cards[i];
            this.cards[i] = swapCard;
        }
    }

    popTopCard(){
        let topCard = this.cards.shift();
        
        if(this.cards.length === 0){
            this.cards = this.recycledCards;
            this.shuffle();
        }

        this.cards[0].reveal();

        return topCard;
    }

    getTopCard(){
        return this.cards[0];
    }

    swapTopCard(swapCard){
        let card = this.cards[0];
        this.cards[0] = swapCard;
        return card;
    }

    recycleCard(card){
        this.recycledCards.push(card)
    }

    newTopCard(){
        if(this.redrawPossible){
            this.game.screenHandler.renderNewTopCard();
            this.recycleCard(this.popTopCard());
            this.redrawPossible = false;
        }
    }

    toggleTopCardSelected(){
        this.topCardSelected = !this.topCardSelected;
    }

    topCardIsSelected(){
        return this.topCardSelected;
    }

    nextPlayer(){
        this.redrawPossible = true;
        this.topCardSelected = false;
    }
}
