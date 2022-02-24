class spaceEnemy extends spaceEntity{
    constructor(src, pos, vel) {
        super();
        this.image = new Image();
        this.image.src = src;
        this.position = pos;
        this.velocity = vel;
        this.removeFromMap = false;
        this.scoreWorth = this.velocity[1] * 5;
        this.hurtPlayer = false;
        this.inFormation = false;
        this.laser = null;

        this.sourceWidth = this.sourceHeight = 64;
        this.sourceX = this.sourceY = 128;
    }

    update(lasers, playerPosition, formationVelocity) {
        if (this.inFormation) {
            this.velocity = formationVelocity;
        } else {
            //flying in
            this.velocity[0] = Math.cos(this.position[1] / 10) * 5;
            if (this.position[1] >= 250) this.inFormation = true;
        }

        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];

        if (this.getRandom(0, 70) === 1)
            this.laser = new Laser('./assets/resources/misc/beams.png', [this.position[0] + 28, this.position[1] + 16], [0, 10], 55)

        this.checkCollision(lasers, playerPosition);

        if (this.position[1] >= 900) this.kill(true);
    }

    kill(hurtPlayer) {
        super.kill();
        this.hurtPlayer = hurtPlayer ?? false;
        {
            let audio = document.querySelector(`#enemyExplosion${Math.floor(Math.random() * 3) + 1}`);
            audio.volume = 0.1;
            audio.currentTime = 0;
            audio.play();
        }
    }

    checkCollision(lasers, playerPosition) {
        this.checkLaserCollision(lasers, 32) ? this.kill() : null;
        this.checkPlayerCollision(playerPosition, 32) ? this.kill(true) : null;
    }
}