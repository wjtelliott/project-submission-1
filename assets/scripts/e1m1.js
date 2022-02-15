class Room {
    constructor() {

        this.player = new Player();

        this.backgroundImage = new Image();
        this.backgroundImage.src = './assets/resources/backgrounds/SpaceBackground-4.jpg';


        this.lasers = [];


        this.newEnemyCounter = 240;
        this.newEnemyCounterCurrent = 0;


        this.enemies = [];
        this.enemies.push(new spaceEnemy('./assets/resources/player/shipsall.gif', [550, 10], [0, .3]));
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

    spawnNewEnemy() {

        this.enemies.push(new spaceEnemy('./assets/resources/player/shipsall.gif', [Math.random() * 1000, -64], [0, Math.random() * 4]))

    }

    update() {
        this.player.update();

        this.newEnemyCounterCurrent++;
        if (this.newEnemyCounterCurrent > this.newEnemyCounter) {
            this.newEnemyCounterCurrent = 0;
            this.newEnemyCounter = Math.max(60, Math.random() * 240);
            this.spawnNewEnemy();
        }

        


        while (this.player.lasers.length > 0) this.lasers.push(this.player.lasers.pop())

        this.lasers = this.updateLasers();
        
        this.enemies = this.enemies.filter(e => {
            e.update(this.lasers);
            if (e.removeFromMap) {
                this.player.addScore(e.scoreWorth);
                return false;
            };
            return true;
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