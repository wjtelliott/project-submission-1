class Room {
    constructor() {

        this.player = new Player();

        this.backgroundImage = new Image();
        this.backgroundImage.src = './assets/resources/backgrounds/SpaceBackground-4.jpg';


        this.lasers = [];


        this.enemies = [];
        this.enemies.push(new spaceEnemy('./assets/resources/player/shipsall.gif', [50, 50], [0, .5]));
    }

    updateLasers() {
        return this.lasers.filter( e => {
            e.update();
            if (e.lifespan < 0 || e.removeFromMap) {
                e.kill();
                return false;
            } else return true;
        })
    }

    update() {
        this.player.update();

        while (this.player.lasers.length > 0) this.lasers.push(this.player.lasers.pop())

        this.lasers = this.updateLasers();
        
        this.enemies = this.enemies.filter(e => {
            e.update(this.lasers);
            return !e.removeFromMap;
        });

        this.draw();
    }

    

    draw() {

        spaceRender.clearDrawing();


        spaceRender.drawSerializedObject({
            image: this.backgroundImage,
            X: 0,
            Y: 0
        });

        lightController.draw(spaceRender.context);


        this.lasers.forEach(e => spaceRender.drawSerializedObject(e.serializeObject()));


        this.enemies.forEach(e=>spaceRender.drawSerializedObject(e.serializeObject()));

        

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