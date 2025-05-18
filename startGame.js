let playerName = localStorage.getItem('playerName') || '';
let coins = 3000;
let inventory = [];
let log = [];
let crownedIndex = null; // Only one crown at a time
let graveyard = []
let currentChar = null;
let forceKatsuie = false;
let boolKatsuie = true;
let birdFlag = false;
let birdCountdown = 0;
let lemons = 6;

function onStartClicked() {
    document.getElementById('startScreen').classList.remove('active');

    if (playerName) {
        startGame(); 
    } else {
        document.getElementById('nameScreen').classList.add('active');
    }
}


function saveName() {
    const input = document.getElementById('playerNameInput').value;
    if (input.trim()) {
        playerName = input.trim();
        localStorage.setItem('playerName', playerName);
        startGame();
    }
}

function startGame() {
    document.getElementById('nameScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    document.getElementById('playerInfo').textContent = `${playerName} - ${coins}G`;
    reroll(true);
}