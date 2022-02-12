class Laser {
    constructor(src, pos = [0, 0], vel = [0, 0], life = 10) {
        this.image = new Image();
        this.image.src = src;
        this.position = pos;
        this.velocity = vel;
        this.lifespan = life;
    }
    update() {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        this.lifespan--;
    }
    serializeObject() {
        return {
            image: this.image,
            X: this.position[0],
            Y: this.position[1]
        }
    }
}