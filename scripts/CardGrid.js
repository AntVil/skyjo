class CardGrid{
    constructor(){
        this.grid = [];
        for(let y=0;y<PLAYER_GRID_ROWS;y++){
            let row = [];
            for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                row.push(new Card(NaN, false));
            }
            this.grid.push(row);
        }
    }

    getCard(y, x){
        return this.grid[y][x];
    }

    retrieveCards(){
        let cards = [];
        for(let y=0;y<PLAYER_GRID_ROWS;y++){
            for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                if(!this.grid[y][x].isEmpty()){
                    cards.push(this.grid[y][x]);
                    this.grid[y][x] = new Card(NaN, false);
                }
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
        let cardValue = this.grid[0][x].getCardValue();
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
            if(!this.grid[y][x].isEmpty()){
                cards.push(this.grid[y][x]);
                this.grid[y][x] = new Card(NaN, false);
            }
        }
        return cards;
    }

    retrieveCompletedCards(){
        for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
            if(this.columnComplete(x)){
                return this.retrieveColumn(x);
            }
        }
        return [];
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

    getCurrentScore(){
        let score = 0;
        for(let y=0;y<PLAYER_GRID_ROWS;y++){
            for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                if(!this.grid[y][x].isHidden() && !this.grid[y][x].isEmpty()){
                    score += this.grid[y][x].getCardValue();
                }
            }
        }
        return score;
    }

    swapCard(swapCard, y, x){
        let card = this.grid[y][x];
        this.grid[y][x] = swapCard;
        return card;
    }

    revealCards(){
        for(let y=0;y<PLAYER_GRID_ROWS;y++){
            for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                this.grid[y][x].reveal();
            }
        }
    }
}
