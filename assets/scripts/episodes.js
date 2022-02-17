let e1m1 = new Room(
    './assets/resources/backgrounds/SpaceBackground-4.jpg',
    {
        min: 80,
        max: 240
    },
    [new Light(new Vector(925, 525), 1200, 'rgba(250,250,255,0.04)')],
    {
        min: 64,
        max: 1000
    },
    'e1m1',
    true,
    `Fight your way towards the alien planet! Use W, A, S, & D to fly your ship. Use Spacebar to shoot at oncoming enemies. Don't let them get past you!`
);

let e1m2 = new Room(
    './assets/resources/backgrounds/SpaceBackground-1.jpg',
    {
        min: 60,
        max: 240
    },
    [new Light(new Vector(893, 524), 1200, 'rgba(250,50,50,0.04)'), new Light(new Vector(800, 345), 1200, 'rgba(50,50,250,0.04)')],
    {
        min: 64,
        max: 1000
    },
    'e1m2',
    true,
    'You have lost track of your home star, but see enemy fighters in the distance.'
);

let e1m3 = new Room(
    './assets/resources/backgrounds/SpaceBackground-2.jpg',
    {
        min: 50,
        max: 200
    },
    [new Light(new Vector(613, 1050), 1200, 'rgba(1,200,1,0.04)')],
    {
        min: 64,
        max: 1000
    },
    'e1m3',
    false,
    'Your ship\'s autodeceleration correction controller has taken damage! You must control your own velocity manually.'
);

let e1m4 = new Room(
    './assets/resources/backgrounds/SpaceBackground-3.jpg',
    {
        min: 30,
        max: 100
    },
    [new Light(new Vector(425, 550), 1200, 'rgba(255,255,255,0.02)')],
    {
        min: 64,
        max: 1000
    },
    'e1m4',
    false,
    'Here is your last stand towards the enemy planet. Fight this wave to save your home world.'
);

let episodeController = {
    startDemo: 0,
    currentMap: 0,
    startGame: () => {
        episodeController.startDemo = setInterval(() => {
            episodeController.currentMap.isLoaded ? null : episodeController?.currentMap?.init?.();
            episodeController.currentMap.update();
        }, 16);
    },
    stopGame: (text) => {
        $('h3').text(text);
        $('h4').text('Congratualations!');
        clearInterval(episodeController.startDemo);
    },
    nextMap: (map) => {
        episodeController?.currentMap?.kill?.();
        if (map == null) {
            switch (episodeController.currentMap.toString()) {
                default:
                case 'e1m1': episodeController.currentMap = e1m2; return;
                case 'e1m2': episodeController.currentMap = e1m3; return;
                case 'e1m3': episodeController.currentMap = e1m4; return;
                case 'e1m4': episodeController.stopGame('You win!');
            }
        } else episodeController.currentMap = map;
    }
}
episodeController.nextMap(e1m1);
episodeController.startGame();