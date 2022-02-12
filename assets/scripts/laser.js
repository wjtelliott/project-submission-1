class Laser {
    constructor(pos = [0, 0], vel = [0, 0], src) {
        this.image = new Image();
        this.image.src = src;
        this.position = pos;
        this.velocity = vel;
    }
    update() {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
    }
    serializeObject() {
        return {
            image: this.image,
            X: this.position[0],
            Y: this.position[1]
        }
    }
}