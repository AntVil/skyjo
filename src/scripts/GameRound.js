class GameRound{
    constructor(game, firstRound){
        this.game = game;
        this.firstRound = firstRound;

        this.state = "firstTurn";

        this.currentPlayer = 0;
    }

    newTopCard(){
        if(this.state === "midTurn" || this.state === "lastTurn"){
            this.game.cardDeck.newTopCard();

            this.game.screenHandler.render();
        }
    }

    topCardClick(){
        if(this.state === "midTurn" || this.state === "lastTurn"){
            this.game.cardDeck.toggleTopCardSelected();

            this.game.screenHandler.render();
        }
    }

    cardClick(playerId, y, x){
        if(this.state === "finished"){
            return;
        }

        let turnDone = false;
        if(playerId === this.currentPlayer){
            let card = this.game.cardGrids[playerId].getCard(y, x);
            if(!card.isEmpty()){
                if(this.game.cardDeck.topCardIsSelected()){
                    card.reveal();
                    card = this.game.cardDeck.swapTopCard(card);
                    this.game.cardGrids[playerId].swapCard(card, y, x);
                    turnDone = true;
                }else{
                    if(card.isHidden()){
                        card.reveal();
                        turnDone = true;
                    }
                }

                let retrievedCards = this.game.cardGrids[playerId].retrieveCompletedCards();
                for(let i=0;i<retrievedCards.length;i++){
                    this.game.cardDeck.recycleCard(retrievedCards[i]);
                }
            }
        }

        if(this.state === "firstTurn"){
            if(this.game.cardGrids[this.currentPlayer].getRevealedCardCount() >= MINIMUM_OPENED_CARDS){
                this.nextPlayer();
            }
        }else{
            if(turnDone){
                if(this.state === "lastTurn"){
                    this.game.cardGrids[this.currentPlayer].revealCards();
                }
                this.nextPlayer();
            }
        }

        this.game.screenHandler.render();
    }

    getScores(){
        let scores = [];
        let bestPlayer = 0;
        let bestScore = Infinity;
        for(let i=0;i<this.game.cardGrids.length;i++){
            scores.push(this.game.cardGrids[i].getCurrentScore());
            if(bestScore > scores[i]){
                bestScore = scores[i];
                bestPlayer = i;
            }
        }
        if(bestPlayer !== this.currentPlayer){
            scores[this.currentPlayer] *= 2;
        }
        return scores;
    }

    getWinner(){
        let scores = this.getScores();
        let winner = 0;
        let bestScore = Infinity
        for(let i=0;i<scores.length;i++){
            if(scores[i] < bestScore){
                bestScore = scores[i];
                winner = i;
            }
        }
        return winner;
    }

    nextPlayer(){
        if(this.state === "midTurn" && this.game.cardGrids[this.currentPlayer].getRevealedCardCount() === PLAYER_GRID_ROWS * PLAYER_GRID_COLUMNS){
            this.state = "lastTurn";
        }

        this.currentPlayer = (this.currentPlayer + 1) % this.game.players.length;

        if(this.state === "firstTurn"){
            if(this.game.cardGrids[this.currentPlayer].getRevealedCardCount() >= MINIMUM_OPENED_CARDS){
                this.state = "midTurn";

                if(this.firstRound){
                    let bestScore = Infinity;
                    let cardGrids = this.game.cardGrids;
                    for(let i=0;i<cardGrids.length;i++){
                        let score = cardGrids[i].getCurrentScore();
                        if(bestScore > score){
                            bestScore = score;
                            this.currentPlayer = i;
                        }
                    }
                }
            }
        }

        this.game.cardDeck.nextPlayer();

        if(this.state === "lastTurn" && this.game.cardGrids[this.currentPlayer].getRevealedCardCount() === PLAYER_GRID_ROWS * PLAYER_GRID_COLUMNS){
            this.state = "finished";
            this.game.roundFinished();
        }
    }

    isFinished(){
        return this.state === "finished";
    }

    setCurrentPlayer(player){
        this.currentPlayer = player;
    }
}
