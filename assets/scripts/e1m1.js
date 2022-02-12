class Room {
    constructor() {

        this.player = new Player();

        this.backgroundImage = new Image();
        this.backgroundImage.src = './assets/resources/backgrounds/SpaceBackground-2.jpg';

    }

    update() {
        this.player.update();
        this.draw();
    }

    draw() {

        spaceRender.clearDrawing();

        spaceRender.drawSerializedObject({
            image: this.backgroundImage,
            X: 0,
            Y: 0
        });

        spaceRender.drawSerializedObject(this.player.serializeObject());
    }
}

let r = new Room();

let startDemo;
function startGame() {
    startDemo = setInterval(() => {
        r.update();
    }, 16);
}
function stopGame() {
    clearInterval(startDemo);
}
startGame();