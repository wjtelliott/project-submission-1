class spaceEnemy {
    constructor(src, pos, vel) {
        this.image = new Image();
        this.image.src = src;
        this.position = pos;
        this.velocity = vel;
        this.removeFromMap = false;
        this.scoreWorth = this.velocity[1];
        this.hurtPlayer = false;
        this.inFormation = false;
        this.laser = null;
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

        if (Math.floor(Math.random() * 3) === 1) {
            this.laser = new Laser('./assets/resources/misc/beams.png', [this.position[0] + 28, this.position[1] + 16], [0, 10], 55)
        }

        this.checkCollision(lasers, playerPosition);

        if (this.position[1] >= 900) this.kill(true);
    }

    getDistance(objectPosition) {
        // objectPosition will always be X as [0] and Y as [1], same as this.position / this.velocity
        if (objectPosition === null || this.position === null) return Infinity;
        let p1 = objectPosition[0] - (this.position[0] + 32);
        let p2 = objectPosition[1] - (this.position[1] + 32);
        return (p1 * p1) + (p2 * p2);
    }

    kill(hurtPlayer) {
        this.hurtPlayer = hurtPlayer ?? false;
        this.removeFromMap = true;
    }

    checkCollision(lasers, playerPosition, collisionDistance = 2500) {
        lasers.forEach(e => {
            if (this.getDistance(e.position) < collisionDistance) {
                this.kill();
                e.removeFromMap = (e.laserType !== 'red');
            }
        });
        if (this.getDistance(playerPosition) < collisionDistance) this.kill(true);
    }

    serializeObject() {
        return {
            image: this.image,
            X: this.position[0],
            Y: this.position[1],
            sourceX: 128,
            sourceY: 128,
            sourceWidth: 64,
            sourceHeight: 64
        }
    }

    serializeLightMap() {
        return {
            position: {
                x: this.position[0],
                y: this.position[1]
            },
            width: 64,
            height: 64
        }
    }
}