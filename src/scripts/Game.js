class Game{
    constructor(){
        this.screenHandler = new ScreenHandler(this);
        this.cardDeck = new CardDeck(this);

        this.players = [];
        this.cardGrids = [];
        
        this.round = new GameRound(this);

        this.finished = false;
    }

    startGame(playerCount, botCount){
        this.cardDeck.shuffle();

        let totalPlayerCount = playerCount + botCount;
        
        for(let i=0;i<totalPlayerCount;i++){
            let cardGrid = new CardGrid()
            let cards = [];
            for(let j=0;j<PLAYER_GRID_ROWS*PLAYER_GRID_COLUMNS;j++){
                cards.push(this.cardDeck.popTopCard());
            }
            cardGrid.giveCards(cards);
            this.cardGrids.push(cardGrid);

            this.players.push(new Player());
        }

        this.screenHandler.setupGameScreen(totalPlayerCount);
    }

    newTopCard(){
        if(this.finished){
            return;
        }

        this.round.newTopCard();
    }

    topCardClick(){
        if(this.finished){
            return;
        }

        this.round.topCardClick();
    }

    cardClick(playerId, y, x){
        if(this.finished){
            return;
        }

        this.round.cardClick(playerId, y, x)
    }

    roundFinished(){
        let scores = this.round.getScores();
        let totalScores = [];

        for(let i=0;i<this.players.length;i++){
            this.players[i].addTotalScore(scores[i]);
            totalScores.push(this.players[i].getTotalScore());
        }

        this.screenHandler.revealScores(scores, totalScores);
    }

    nextRound(){
        if(this.finished){
            return;
        }

        if(this.round.isFinished()){
            let totalScores = [];
            for(let i=0;i<this.players.length;i++){
                if(this.players[i].getTotalScore() >= LOSING_SCORE){
                    this.finished = true;
                    return;
                }
            }

            let winner = this.round.getWinner();
            this.round = new GameRound(this, false);
            this.round.setCurrentPlayer(winner);

            for(let cardGrid of this.cardGrids){
                let cards = cardGrid.retrieveCards();
                for(let card of cards){
                    this.cardDeck.recycleCard(card);
                }
            }

            for(let cardGrid of this.cardGrids){
                let cards = [];
                for(let i=0;i<PLAYER_GRID_ROWS*PLAYER_GRID_COLUMNS;i++){
                    cards.push(this.cardDeck.popTopCard());
                }
                cardGrid.giveCards(cards);
            }
            
            this.screenHandler.hideScores();
            this.screenHandler.render();
        }
    }
}
