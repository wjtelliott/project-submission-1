class Room {
    constructor(backgroundImagePath, enemySpawnRates, startingLights, enemySpawnPos, name, friction, dialog) {

        // Create our player
        this.player = new Player();

        this.mapDialogText = dialog;

        this.player.useFriction = friction;

        // Background images
        this.backgroundImage = new Image();
        this.backgroundImage.src = backgroundImagePath;//'./assets/resources/backgrounds/SpaceBackground-4.jpg';


        // Laser and enemies
        this.lasers = [];
        this.enemies = [];

        // Enemy spawn rates & positioning
        this.newEnemyCounterMax = enemySpawnRates.max;
        this.newEnemyCounterMin = enemySpawnRates.min;
        this.newEnemyCounterCurrent = 0;
        this.newEnemySpawnTimer = this.newEnemyCounterMax;

        this.enemySpawnPositions = enemySpawnPos;

        this.lights = startingLights;

        this.isLoaded = false;

        this.mapName = name;
    }


    mapDialog = text => $('#gameInfo').text(text);

    init() {
        this.isLoaded = true;
        lightController.lights = this.lights;
        this.player.hurt(0);
        this.player.addScore(0);
        (this.mapDialogText != null) ? this.mapDialog(this.mapDialogText) : null;
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

    spawnNewEnemy = () => this.enemies.push(new spaceEnemy('./assets/resources/player/shipsall.gif', [Math.random() * this.enemySpawnPositions.max + this.enemySpawnPositions.min, -64], [0, Math.random() * 4]));

    addNewParticle = (location) => {
        let newPart = new Particle('./assets/resources/misc/explosion_01_strip13.png', 196, 190, true);
        newPart.position = location;
        particleController.particles.push(newPart);
    }

    kill() {
        this.enemies = [];
        lightController.lights = [];
        particleController.particles = [];
    }


    toString = () => this.mapName;

    update() {
        this.player.update();

        this.newEnemyCounterCurrent++;
        if (this.newEnemyCounterCurrent > this.newEnemySpawnTimer) {
            this.newEnemyCounterCurrent = 0;
            this.newEnemySpawnTimer = Math.max(this.newEnemyCounterMin, Math.random() * this.newEnemyCounterMax);
            this.spawnNewEnemy();
        }

        


        while (this.player.lasers.length > 0) this.lasers.push(this.player.lasers.pop())

        this.lasers = this.updateLasers();
        
        this.enemies = this.enemies.filter(e => {
            e.update(this.lasers, [this.player.X, this.player.Y]);
            if (e.removeFromMap) {
                e.hurtPlayer ? this.player.hurt(1) : this.player.addScore(e.scoreWorth);
                this.addNewParticle([e.position[0] - 70, e.position[1] - 70]);
                return false;
            };
            return true;
        });

        particleController.update();

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

        particleController.draw();

        spaceRender.drawSerializedObject(this.player.serializeObject());
    }
}
