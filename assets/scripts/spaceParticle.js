const PARTICLE_IMAGE_1 = Object.assign(new Image(), {src: './assets/resources/misc/explosion_01_strip13.png'});
const PARTICLE_IMAGE_2 = Object.assign(new Image(), {src: './assets/resources/misc/explosion_02_strip13.png'});
const PARTICLE_IMAGE_3 = Object.assign(new Image(), {src: './assets/resources/misc/explosion_03_strip13.png'});
const PARTICLE_STARDUST = Object.assign(new Image(), {src: './assets/resources/misc/flare_0.png'});

class Particle extends spaceEntity {
    constructor(sprite, width = 1, height = 1, animates = false) {
        super();
        switch (sprite) {
            default:
            case 1: this.image = PARTICLE_IMAGE_1; break;
            case 2: this.image = PARTICLE_IMAGE_2; break;
            case 3: this.image = PARTICLE_IMAGE_3; break;
            case 4:
                this.image = PARTICLE_STARDUST;
                this.velocity = [0, 7]
                break;
        }
        this.width = width;
        this.height = height;
        this.isAnimated = animates;
        this.position = [0, 0];
        this.removeFromMap = false;
        if (this.isAnimated) {
            this.animationCounter = 0;
            this.animationCounterMax = 4;
            this.frame = 0;
            this.maxFrames = 13;//this.image.width / this.width;
            this.width = this.image.width / this.maxFrames;
            this.light = new spaceLight(new Vector(this.position[0], this.position[1]), 125, 'rgba(100, 0, 0, 0.2)');
            this.light.isExplosive = true;
        }
    }

    // This should be moved to construction!!!
    setPosition = newPos => {
        this.position = newPos;
        if (this.light != null) {
            this.light.position = new Vector(this.position[0] + 96, this.position[1] + 96);
            lightController.lights.push(this.light);
        }
    }

    update() {
        if (this.isAnimated) {
            this.animationCounter = (this.animationCounter + 1 > this.animationCounterMax) ? 0 : this.animationCounter + 1;
            this.frame = (this.animationCounter === 0) ? (this.frame + 1 > this.maxFrames) ? -1 : this.frame + 1 : this.frame;
        }
        if (this.frame === -1) this.kill();
        if (this.position[1] > 800) this.kill();
        if (this.velocity != null) this.position[1] += this.velocity[1];
    }
}

let particleController = {
    particles: [],
    update: () => {
        for (let i = 0; i < particleController.particles.length; i++) particleController.particles[i].update();
        particleController.filterParticles();
    },
    filterParticles: () => particleController.particles = particleController.particles.filter(e => !e.removeFromMap),
    draw: () => {
        particleController.particles.forEach(e => spaceRender.drawSerializedObject(e.serializeObject()));
    }
}