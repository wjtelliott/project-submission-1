class spaceAsteroid extends spaceEntity {
    constructor(src, pos, vel, rot = 4) {
        super();
        this.image = new Image();
        this.image.src = src;
        this.position = this.getRandomSpawnPoint();
        this.target = pos;
        this.velocity = this.getTargetVelocity(this.position, this.target);
        this.velocity[0] *= vel;
        this.velocity[1] *= vel;
        this.rotation = 0;
        this.rotAdd = rot;
        this.removeFromMap = false;
        this.hurtPlayer = false;
        this.sourceWidth = this.sourceHeight = 32;
        this.sourceX = 32;
        this.sourceY = 0;
    }
    getRandomSpawnPoint() {
        //List of spawn points available for asteroids.
        //TODO Make this modular later
        return [
            [0, -32],
            [1200, -80],
            [1200, 400],
            [-20, 40],
            [-20, 600],
            [1200, 60],
            [1200, -16],
            [600, -16],
            [800, -16],
            [-20, -16]
        ][Math.floor(Math.random() * /*Have to use array length+1 here! =>*/11)]
    }
    checkCollision(lasers, playerPosition) {
        this.checkLaserCollision(lasers, -16) ? this.kill() : null;

        // BUG: Sometimes the playerPosition is null here???
        playerPosition != null ? this.checkPlayerCollision(playerPosition, -16) ? this.kill(true) : null : null;
    }
    update(lasers, playerPos) {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        
        // Playzone bounds
        if (this.position[0] < -250 || this.position[0] > 1400 || this.position[1] < -200 || this.position[1] > 900) this.kill();

        this.rotation = (this.rotation + this.rotAdd > 360) ? 0 : this.rotation + this.rotAdd;
        this.checkCollision(lasers, playerPos);
    }
    kill(hurt) {
        this.hurtPlayer = hurt ?? false;
        super.kill();
    }
}