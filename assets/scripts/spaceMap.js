class spaceRoom {
    constructor(backgroundImagePath, enemySpawnRates, startingLights, enemySpawnPos, name, friction, dialog, asteroidSpawn) {

        // Create our player
        this.player = new spacePlayer();
        this.player.useFriction = friction;

        // Map properties
        this.mapDialogText = dialog;
        this.isLoaded = false;
        this.mapName = name;
        this.disableLight = false;
        this.backgroundOffset = 0;
        this.lights = startingLights;


        // Background images
        this.backgroundImage = new Image();
        this.backgroundImage.src = backgroundImagePath;//'./assets/resources/backgrounds/SpaceBackground-4.jpg';


        // Laser and enemies
        this.lasers = [];
        this.enemies = [];
        this.enemyLasers = [];
        this.asteroids = [];
        this.asteroidSpawnRate = asteroidSpawn

        // Enemy spawn rates & positioning
        this.newEnemyCounterMax = enemySpawnRates.max;
        this.newEnemyCounterMin = enemySpawnRates.min;
        this.newEnemyCounterCurrent = 0;
        this.newEnemySpawnTimer = this.newEnemyCounterMax;
        this.enemySpawnPositions = enemySpawnPos;

        // Velocities for after enemies are in formation
        this.formationPattern = [
            [2, 0],
            [0, 0.3],
            [-2, 0],
            [0, 0.3]
        ];
        this.formationCounterMax = 50;
        this.formationCounter = 0;

        // Used for index of formationPattern
        this.currentFormation = 0;
    }

    /**
     * Do not call immediately after construction. Call this on the first frame of play for this Room.
     */
    init() {
        this.isLoaded = true;
        lightController.lights = this.lights;
        this.player.hurt(0);
        this.player.addScore(0);
        (this.mapDialogText != null) ? this.mapDialog(this.mapDialogText) : null;
    }

    /**
     * Generic Map Properties
     */
    mapDialog = text => $('#gameInfo').text(text);
    toString = () => this.mapName;


    /**
     * Update and check for removing an object array from the map.
     * Despite the function name, This will work with any object array that has a removeFromMap or lifespan property.
     * @param {any[]} lasersArr 
     * @returns 
     */
    updateLasers(lasersArr) {
        return lasersArr.filter( e => {
            e.update();
            if (e.lifespan < 0 || e.removeFromMap) {
                e.kill();
                return false;
            } else return true;
        })
    }

    /**
     * Spawn new map objects
     */
    spawnNewEnemy = () => this.enemies.push(new spaceEnemy('./assets/resources/player/shipsall.gif', [Math.random() * this.enemySpawnPositions.max + this.enemySpawnPositions.min, -64], [0, Math.min(2, Math.random() * 4)]));
    spawnNewAsteroid = () => this.asteroids.push(new spaceAsteroid('./assets/resources/player/ships_asteroids.png', [Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 800) + 100], 2.5));
    addNewParticle = (location) => {
        let newPart = new Particle(Math.max(1, Math.floor(Math.random() * 4)), 196, 190, true);
        newPart.setPosition(location);
        particleController.particles.push(newPart);
    }
    addNewStarEffect = () => {

        if (Math.floor(Math.random() * this.asteroidSpawnRate) !== 1) return;

        let newPart = new Particle(4, 32, 32, false);
        newPart.setPosition([Math.max(32, Math.floor(Math.random() * 1200)), 0])
        particleController.particles.push(newPart);

    }

    /**
     * Map un-load
     */
    kill() {
        this.enemies = [];
        lightController.lights = [];
        particleController.particles = [];
        this.isLoaded = false;
    }


    /**
     * Map logic updating
     */
    update() {

        // Move background
        this.backgroundOffset = (this.backgroundOffset + 1 > this.backgroundImage.height) ? 0 : this.backgroundOffset + 1;

        // Tick up formation, and set formation velocity
        this.formationCounter = (this.formationCounter + 1 > this.formationCounterMax) ? 0 : this.formationCounter + 1;
        if (this.formationCounter === 0)
            this.currentFormation = (this.currentFormation + 1 >= this.formationPattern.length) ? 0 : this.currentFormation + 1;
        

        // Player logic
        this.player.update(this.enemyLasers);
        // Grab player-created laser in player object and move it to the map spaceLaser[]
        // This could be cleaner
        while (this.player.lasers.length > 0) this.lasers.push(this.player.lasers.pop())

        // Check for new enemy spawn
        this.newEnemyCounterCurrent++;
        if (this.newEnemyCounterCurrent > this.newEnemySpawnTimer) {
            this.newEnemyCounterCurrent = 0;
            this.newEnemySpawnTimer = Math.max(this.newEnemyCounterMin, Math.random() * this.newEnemyCounterMax);
            this.spawnNewEnemy();
        }

        // Asteroid spawning
        if (Math.floor(Math.random() * 70) === 1) this.spawnNewAsteroid();
    
        // Star particle spawning
        this.addNewStarEffect();        

        // Update enemy ships
        this.enemies = this.enemies.filter(e => {
            e.update(this.lasers, [this.player.X, this.player.Y], this.formationPattern[this.currentFormation]);
            if (e.removeFromMap) {
                e.hurtPlayer ? this.player.hurt(1) : this.player.addScore(e.scoreWorth);

                // TODO: Make the explosion offset modular
                this.addNewParticle([e.position[0] - 70, e.position[1] - 70]);
                return false;
            } else {
                if (e.laser !== null) {
                    // If the enemy fired a laser, move it to the enemy laser []
                    this.enemyLasers.push(e.laser);
                    e.laser = null;
                }
            }
            return true;
        });

        // Move map lights with background... ehhh don't like this approach.
        // lightController.lights.forEach( e => {
        //     if (e.isMapLight) {
        //         e.position.y = this.backgroundOffset;
        //     }
        // })

        // Update asteroids
        this.asteroids.forEach( e => {
            e.update(this.lasers, [this.player.X, this.player.Y])
            // We can give score to player here by replacing null if we want to in the future
            e.hurtPlayer ? this.player.hurt(1) : null;
        });


        // Update our lasers and asteroids
        this.lasers = this.updateLasers(this.lasers);
        this.asteroids = this.updateLasers(this.asteroids);
        this.enemyLasers = this.updateLasers(this.enemyLasers);

        particleController.update();

        this.draw();
    }

    


    draw() {


        // We need to batch all this drawing somehow



        spaceRender.clearDrawing();

        /**
         * Draw two background images with one offset by the height of itself.
         * When Y === the image height, jump it back to 0 to create a moving illusion
         */
        spaceRender.drawSerializedObject({
            image: this.backgroundImage,
            X: 0,
            Y: this.backgroundOffset
        });
        spaceRender.drawSerializedObject({
            image: this.backgroundImage,
            X: 0,
            Y: this.backgroundOffset - this.backgroundImage.height
        });

        if (!this.disableLight) lightController.draw(spaceRender.context);

        this.lasers.forEach(e => spaceRender.drawSerializedObject(e.serializeObject()));

        this.enemyLasers.forEach(e => spaceRender.drawSerializedObject(e.serializeObject()));

        this.enemies.forEach(e=>spaceRender.drawSerializedObject(e.serializeObject()));

        particleController.draw();

        this.asteroids.forEach( e=> spaceRender.drawSerializedObject(e.serializeObject()));

        spaceRender.drawSerializedObject(this.player.serializeObject());


        // Draw this last
        this.player.drawUI(spaceRender.context);
        
    }
}
