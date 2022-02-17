let e1m1 = new Room(
    './assets/resources/backgrounds/SpaceBackground-4.jpg',
    {
        min: 60,
        max: 240
    },
    [new Light(new Vector(925, 525), 1200, 'rgba(250,250,255,0.04)')],
    {
        min: 64,
        max: 1000
    },
    'e1m1'
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
    'e1m2'
);

let e1m3 = new Room(
    './assets/resources/backgrounds/SpaceBackground-2.jpg',
    {
        min: 60,
        max: 240
    },
    [new Light(new Vector(613, 1050), 1200, 'rgba(1,200,1,0.04)')],
    {
        min: 64,
        max: 1000
    },
    'e1m3'
);

let e1m4 = new Room(
    './assets/resources/backgrounds/SpaceBackground-3.jpg',
    {
        min: 60,
        max: 240
    },
    [new Light(new Vector(425, 550), 1200, 'rgba(255,255,255,0.02)')],
    {
        min: 64,
        max: 1000
    },
    'e1m4'
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