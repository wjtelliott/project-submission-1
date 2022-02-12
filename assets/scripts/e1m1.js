class Room {
    constructor() {

        this.player = new Player();

        this.backgroundImage = new Image();
        this.backgroundImage.src = './assets/resources/backgrounds/SpaceBackground-2.jpg';


        this.lasers = [];

    }

    updateLasers() {
        return this.lasers.filter( e => {
            e.update();
            return (e.lifespan > 0)
        })
    }

    update() {
        this.player.update();

        while (this.player.lasers.length > 0) this.lasers.push(this.player.lasers.pop())

        this.lasers = this.updateLasers();

        this.draw();
    }

    

    draw() {

        spaceRender.clearDrawing();

        spaceRender.drawSerializedObject({
            image: this.backgroundImage,
            X: 0,
            Y: 0
        });


        this.lasers.forEach(e => spaceRender.drawSerializedObject(e.serializeObject()));

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