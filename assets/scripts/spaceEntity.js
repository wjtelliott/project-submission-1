class spaceEntity {
    constructor() {

    }
    kill() {
        this.removeFromMap = true;
    }
    checkLaserCollision(lasers, offset, collisionDistance = 2500) {
        let collision = false;
        lasers?.forEach(e => {
            if (this.getDistance(e.position, offset) < collisionDistance) {
                collision = true;
                e.removeFromMap = (e.laserType !== 'red');
            }
        });
        return collision;
    }

    checkPlayerCollision = (playerPosition, offset, collisionDistance = 2500) => this.getDistance(playerPosition, offset) < collisionDistance


    getDistance(objectPosition, offset) {
        // objectPosition will always be X as [0] and Y as [1], same as this.position / this.velocity
        if (objectPosition === null || this.position === null) return Infinity;
        let p1 = objectPosition[0] - ((this.position?.[0] ?? this.X) + offset);
        let p2 = objectPosition[1] - ((this.position?.[1] ?? this.Y) + offset);
        return (p1 * p1) + (p2 * p2);
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

    serializeObject() {
        return {
            image: this.image,
            // Some objects use this.position, some use this.X / Y
            // TODO: Uniform this
            X: this.position?.[0] ?? this.X,
            Y: this.position?.[1] ?? this.Y,
            sourceX: this.sourceX,
            sourceY: this.sourceY,
            sourceWidth: this.sourceWidth,
            sourceHeight: this.sourceHeight
        }
    }
    serializeLightMap() {
        return {
            position: {
                x: this.position?.[0] ?? this.X,
                y: this.position?.[1] ?? this.Y
            },
            width: this.sourceWidth,
            height: this.sourceHeight
        }
    }
    getRandom = (min, max) => Math.floor(Math.random() * max + 1) + min;
}