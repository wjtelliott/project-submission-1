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
        this.enemyLasers = [];

        // Enemy spawn rates & positioning
        this.newEnemyCounterMax = enemySpawnRates.max;
        this.newEnemyCounterMin = enemySpawnRates.min;
        this.newEnemyCounterCurrent = 0;
        this.newEnemySpawnTimer = this.newEnemyCounterMax;

        this.enemySpawnPositions = enemySpawnPos;

        this.lights = startingLights;

        this.isLoaded = false;

        this.mapName = name;

        

        this.formationPattern = [
            [2, 0],
            [0, 0.3],
            [-2, 0],
            [0, 0.3]
        ];
        this.formationCounterMax = 50;
        this.formationCounter = 0;
        this.currentFormation = 0;
    }


    mapDialog = text => $('#gameInfo').text(text);

    init() {
        this.isLoaded = true;
        lightController.lights = this.lights;
        this.player.hurt(0);
        this.player.addScore(0);
        (this.mapDialogText != null) ? this.mapDialog(this.mapDialogText) : null;
    }

    updateLasers(lasersArr) {
        return lasersArr.filter( e => {
            e.update();
            if (e.lifespan < 0 || e.removeFromMap) {
                e.kill();
                return false;
            } else return true;
        })
    }

    spawnNewEnemy = () => this.enemies.push(new spaceEnemy('./assets/resources/player/shipsall.gif', [Math.random() * this.enemySpawnPositions.max + this.enemySpawnPositions.min, -64], [0, Math.min(2, Math.random() * 4)]));

    addNewParticle = (location) => {
        let newPart = new Particle(Math.max(1, Math.floor(Math.random() * 4)), 196, 190, true);
        newPart.setPosition(location);
        particleController.particles.push(newPart);
    }

    kill() {
        this.enemies = [];
        lightController.lights = [];
        particleController.particles = [];
    }


    toString = () => this.mapName;

    update() {


        this.formationCounter = (this.formationCounter + 1 > this.formationCounterMax) ? 0 : this.formationCounter + 1;
        if (this.formationCounter === 0) {
            this.currentFormation = (this.currentFormation + 1 >= this.formationPattern.length) ? 0 : this.currentFormation + 1;
        }

        this.player.update(this.enemyLasers);

        this.newEnemyCounterCurrent++;
        if (this.newEnemyCounterCurrent > this.newEnemySpawnTimer) {
            this.newEnemyCounterCurrent = 0;
            this.newEnemySpawnTimer = Math.max(this.newEnemyCounterMin, Math.random() * this.newEnemyCounterMax);
            this.spawnNewEnemy();
        }

        


        while (this.player.lasers.length > 0) this.lasers.push(this.player.lasers.pop())

        this.lasers = this.updateLasers(this.lasers);
        
        this.enemies = this.enemies.filter(e => {
            e.update(this.lasers, [this.player.X, this.player.Y], this.formationPattern[this.currentFormation]);
            if (e.removeFromMap) {
                e.hurtPlayer ? this.player.hurt(1) : this.player.addScore(e.scoreWorth);
                this.addNewParticle([e.position[0] - 70, e.position[1] - 70]);
                return false;
            } else {
                if (e.laser !== null) {
                    this.enemyLasers.push(e.laser);
                    e.laser = null;
                }
            }
            return true;
        });

        this.enemyLasers = this.updateLasers(this.enemyLasers);

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

        this.enemyLasers.forEach(e => spaceRender.drawSerializedObject(e.serializeObject()));

        this.enemies.forEach(e=>spaceRender.drawSerializedObject(e.serializeObject()));

        particleController.draw();

        spaceRender.drawSerializedObject(this.player.serializeObject());
    }
}
