const PARTICLE_IMAGE_1 = Object.assign(new Image(), {src: './assets/resources/misc/explosion_01_strip13.png'});
const PARTICLE_IMAGE_2 = Object.assign(new Image(), {src: './assets/resources/misc/explosion_02_strip13.png'});
const PARTICLE_IMAGE_3 = Object.assign(new Image(), {src: './assets/resources/misc/explosion_03_strip13.png'});

class Particle {
    constructor(sprite, width = 1, height = 1, animates = false) {
        switch (sprite) {
            default:
            case 1: this.image = PARTICLE_IMAGE_1; break;
            case 2: this.image = PARTICLE_IMAGE_2; break;
            case 3: this.image = PARTICLE_IMAGE_3; break;
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
        }
    }

    setPosition = newPos => this.position = newPos; 

    kill() {
        this.removeFromMap = true;
    }

    update() {
        if (this.isAnimated) {
            this.animationCounter = (this.animationCounter + 1 > this.animationCounterMax) ? 0 : this.animationCounter + 1;
            this.frame = (this.animationCounter === 0) ? (this.frame + 1 > this.maxFrames) ? -1 : this.frame + 1 : this.frame;
        }
        if (this.frame === -1) this.kill();
    }

    serializeObject() {
        return (this.isAnimated) ? {
            image: this.image,
            X: this.position[0],
            Y: this.position[1],
            sourceX: this.width * this.frame,
            sourceY: 0,
            sourceWidth: this.width,
            sourceHeight: this.height
        } : {
            image: this.image,
            X: this.position[0],
            Y: this.position[1],
        }
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