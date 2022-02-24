const e1m1 = () => new Room(
    './assets/resources/backgrounds/SpaceBackground-4.jpg', // Background image
    {
        min: 60, // Enemy min spawn rate
        max: 200 // Enemy max spawn rate
    },
    [new Light(new Vector(925, 525), 1100, 'rgba(250,250,255,0.04)', true)], // Initial lights
    {
        min: 100, // Enemy min spawn X coord
        max: 1000 // Enemy max spawn X coord
    },
    'e1m1', // map name
    true, // Player friction enabled
    
    // Map H3 tag description
    `Fight your way towards the alien planet! Use W, A, S, & D to fly your ship. Use Spacebar to shoot at oncoming enemies. Don't let them get past you!`,

    //Asteroid spawn rate, higher = slower
    240
);

const e1m2 = () => new Room(
    './assets/resources/backgrounds/SpaceBackground-1.jpg',
    {
        min: 50,
        max: 130
    },
    [new Light(new Vector(893, 524), 1100, 'rgba(250,50,50,0.04)', true), new Light(new Vector(800, 345), 1200, 'rgba(50,50,250,0.04)', true)],
    {
        min: 100,
        max: 1000
    },
    'e1m2',
    true,
    'You have lost track of your home star, but see enemy fighters in the distance.',
    240
);

const e1m3 = () => new Room(
    './assets/resources/backgrounds/SpaceBackground-2.jpg',
    {
        min: 40,
        max: 100
    },
    [new Light(new Vector(613, 1050), 1100, 'rgba(1,200,1,0.04)', true)],
    {
        min: 100,
        max: 1000
    },
    'e1m3',
    false,
    'Your ship\'s autodeceleration correction controller has taken damage! You must control your own velocity manually.',
    100
);

const e1m4 = () => new Room(
    './assets/resources/backgrounds/SpaceBackground-3.jpg',
    {
        min: 10,
        max: 50
    },
    [new Light(new Vector(425, 550), 1100, 'rgba(255,255,255,0.02)', true)],
    {
        min: 100,
        max: 1000
    },
    'e1m4',
    false,
    'Here is your last stand towards the enemy planet. Fight this wave to save your home world.',
    70
);

let episodeController = {
    startDemo: 0,
    currentMap: 0,
    frameStutters: 0,
    startGame: () => {
        episodeController.startDemo = setInterval(() => {
            episodeController?.currentMap?.isLoaded ? null : episodeController?.currentMap?.init?.();
            let start = new Date();
            episodeController?.currentMap?.update();
            let total = new Date().getTime() - start.getTime();
            if (Number(total) >= 10) episodeController.frameStutters++;
            if (episodeController.frameStutters > 20) episodeController.currentMap.disableLight = true;
        }, 16);
    },
    stopGame: (text) => {
        $('h3').text(text);
        $('h4').text(text.includes('Win') ? 'Congratualations!' : '');
        clearInterval(episodeController.startDemo);
    },
    nextMap: (map) => {
        episodeController?.currentMap?.kill?.();
        episodeController.frameStutters = 0;
        if (map == null) {
            switch (episodeController.currentMap.toString()) {
                default:
                case 'e1m1': episodeController.currentMap = e1m2(); return;
                case 'e1m2': episodeController.currentMap = e1m3(); return;
                case 'e1m3': episodeController.currentMap = e1m4(); return;
                case 'e1m4': episodeController.stopGame('You win!');
            }
        } else episodeController.currentMap = map;
    }
}
episodeController.nextMap(e1m1());
episodeController.startGame();