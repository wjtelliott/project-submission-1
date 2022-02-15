class Laser {
    constructor(src, pos = [0, 0], vel = [0, 0], life = 10, lType = 'default') {
        this.image = new Image();
        this.image.src = src;
        this.position = pos;
        this.velocity = vel;
        this.lifespan = life;

        this.laserType = lType;


        this.light = new Light(new Vector(this.position[0], this.position[1]), 200, 'rgba(250,1,250,.02)');
        lightController.lights.push(this.light);

    }
    update() {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];

        this.light.position.x = this.position[0] + 10;
        this.light.position.y = this.position[1] + 10;
        this.lifespan--;
    }

    kill() {
        lightController.lights = lightController.lights.filter(e => e !== this.light);
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