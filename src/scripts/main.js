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
const MINIMUM_OPENED_CARDS = 2;
const LOSING_SCORE = 100;


window.onload = function(){
    game = new Game();
}
