class spaceAsteroid {
    constructor(src, pos, vel, rot = 4) {
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
    getTargetVelocity(currentPosition, targetPosition) {
        let deltaX = targetPosition[0] - currentPosition[0];
        let deltaY = targetPosition[1] - currentPosition[1];
        return this.normalizeVector([deltaX, deltaY]);
    }
    normalizeVector(vector2) {
        // fast inverse needed?
        const length = 1 / Math.sqrt((vector2[0] * vector2[0]) + (vector2[1] * vector2[1]));
        return [vector2[0] *= length, vector2[1] *= length];
    }
    getDistance(objectPosition) {
        // objectPosition will always be X as [0] and Y as [1], same as this.position / this.velocity
        if (objectPosition === null || this.position === null) return Infinity;
        let p1 = objectPosition[0] - (this.position[0] - 16);
        let p2 = objectPosition[1] - (this.position[1] - 16);
        return (p1 * p1) + (p2 * p2);
    }
    checkCollision(lasers, playerPosition, collisionDistance = 2500) {
        lasers?.forEach(e => {
            if (this.getDistance(e.position) < collisionDistance) {
                this.kill();
                e.removeFromMap = (e.laserType !== 'red');
            }
        });
        if (playerPosition == null) return;
        if (this.getDistance(playerPosition) < collisionDistance) this.kill(true);
    }
    update(lasers, playerPos) {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        if (this.position[0] < -250 || this.position[0] > 1400 || this.position[1] < -200 || this.position[1] > 900) this.kill();
        this.rotation = (this.rotation + this.rotAdd > 360) ? 0 : this.rotation + this.rotAdd;

        //console.log(lasers);
        this.checkCollision(lasers, playerPos);
    }
    kill(hurt) {
        this.hurtPlayer = hurt ?? false;
        this.removeFromMap = true;
    }
    serializeObject() {
        return {
            image: this.image,
            X: this.position[0],
            Y: this.position[1],
            sourceX: 32,
            sourceY: 0,
            sourceWidth: 32,
            sourceHeight: 32,
            rotate: this.rotation
        };
    }
    serializeLightMap() {
        return {
            position: {
                x: this.position[0],
                y: this.position[1]
            },
            width: 32,
            height: 32
        };
    }
}