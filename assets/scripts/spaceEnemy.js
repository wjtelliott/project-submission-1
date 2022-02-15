class spaceEnemy {
    constructor(src, pos, vel) {
        this.image = new Image();
        this.image.src = src;
        this.position = pos;
        this.velocity = vel;
        this.removeFromMap = false;
        this.scoreWorth = this.velocity[1] * 10;
    }

    update(lasers) {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        this.checkCollision(lasers);
    }

    getDistance(laserPosition) {
        if (laserPosition === null || this.position === null) return Infinity;
        let p1 = laserPosition[0] - (this.position[0] + 32);
        let p2 = laserPosition[1] - (this.position[1] + 32);
        return (p1 * p1) + (p2 * p2);
    }

    kill() {
        this.removeFromMap = true;
    }

    checkCollision(lasers) {
        lasers.forEach(e => {
            if (this.getDistance(e.position) < 2500) {
                this.kill();
                e.removeFromMap = (e.laserType !== 'red');
            }
        });
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