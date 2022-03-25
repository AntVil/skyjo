let game;

const PLAYER_GRID_ROWS = 3;
const PLAYER_GRID_COLUMNS = 4;
const CARD_OCCURRENCES = {
    "-2": 5,
    "-1": 10,
    "0": 15,
    "1": 10,
    "2": 10,
    "3": 10,
    "4": 10,
    "5": 10,
    "6": 10,
    "7": 10,
    "8": 10,
    "9": 10,
    "10": 10,
    "11": 10,
    "12": 10,
};


window.onload = function(){
    game = new Game();
}


class Game{
    constructor(){
        this.screenHandler = new ScreenHandler();
    }

    startGame(playerCount, botCount){
        this.screenHandler.setupGameScreen(playerCount + botCount);
    }
}


class ScreenHandler{
    constructor(){

    }

    setupGameScreen(totalPlayerCount){

    }
}


class GameRound{
    constructor(){

    }
}


class CardDeck{
    constructor(){
        this.cards = [];
        this.recycledCards = [];

        for(let cardString of Object.keys(CARD_OCCURRENCES)){
            let cardValue = parseInt(cardString);
            let occurrence = CARD_OCCURRENCES[cardString];
            for(let i=0;i<occurrence;i++){
                this.cards.push(new Card());
            }
        }
    }

    shuffle(){
        for(let i=0;i<this.cards;i++){
            this.cards[i].hide();
        }

        for(let i=0;i<this.cards;i++){
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

    recycleCard(card){
        this.recycledCards.push(card)
    }
}


class Player{
    constructor(){

    }
}


class CardGrid{
    constructor(cards){
        this.grid = [];
        for(let y=0;y<PLAYER_GRID_ROWS;y++){
            let row = [];
            for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                row.push(new Card(NaN, false));
            }
            this.grid.push(row);
        }
    }

    retrieveCards(){
        let cards = [];
        for(let y=0;y<PLAYER_GRID_ROWS;y++){
            for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                cards.push(this.grid[y][x]);
                this.grid[y][x] = new Card(NaN, false);
            }
        }
        return cards;
    }

    giveCards(cards){
        for(let y=0;y<PLAYER_GRID_ROWS;y++){
            for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                let card = cards[y * PLAYER_GRID_COLUMNS + x]
                card.hide();
                this.grid[y][x] = card;
            }
        }
    }

    columnComplete(x){
        let cardValue = this.grid[0][x];
        if(cardValue === "hidden" || this.grid[0][x].isEmpty()){
            return false;
        }

        for(let y=0;y<PLAYER_GRID_ROWS;y++){
            if(this.grid[y][x].isEmpty() || this.grid[y][x].getCardValue() !== cardValue){
                return false;
            }
        }
        return true;
    }

    retrieveColumn(x){
        let cards = [];
        for(let y=0;y<PLAYER_GRID_ROWS;y++){
            cards.push(grid[y][x]);
            grid[y][x] = new Card(NaN, false);
        }
        return cards;
    }

    getRevealedCardCount(){
        let count = 0;
        for(let y=0;y<PLAYER_GRID_ROWS;y++){
            for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                if(!this.grid[y][x].isHidden()){
                    count++;
                }
            }
        }
        return count;
    }
}


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
        return typeof(this.cardValue) === Number && isNaN(this.cardValue);
    }

    getCardValue(){
        if(this.isHidden()){
            return "hidden";
        }else{
            return this.cardValue;
        }
    }
}