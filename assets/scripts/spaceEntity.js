class spaceEntity {

    /**
     * Each object should construct its' own properties.
     * We will need certain ones to be undefined to determine which way to serialize objects later
     */
    constructor() {

    }



    /**
     * Call this if we want to remove an object from the map
     */
    kill() {
        this.removeFromMap = true;
        if (this.light != null)
            lightController.lights = lightController.lights.filter(e => e !== this.light);
    }


    /**
     * Collision detection methods
     */
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



    /**
     * Player movement methods
     */
    clampPlayerInPlayerzone() {
        if (this.velocity.X + this.X > PLAYZONE_X[1]) this.X = PLAYZONE_X[1]
        else if (this.velocity.X + this.X < PLAYZONE_X[0]) this.X = PLAYZONE_X[0]

        if (this.velocity.Y + this.Y > PLAYZONE_Y[1]) this.Y = PLAYZONE_Y[1]
        else if (this.velocity.Y + this.Y < PLAYZONE_Y[0]) this.Y = PLAYZONE_Y[0]
    }

    clampVelocity(maxValue = PLAYER_MAX_SPEED) {
        this.velocity.X = (this.velocity.X > 0) ?
            (this.velocity.X > maxValue) ? maxValue : this.velocity.X
            :
            (this.velocity.X < -(maxValue)) ? -maxValue : this.velocity.X;
        this.velocity.Y = (this.velocity.Y > 0) ?
            (this.velocity.Y > maxValue) ? maxValue : this.velocity.Y
            :
            (this.velocity.Y < -(maxValue)) ? -maxValue : this.velocity.Y;
    }

    friction(frictionValue = PLAYER_FRICTION) {
        this.velocity.X = (this.velocity.X > 0) ?
            (this.velocity.X - frictionValue < 0) ? 0 : this.velocity.X - frictionValue
            :
            (this.velocity.X + frictionValue > 0) ? 0 : this.velocity.X + frictionValue;
        this.velocity.Y = (this.velocity.Y > 0) ?
            (this.velocity.Y - frictionValue < 0) ? 0 : this.velocity.Y - frictionValue
            :
            (this.velocity.Y + frictionValue > 0) ? 0 : this.velocity.Y + frictionValue;
    }

    /**
     * Object & light serialization
     */
    serializeObject() {
        return (this.isAnimated) ? {
            image: this.image,
            X: this.position[0],
            Y: this.position[1],
            sourceX: this.width * this.frame,
            sourceY: 0,
            sourceWidth: this.width,
            sourceHeight: this.height
        } : (this.isAnimated !== undefined) ? {
            image: this.image,
            X: this.position[0],
            Y: this.position[1],
            width: this.width,
            height: this.height
        } : (this.getLaserProperties !== undefined) ? {
            ...this.getLaserProperties(),
            image: this.image,
            X: this.position[0],
            Y: this.position[1]
        } : {
            image: this.image,
            // Some objects use this.position, some use this.X / Y in this method
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
                // Some objects use this.position, some use this.X / Y in this method
                // TODO: Uniform this
                x: this.position?.[0] ?? this.X,
                y: this.position?.[1] ?? this.Y
            },
            width: this.sourceWidth,
            height: this.sourceHeight
        }
    }

    /**
     * Sounds
     */
    playSound(snd, restart) {
        let audio = document.querySelector(snd);
        if (audio == null) return;
        audio.volume = 0.1;
        if (restart) audio.currentTime = 0;
        audio.play();
    }
    isSoundPlaying = snd => document.querySelector(snd)?.currentTime > 0


    /**
     * Utility
     */

    normalizeVector(vector2) {
        // fast inverse needed?
        const length = 1 / Math.sqrt((vector2[0] * vector2[0]) + (vector2[1] * vector2[1]));
        return [vector2[0] *= length, vector2[1] *= length];
    }

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

    getRandom = (min, max) => Math.floor(Math.random() * max + 1) + min;
}