class spaceAsteroid {
    constructor(src, pos, vel, rot = 2) {
        this.image = new Image();
        this.image.src = src;
        this.position = pos;
        this.velocity = vel;
        this.rotation = 0;
        this.rotAdd = rot;
        this.removeFromMap = false;
    }
    update() {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        if (this.position[0] < -250 || this.position[0] > 1400 || this.position[1] < -200 || this.position[1] > 900) this.kill();
        this.rotation = (this.rotation + this.rotAdd > 360) ? 0 : this.rotation + this.rotAdd;
    }
    kill() {
        this.removeFromMap = true;
    }
    serializeObject() {
        return {
            image: this.image,
            X: this.position[0],
            Y: this.position[1],
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 64,
            sourceHeight: 64,
            rotate: this.rotation
        };
    }
}