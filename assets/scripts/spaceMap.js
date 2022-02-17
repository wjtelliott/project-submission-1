class Room {
    constructor(backgroundImagePath, enemySpawnRates, startingLights, enemySpawnPos, name) {

        // Create our player
        this.player = new Player();

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

    init() {
        this.isLoaded = true;
        lightController.lights = this.lights;
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

    kill() {
        this.enemies = [];
        lightController.lights = [];
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
            e.update(this.lasers);
            if (e.removeFromMap) {
                e.hurtPlayer ? this.player.hurt(1) : this.player.addScore(e.scoreWorth);
                
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
