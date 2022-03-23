
let game;

window.onload = function(){
    game = new Game();
}


function isTrueNaN(value){
    return typeof(value) === "number" && isNaN(value);
}


class Game{
    constructor(){
        this.cardDeck = null;
        this.players = [];
        this.playerGridRows = 3;
        this.playerGridColumns = 4;
        this.headerElement = document.getElementsByTagName("header")[0];
        this.mainElement = document.getElementsByTagName("main")[0];
        this.footerElement = document.getElementsByTagName("footer")[0];
        this.playersElement = document.getElementById("players");
        this.currentPlayer = 0;
        this.viewCardSelected = false;
        this.redrawPossible = true;
        
        this.gameState = "";

        this.firstGame = true;
    }

    startGame(playersAmount){
        this.cardDeck = new CardDeck();
        this.cardDeck.shuffle();

        this.footerElement.style.gridTemplateColumns = `repeat(${playersAmount}, 1fr)`;

        this.players = [];
        for(let i=0;i<playersAmount;i++){
            let cards = [];
            for(let j=0;j<this.playerGridRows*this.playerGridColumns;j++){
                cards.push(this.cardDeck.getTopCard(false));
            }
            this.players.push(new Player(cards, this.playerGridRows, this.playerGridColumns));

            let playerElement = document.createElement("div");
            playerElement.id = `player${i}`;
            playerElement.style.position = "absolute";
            playerElement.style.top = `${50 + 33 * Math.cos(-2 * Math.PI * i / playersAmount)}%`;
            playerElement.style.left = `${50 + 33 * Math.sin(-2 * Math.PI * i / playersAmount)}%`;
            playerElement.style.transform = `translate(-50%, -50%) rotate(${360 * i / playersAmount}deg)`;
            playerElement.style.display = "grid";
            playerElement.style.gridTemplateColumns = `repeat(${this.playerGridColumns}, 1fr)`;
            playerElement.style.gridTemplateRows = `repeat(${this.playerGridRows}, 1fr)`;
            
            for(let j=0;j<this.playerGridRows*this.playerGridColumns;j++){
                let playerCardElement = document.createElement("img");
                playerCardElement.id = `${i}_${j}`;
                playerCardElement.onmousedown = function(){
                    let [playerId, cardId] = this.id.split("_");
                    playerId = parseInt(playerId);
                    cardId = parseInt(cardId);
                    game.cardClick(playerId, cardId);
                };
                playerCardElement.style.gridColumn = j % this.playerGridColumns + 1;
                playerCardElement.style.gridRow = Math.floor(j / this.playerGridColumns) + 1;
                playerElement.appendChild(playerCardElement);
            }
            this.playersElement.appendChild(playerElement);

            let playerTotalScore = document.createElement("div");
            playerTotalScore.id = `playerTotalScore${i}`;
            playerTotalScore.innerText = 0;
            playerTotalScore.style.color = "#FFFF00";
            this.footerElement.appendChild(playerTotalScore);
        }

        this.headerElement.style.opacity = 0;
        this.headerElement.style.zIndex = 0;

        this.currentPlayer = 0;
        
        this.firstGame = true;
        this.gameState = "firstRound";
        this.renderCards();
    }

    nextPlayer(){
        if(this.gameState === "done"){
            return;
        }

        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.redrawPossible = true;

        if(this.gameState === "firstRound" && this.players[this.currentPlayer].getOpenCardCount() >= 2){
            this.gameState = "midRound";

            if(this.firstGame){
                let bestScore = this.players[0].getOpenCardScore();
                let bestPlayer = 0;
                for(let i=1;i<this.players.length;i++){
                    let score = this.players[i].getOpenCardScore();
                    if(score < bestScore){
                        bestPlayer = i;
                        bestScore = score;
                    }
                }
                this.currentPlayer = bestPlayer;
            }

            this.cardDeck.viewTopCard().unhide();
        }

        if(this.gameState === "lastRound" && this.players[this.currentPlayer].getOpenCardCount() === this.playerGridColumns * this.playerGridRows){
            let bestScore = this.players[0].getOpenCardScore();
            let bestPlayer = 0;
            for(let i=0;i<this.players.length;i++){
                let score = this.players[i].getOpenCardScore();

                let scoreElement = document.createElement("div");
                scoreElement.id = `playerscore${i}`;
                scoreElement.innerText = score;
                scoreElement.style.display = "flex";
                scoreElement.style.justifyContent = "center";
                scoreElement.style.alignItems = "center";
                scoreElement.style.zIndex = "1";
                scoreElement.style.gridColumnStart = "1";
                scoreElement.style.gridColumnEnd = this.playerGridColumns + 1;
                scoreElement.style.gridRowStart = "1";
                scoreElement.style.gridRowEnd = this.playerGridRows + 1;
                document.getElementById(`player${i}`).appendChild(scoreElement);

                if(score < bestScore){
                    bestPlayer = i;
                    bestScore = score;
                }
            }
            if(this.currentPlayer !== bestPlayer){
                document.getElementById(`playerscore${this.currentPlayer}`).innerText *= 2;
            }

            let gameFinished = false;
            for(let i=0;i<this.players.length;i++){
                let scoreElement = document.createElement("div");
                scoreElement.innerText = document.getElementById(`playerscore${i}`).innerText;
                this.footerElement.appendChild(scoreElement);

                let playerTotalScoreElement = document.getElementById(`playerTotalScore${i}`);
                let currentTotalScore = parseInt(playerTotalScoreElement.innerText);
                currentTotalScore += parseInt(document.getElementById(`playerscore${i}`).innerText);
                playerTotalScoreElement.innerText = currentTotalScore;
                if(currentTotalScore > 100){
                    gameFinished = true;
                }
            }
            
            if(!gameFinished){
                this.currentPlayer = bestPlayer;
                this.gameState = "roundFinished";
            }else{
                let bestScore = Infinity;
                for(let i=0;i<this.players.length;i++){
                    let score = parseInt(document.getElementById(`playerTotalScore${i}`));
                    if(score < bestScore){
                        bestScore = score;
                        this.currentPlayer = i;
                    }
                }
                this.gameState = "done";
            }
            
            document.getElementById("footerToogle").checked = true;
        }

        this.renderCards();
    }

    nextRound(){
        if(document.getElementById("footerToogle").checked && this.gameState === "roundFinished"){
            this.firstGame = false;
            for(let i=0;i<this.players.length;i++){
                let cards = this.players[i].getAllCards();
                for(let j=0;j<cards.length;j++){
                    this.cardDeck.recycleCard(cards[j]);
                }

                document.getElementById(`playerscore${i}`).remove();
            }

            this.cardDeck.shuffle();

            for(let i=0;i<this.players.length;i++){
                let cards = [];
                for(let j=0;j<this.playerGridRows*this.playerGridColumns;j++){
                    cards.push(this.cardDeck.getTopCard(false));
                }
                this.players[i].giveCards(cards);
            }

            this.gameState = "firstRound";
            this.renderCards();
        }
    }

    newTopCard(){
        if(this.gameState === "roundFinished" || this.gameState === "done"){
            return;
        }

        if(this.gameState === "midRound" || this.gameState === "lastRound"){
            if(this.redrawPossible){
                this.cardDeck.recycleCard(this.cardDeck.getTopCard(true));
                this.redrawPossible = false;
                document.getElementById("topCard").animate(
                    [
                        { borderColor: "#FFFFFF", backgroundColor: "#FFFFFF" },
                        { borderColor: "transparent", backgroundColor: "transparent" }
                    ], {
                        duration: 500,
                        iterations: 1
                    }
                );
            }
        }
        
        this.renderCards();
    }

    topCardClick(){
        if(this.gameState === "roundFinished" || this.gameState === "done"){
            return;
        }
        
        if(this.gameState === "midRound" || this.gameState === "lastRound"){
            if(this.viewCardSelected){
                this.viewCardSelected = false;
            }else{
                this.viewCardSelected = true;
            }
            this.renderCards();
        }
    }

    cardClick(playerId, cardId){
        if(this.gameState === "roundFinished" || this.gameState === "done"){
            return;
        }

        let turnDone = false;
        if(this.currentPlayer === playerId){
            let y = Math.floor(cardId / this.playerGridColumns);
            let x = cardId % this.playerGridColumns;
            
            if(isTrueNaN(this.players[playerId].getCardValue(y, x))){
                return;
            }

            if(this.viewCardSelected){
                let card = this.players[playerId].swapCard(y, x, this.cardDeck.getTopCard(true));
                card.unhide();
                this.cardDeck.setTopCard(card);
                this.viewCardSelected = false;
                turnDone = true;
            }else{
                turnDone = this.players[playerId].flipCard(y, x);
            }

            if(this.gameState === "firstRound" && this.players[this.currentPlayer].getOpenCardCount() < 2){
                turnDone = false;
            }
            if(this.gameState === "midRound" && this.players[this.currentPlayer].getOpenCardCount() === this.playerGridColumns * this.playerGridRows){
                this.gameState = "lastRound";
            }
        }

        if(turnDone){
            let removedCards = this.players[this.currentPlayer].getRemovedCards();
            for(let card of removedCards){
                this.cardDeck.recycleCard(card);
            }

            if(this.gameState === "lastRound"){
                this.players[this.currentPlayer].openAllCards();
            }
            this.nextPlayer();
        }

        this.renderCards();
    }

    renderCards(){
        let topCard = this.cardDeck.viewTopCard()
        let topCardElement = document.getElementById("topCard");
        topCardElement.src = `./images/${topCard.getCardValue()}.svg`;
        if(this.viewCardSelected){
            topCardElement.style.filter = "brightness(120%)";
            topCardElement.style.borderColor = "#AAAAAA";
            topCardElement.style.backgroundColor = "#AAAAAA";
        }else{
            topCardElement.style.filter = "brightness(100%)";
            topCardElement.style.borderColor = "transparent";
            topCardElement.style.backgroundColor = "transparent";
        }
        
        for(let i=0;i<this.players.length;i++){
            for(let y=0;y<this.playerGridRows;y++){
                for(let x=0;x<this.playerGridColumns;x++){
                    let cardElement = document.getElementById(`${i}_${y * this.playerGridColumns + x}`);
                    cardElement.src = `./images/${this.players[i].getCardValue(y, x)}.svg`;
                    if(i === this.currentPlayer){
                        cardElement.style.filter = "brightness(100%)";
                    }else{
                        cardElement.style.filter = "brightness(60%)";
                    }
                }
            }
            document.getElementById(`player${i}`).style.borderColor = "transparent";
            document.getElementById(`player${i}`).style.backgroundColor = "transparent";
        }

        document.getElementById(`player${this.currentPlayer}`).style.borderColor = "#AAAAAA";
        document.getElementById(`player${this.currentPlayer}`).style.backgroundColor = "#AAAAAA";

        let cardValue = this.cardDeck.viewTopCard().getCardValue();
        document.getElementById("topCard").src = `./images/${cardValue}.svg`;
    }
}


class CardDeck{
    constructor(){
        this.cardOccurances = {
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
        }

        this.cards = [];
        for(let cardValue of Object.keys(this.cardOccurances)){
            for(let i=0;i<this.cardOccurances[cardValue];i++){
                this.cards.push(new Card(parseInt(cardValue), true));
            }
        }

        this.recycledCards = [];
    }

    shuffle(){
        for(let i=0;i<this.cards.length;i++){
            this.cards[i].hide();
        }

        for(let i=0;i<this.cards.length;i++){
            let randomIndex = Math.floor(Math.random() * this.cards.length);
            let temp = this.cards[i];
            this.cards[i] = this.cards[randomIndex]
            this.cards[randomIndex] = temp;
        }
    }

    getTopCard(reveal){
        let card = this.cards.shift();

        if(this.cards.length === 0){
            this.cards = this.recycledCards;
            this.recycledCards = [];
            this.shuffle();
        }
        
        if(reveal){
            this.cards[0].unhide();
        }
        return card;
    }
    
    setTopCard(card){
        return this.cards.unshift(card);
    }

    viewTopCard(){
        return this.cards[0];
    }

    recycleCard(card){
        if(card !== undefined){
            this.recycledCards.push(card);
        }
    }
}


class Player{
    constructor(cards, rows, cols){
        this.rows = rows;
        this.cols = cols
        this.cardGrid = [];
        for(let y=0;y<this.rows;y++){
            let row = [];
            for(let x=0;x<this.cols;x++){
                row.push(cards[cols * y + x]);
            }
            this.cardGrid.push(row);
        }
        this.totalScore = 0;
    }

    flipCard(cardRow, cardColumn){
        if(this.cardGrid[cardRow][cardColumn].isHidden()){
            this.cardGrid[cardRow][cardColumn].unhide();
            return true;
        }
        return false;
    }

    swapCard(cardRow, cardColumn, newCard){
        let swapedCard = this.cardGrid[cardRow][cardColumn];
        this.cardGrid[cardRow][cardColumn] = newCard;
        return swapedCard;
    }

    getCardValue(cardRow, cardColumn){
        return this.cardGrid[cardRow][cardColumn].getCardValue();
    }

    getOpenCardCount(){
        let count = 0;
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                count += !this.cardGrid[y][x].isHidden();
            }
        }
        return count;
    }

    getOpenCardScore(){
        let score = 0;
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                if(!this.cardGrid[y][x].isHidden()){
                    let value = this.cardGrid[y][x].getCardValue()
                    if(!isNaN(value)){
                        score += value;
                    }
                }
            }
        }
        return score;
    }

    openAllCards(){
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                this.cardGrid[y][x].unhide();
            }
        }
    }

    getRemovedCards(){
        let removed = [];
        for(let x=0;x<this.cols;x++){
            let cardValue = this.cardGrid[0][x].getCardValue();
            if(cardValue === "hidden"){
                continue
            }else{
                let allEqual = true;
                for(let y=1;y<this.rows;y++){
                    allEqual = allEqual && this.cardGrid[y][x].getCardValue() === cardValue;
                }
                if(allEqual){
                    for(let y=0;y<this.rows;y++){
                        removed.push(this.cardGrid[y][x]);
                        this.cardGrid[y][x] = new Card(NaN, false);
                    }
                }
            }
        }
        return removed;
    }

    getAllCards(){
        let removed = [];
        for(let x=0;x<this.cols;x++){
            for(let y=0;y<this.rows;y++){
                let cardValue = this.cardGrid[y][x].getCardValue();
                if(isTrueNaN(cardValue)){
                    continue
                }else{
                    removed.push(this.cardGrid[y][x]);
                    this.cardGrid[y][x] = new Card(NaN, false);
                }
            }
        }
        return removed;
    }

    giveCards(cards){
        for(let x=0;x<this.cols;x++){
            for(let y=0;y<this.rows;y++){
                let cardValue = this.cardGrid[y][x].getCardValue();
                if(!isTrueNaN(cardValue)){
                    console.log("ohno");
                    console.log(cardValue);
                }else{
                    this.cardGrid[y][x] = cards[this.cols * y + x];
                }
            }
        }
    }
}


class Card{
    constructor(cardValue, hidden){
        this.cardValue = cardValue;
        this.hidden = hidden;
    }

    isHidden(){
        return this.hidden;
    }

    unhide(){
        this.hidden = false;
    }

    hide(){
        this.hidden = true;
    }

    getCardValue(){
        if(this.hidden){
            return "hidden";
        }else{
            return this.cardValue;
        }
    }
}
