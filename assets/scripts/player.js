class Player {
    constructor() {
        this.image = new Image();
        this.image.src = './assets/resources/player/shipsall.gif'
        this.X = 10;
        this.Y = 10;
        this.keys = {};

        window.addEventListener('keydown', this.keyDownListener, false);
        window.addEventListener('keyup', this.keyUpListener, false);
    }

    update() {
        if (this.keys['d']) {
            this.X++;
        }
        if (this.keys['a']) {
            this.X--;
        }
    }

    serializeObject() {
        return {
            image: this.image,
            X: this.X,
            Y: this.Y
        }
    }

    keyUpListener = e => this.keys[e.key] = false;
    keyDownListener = e => this.keys[e.key] = true;
}

