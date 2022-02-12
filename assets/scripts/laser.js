class Laser {
    constructor(src, pos = [0, 0], vel = [0, 0], life = 10, lType = 'default') {
        this.image = new Image();
        this.image.src = src;
        this.position = pos;
        this.velocity = vel;
        this.lifespan = life;

        this.laserType = lType;
    }
    update() {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        this.lifespan--;
    }

    getLaserProperties() {
        switch (this.laserType) {
            case 'default':
            default: return {
                sourceX: 117,
                sourceY: 59,
                sourceWidth: 18,
                sourceHeight: 32
            }
        }
    }

    serializeObject() {
        return {
            ...this.getLaserProperties(),
            image: this.image,
            X: this.position[0],
            Y: this.position[1]
        }
    }
}