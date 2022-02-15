let r = new Room(
    './assets/resources/backgrounds/SpaceBackground-4.jpg',
    {
        min: 60,
        max: 240
    },
    [new Light(new Vector(925, 525), 1200, 'rgba(250,250,255,0.04)')],
    {
        min: 64,
        max: 1000
    }
);

let episodeController = {
    startDemo: 0,
    currentMap: 0,
    startGame: () => {
        episodeController.startDemo = setInterval(() => {
            currentMap.update();
        }, 16);
    },
    stopGame: (text) => {
        $('h3').text(text);
        clearInterval(startDemo);
    }
}

let startDemo;
function startGame() {
    startDemo = setInterval(() => {
        r.update();
    }, 16);
}
function stopGame(text) {
    $('h3').text(text);
    clearInterval(startDemo);
}
startGame();