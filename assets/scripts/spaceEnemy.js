class spaceEnemy {
    constructor(src, pos, vel) {
        this.image = new Image();
        this.image.src = src;
        this.position = pos;
        this.velocity = vel;
        this.removeFromMap = false;
        this.scoreWorth = this.velocity[1] * 10;
        this.hurtPlayer = false;
    }

    update(lasers, playerPosition) {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        this.checkCollision(lasers, playerPosition);

        if (this.position[1] >= 900) this.kill(true);
    }

    getDistance(laserPosition) {
        // laserPosition will always be X as [0] and Y as [1], same as this.position / this.velocity
        if (laserPosition === null || this.position === null) return Infinity;
        let p1 = laserPosition[0] - (this.position[0] + 32);
        let p2 = laserPosition[1] - (this.position[1] + 32);
        return (p1 * p1) + (p2 * p2);
    }

    kill(hurtPlayer) {
        this.hurtPlayer = hurtPlayer ?? false;
        this.removeFromMap = true;
    }

    checkCollision(lasers, playerPosition) {
        lasers.forEach(e => {
            if (this.getDistance(e.position) < 2500) {
                this.kill();
                e.removeFromMap = (e.laserType !== 'red');
            }
        });
        if (this.getDistance(playerPosition) < 2500) this.kill(true);
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