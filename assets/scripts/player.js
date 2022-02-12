const PLAYER_MAX_SPEED = 7;
const PLAYER_FRICTION = 0.3;


class Player {

    constructor() {
        this.image = new Image();
        this.image.src = './assets/resources/player/shipsall.gif'
        this.X = 10;
        this.Y = 10;
        this.keys = {};
        
        this.lasers = [];

        this.laserCooldown = 20;
        this.laserCurrentCooldown = 0;

        this.velocity = {X: 0, Y: 0};

        window.addEventListener('keydown', this.keyDownListener, false);
        window.addEventListener('keyup', this.keyUpListener, false);
    }

    createTestLaser() {
        if (this.laserCurrentCooldown > 0) return;
        this.lasers.push(new Laser('./assets/resources/misc/beams.png', [this.X, this.Y], [0, -20], 55))
        this.laserCurrentCooldown = this.laserCooldown;
    }

    update() {
        if (this.keys['d']) this.velocity.X++;
        if (this.keys['a']) this.velocity.X--
        if (this.keys['s']) this.velocity.Y++
        if (this.keys['w']) this.velocity.Y--;


        this.laserCurrentCooldown = (this.laserCurrentCooldown <= 0) ? 0 : this.laserCurrentCooldown - 1;

        if (this.keys['f']) this.createTestLaser();

        this.friction();
        this.clampVelocity();

        this.X += this.velocity.X;
        this.Y += this.velocity.Y;
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

