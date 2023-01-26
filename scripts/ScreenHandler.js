class ScreenHandler{
    constructor(game){
        this.game = game;
        this.headerElement = document.getElementsByTagName("header")[0];
        this.mainElement = document.getElementsByTagName("main")[0];
        this.footerElement = document.getElementsByTagName("footer")[0];
        this.playersElement = document.getElementById("players");
        this.topCardElement = document.getElementById("topCard");
        this.newTopCardElement = document.getElementById("newTopCard");
        this.footerToogleElement = document.getElementById("footerToogle");

        this.footerToogleLabelElement = document.getElementById("footerToogleLabel");
        this.reloadButtonElement = document.getElementById("reloadButton");

        this.footerToogleLabelElement.style.display = "none";
        this.reloadButtonElement.style.display = "none";
    }

    setupGameScreen(totalPlayerCount){
        this.footerElement.style.gridTemplateColumns = `repeat(${totalPlayerCount}, 1fr)`;
        for(let i=0;i<totalPlayerCount;i++){
            let playerElement = document.createElement("div");
            playerElement.id = `player_${i}`;
            playerElement.style.position = "absolute";
            playerElement.style.top = `${50 + 33 * Math.cos(-2 * Math.PI * i / totalPlayerCount)}%`;
            playerElement.style.left = `${50 + 33 * Math.sin(-2 * Math.PI * i / totalPlayerCount)}%`;
            playerElement.style.transform = `translate(-50%, -50%) rotate(${360 * i / totalPlayerCount}deg)`;
            playerElement.style.display = "grid";
            playerElement.style.gridTemplateColumns = `repeat(${PLAYER_GRID_COLUMNS}, 1fr)`;
            playerElement.style.gridTemplateRows = `repeat(${PLAYER_GRID_ROWS}, 1fr)`;
            
            for(let y=0;y<PLAYER_GRID_ROWS;y++){
                for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                    let playerCardElement = document.createElement("img");
                    playerCardElement.id = `player_${i}_card_${y}_${x}`;
                    playerCardElement.addEventListener("mousedown", () => {
                        game.cardClick(i, y, x);
                    });
                    playerCardElement.style.gridColumn = x + 1;
                    playerCardElement.style.gridRow = y + 1;
                    playerElement.appendChild(playerCardElement);
                }
            }

            this.playersElement.appendChild(playerElement);

            let playerTotalScoreElement = document.createElement("div");
            playerTotalScoreElement.innerText = "0";
            playerTotalScoreElement.id = `player_${i}_totalScore`;
            playerTotalScoreElement.style.borderColor = "#000000AA";
            playerTotalScoreElement.style.color = "#FFFF00";
            this.footerElement.appendChild(playerTotalScoreElement);
        }

        this.headerElement.style.opacity = 0;
        this.headerElement.style.zIndex = 0;

        this.footerToogleLabelElement.style.display = "";
        this.reloadButtonElement.style.display = "";

        this.render();
    }

    render(){
        let topCard = this.game.cardDeck.getTopCard();
        this.topCardElement.src = `./images/${topCard.getCardValue()}.svg`;

        let cardGrids = this.game.cardGrids;
        for(let i=0;i<cardGrids.length;i++){
            for(let y=0;y<PLAYER_GRID_ROWS;y++){
                for(let x=0;x<PLAYER_GRID_COLUMNS;x++){
                    let playerCard = cardGrids[i].getCard(y, x);
                    let playerCardElement = document.getElementById(`player_${i}_card_${y}_${x}`);
                    playerCardElement.src = `./images/${playerCard.getCardValue()}.svg`;
                }
            }
        }

        if(this.game.cardDeck.topCardIsSelected()){
            this.topCardElement.style.filter = "brightness(120%)";
            this.topCardElement.style.borderColor = "#AAAAAAFF";
            this.topCardElement.style.backgroundColor = "#AAAAAAFF";
        }else{
            this.topCardElement.style.filter = "brightness(100%)";
            this.topCardElement.style.borderColor = "#AAAAAA00";
            this.topCardElement.style.backgroundColor = "#AAAAAA00";
        }

        let highlight = 0;
        if(this.game.round.isFinished()){
            highlight = this.game.round.getWinner();
        }else{
            highlight = this.game.round.currentPlayer;
        }

        for(let i=0;i<this.game.players.length;i++){
            let playerElement = document.getElementById(`player_${i}`);
            if(i === highlight){
                playerElement.style.filter = "brightness(100%)";
                playerElement.style.borderColor = "#AAAAAAFF";
                playerElement.style.backgroundColor = "#AAAAAAFF";
            }else{
                playerElement.style.filter = "brightness(60%)";
                playerElement.style.borderColor = "#AAAAAA00";
                playerElement.style.backgroundColor = "#AAAAAA00";
            }
        }
    }

    renderNewTopCard(){
        this.newTopCardElement.animate(
            [
                { borderColor: "#FFFFFFFF", backgroundColor: "#FFFFFFFF" },
                { borderColor: "#FFFFFF00", backgroundColor: "#FFFFFF00" }
            ], {
                duration: 500,
                iterations: 1
            }
        );
    }

    highlight(player, y, x){
        let element = document.getElementById(`player_${player}_card_${y}_${x}`).animate(
            [
                { filter: "brightness(30%)" },
                { filter: "brightness(100%)" }
            ], {
                duration: 500,
                iterations: 1
            }
        );
    }

    revealScores(scores, totalScores){
        for(let i=0;i<scores.length;i++){
            let totalScoreElement = document.getElementById(`player_${i}_totalScore`);
            totalScoreElement.innerText = totalScores[i];

            let scoreElement = document.createElement("div");
            scoreElement.innerText = scores[i];
            this.footerElement.appendChild(scoreElement);

            let tempScoreElement = document.createElement("div");
            tempScoreElement.id = `tempplayerscore_${i}`;
            tempScoreElement.innerText = scores[i];
            tempScoreElement.style.display = "flex";
            tempScoreElement.style.justifyContent = "center";
            tempScoreElement.style.alignItems = "center";
            tempScoreElement.style.zIndex = "1";
            tempScoreElement.style.gridColumnStart = "1";
            tempScoreElement.style.gridColumnEnd = this.playerGridColumns + 1;
            tempScoreElement.style.gridRowStart = "1";
            tempScoreElement.style.gridRowEnd = this.playerGridRows + 1;
            document.getElementById(`player_${i}`).appendChild(tempScoreElement);
        }

        this.footerToogleElement.checked = true;
    }

    hideScores(){
        for(let i=0;i<this.game.players.length;i++){
            document.getElementById(`tempplayerscore_${i}`).remove();
        }
    }
}
