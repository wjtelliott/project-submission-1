const LASERS_HAVE_LIGHTS = false;


class Laser extends spaceEntity {
    constructor(src, pos = [0, 0], vel = [0, 0], life = 10, lType = 'default') {
        super();
        this.image = new Image();
        this.image.src = src;
        this.position = pos;
        this.velocity = vel;
        this.lifespan = life;

        this.laserType = lType;


        // False for saving computation time
        if (LASERS_HAVE_LIGHTS) {
            if (this.laserType === 'red') this.light = new Light(new Vector(this.position[0] + 21, this.position[1] + 50), 200, 'rgba(250,1,1,.04)');
            else this.light = new Light(new Vector(this.position[0] + 9, this.position[1] + 16), 200, 'rgba(250,1,250,.02)');
            lightController.lights.push(this.light);
        }

    }
    update() {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];

        if (this.light != null) {
            this.light.position.x += this.velocity[0];
            this.light.position.y += this.velocity[1];
        }
        
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
            case 'red': return {
                sourceX: 213,
                sourceY: 306,
                sourceWidth: 43,
                sourceHeight: 98
            }
        }
    }
}