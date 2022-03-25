class Player{
    constructor(){
        this.totalScore = 0;
    }

    addTotalScore(score){
        this.totalScore += score;
    }

    getTotalScore(){
        return this.totalScore;
    }
}
