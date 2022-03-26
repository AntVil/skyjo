class Player{
    constructor(game, player, bot){
        this.game = game;
        this.player = player;
        this.totalScore = 0;
        this.bot = bot;
    }

    addTotalScore(score){
        this.totalScore += score;
    }

    getTotalScore(){
        return this.totalScore;
    }

    play(){
        if(this.bot){
            let cardGrid = this.game.cardGrids[this.player];
            if(cardGrid.getRevealedCardCount() < MINIMUM_OPENED_CARDS){
                for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                    for(let y=0;y<PLAYER_GRID_ROWS;y++){
                        this.clickOn(y, x);
                    }
                }
            }else{
                let topCardValue = this.game.cardDeck.getTopCard().getCardValue();

                for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                    let sum = 0;
                    for(let y=0;y<PLAYER_GRID_ROWS;y++){
                        sum += cardGrid.getCard(y, x).getCardValue() === topCardValue;
                    }
                    if(sum === PLAYER_GRID_ROWS-1){
                        this.selectTopCard();
                        for(let y=0;y<PLAYER_GRID_ROWS;y++){
                            if(cardGrid.getCard(y, x).getCardValue() !== topCardValue){
                                this.clickOn(y, x);
                                return;
                            }
                        }
                    }
                }
                
                if(topCardValue > 4){
                    this.newTopCard();
                    topCardValue = this.game.cardDeck.getTopCard().getCardValue();
                }

                for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                    let sum = 0;
                    for(let y=0;y<PLAYER_GRID_ROWS;y++){
                        sum += cardGrid.getCard(y, x).getCardValue() === topCardValue;
                    }
                    if(sum === PLAYER_GRID_ROWS-1){
                        this.selectTopCard();
                        for(let y=0;y<PLAYER_GRID_ROWS;y++){
                            if(cardGrid.getCard(y, x).getCardValue() !== topCardValue){
                                this.clickOn(y, x);
                                return;
                            }
                        }
                    }
                }
                
                if(cardGrid.getRevealedCardCount() < PLAYER_GRID_ROWS * PLAYER_GRID_COLUMNS - 1){
                    if(topCardValue < 5){
                        this.selectTopCard();
                    }

                    for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                        let sum = 0;
                        for(let y=0;y<PLAYER_GRID_ROWS;y++){
                            sum += cardGrid.getCard(y, x).getCardValue() === topCardValue;
                        }
                        if(sum === PLAYER_GRID_ROWS-1 && x !== PLAYER_GRID_COLUMNS-1){
                            continue;
                        }

                        for(let y=0;y<PLAYER_GRID_ROWS;y++){
                            let isHidden = cardGrid.getCard(y, x).isHidden();
                            let isGoodImprovement = cardGrid.getCard(y, x).getCardValue() - topCardValue > 2;
                            let isFine = cardGrid.getCard(y, x).getCardValue() < 3;
                            if(isHidden || (isGoodImprovement && !isFine)){
                                this.clickOn(y, x);
                            }
                        }
                    }
                }else{
                    let biggest = -2;
                    for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                        for(let y=0;y<PLAYER_GRID_ROWS;y++){
                            if(!cardGrid.getCard(y, x).isHidden() && !cardGrid.getCard(y, x).isEmpty()){
                                biggest = Math.max(biggest, cardGrid.getCard(y, x).getCardValue());
                            }
                        }
                    }

                    if(biggest < 5 && topCardValue < 5){
                        this.selectTopCard();
                        this.clickOn(PLAYER_GRID_ROWS-1, PLAYER_GRID_COLUMNS-1);
                    }else{
                        this.selectTopCard();
                        for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                            for(let y=0;y<PLAYER_GRID_ROWS;y++){
                                if(cardGrid.getCard(y, x).getCardValue() === biggest){
                                    this.clickOn(y, x);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    clickOn(y, x){
        document.getElementById(`player_${this.player}_card_${y}_${x}`).dispatchEvent(new Event("mousedown"));
    }

    selectTopCard(){
        document.getElementById("topCard").dispatchEvent(new Event("mousedown"));
    }

    newTopCard(){
        document.getElementById("newTopCard").dispatchEvent(new Event("mousedown"));
    }
}
