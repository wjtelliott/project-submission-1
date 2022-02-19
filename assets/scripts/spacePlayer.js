const PLAYER_MAX_SPEED = 7;
const PLAYER_FRICTION = 0.2;
const PLAYER_ACCEL = 0.4

const PLAYZONE_X = [25, 1125]
const PLAYZONE_Y = [420, 815]


class Player {

    constructor() {
        this.image = new Image();
        this.image.src = './assets/resources/player/shipsall.gif'
        this.X = 420;
        this.Y = 1000;
        this.keys = {};
        
        this.lives = 3;

        this.lasers = [];

        this.laserCooldown = 10;
        this.laserCurrentCooldown = 0;

        this.laserOverheat = 0;
        this.laserOverheatMax = 20;
        this.overheatedGuns = false;

        this.score = 0;

        this.useFriction = true;

        this.velocity = {X: 0, Y: 0};

        window.addEventListener('keydown', this.keyDownListener, false);
        window.addEventListener('keyup', this.keyUpListener, false);
    }

    createTestLaser() {
        if (this.laserCurrentCooldown > 0 || this.overheatedGuns) return;
        
        {
            let audio = document.querySelector("#playerLaser");
            audio.volume = 0.1;
            audio.currentTime = 0;
            audio.play();
        }
        if (this.score > 100) {
            this.lasers.push(new Laser('./assets/resources/misc/beams.png', [this.X + 28, this.Y - 16], [0, -15], 75, 'red'))
        } else this.lasers.push(new Laser('./assets/resources/misc/beams.png', [this.X + 28, this.Y - 16], [0, -20], 55))
        this.laserOverheat += 2;
        this.laserCurrentCooldown = this.laserCooldown;
    }

    addScore = toAdd => $('#gameScore').text(this.score += Number(toAdd.toFixed(0)));
    hurt = amount => {
        {
            let audio = document.querySelector("#playerHurt");
            audio.volume = 0.1;
            audio.play();
        }
        $('#gameLives').text(this.lives -= Number(amount.toFixed(0)));
    }

    drawUI = (ctx) => {
        spaceRender.context.font = '3em serif';
        spaceRender.context.fillStyle = 'red';
        spaceRender.context.fillText(`Overheat:`, 50, 50);
        
        spaceRender.context.fillStyle = 'grey';
        spaceRender.context.fillRect(240, 15, this.laserOverheatMax * 5.75, 40);

        
        spaceRender.context.fillStyle = (this.overheatedGuns) ? 'red' : 'blue';
        spaceRender.context.fillRect(250, 20, this.laserOverheat * 5, 30);
    }

    updateOverheatBar = () => {
        return {
            x: 50,
            y: 50,
            width: 10 * this.laserOverheat,
            height: 10
        }
    }

    update(enemyLasers) {


        if (this.lives <= 0) episodeController.stopGame("You lose");
        if (this.score > 200) episodeController.nextMap();//episodeController.stopGame("You win");

        if (this.keys['d']) this.velocity.X+=PLAYER_ACCEL;
        if (this.keys['a']) this.velocity.X-=PLAYER_ACCEL;
        if (this.keys['s']) this.velocity.Y+=PLAYER_ACCEL;
        if (this.keys['w']) this.velocity.Y-=PLAYER_ACCEL;

        {
            let audio = document.querySelector("#backgroundAudio");
            audio.volume = 0.1;
            audio.play();
        }

        this.laserOverheat = (this.laserOverheat - 0.1 <= 0) ? 0 : this.laserOverheat - 0.1;
        this.laserCurrentCooldown = (this.laserCurrentCooldown <= 0) ? 0 : this.laserCurrentCooldown - 1;

        if (this.laserOverheat >= this.laserOverheatMax) this.overheatedGuns = true;
        if (this.overheatedGuns && this.laserOverheat <= 0) this.overheatedGuns = false;

        if (this.keys[' ']) this.createTestLaser();

        (this.useFriction) ? this.friction() : null;
        this.clampVelocity();

        this.X += this.velocity.X;
        this.Y += this.velocity.Y;

        this.checkCollision(enemyLasers);

        this.clampPlayerInPlayerzone();
    }

    getDistance(objectPosition) {
        // objectPosition will always be X as [0] and Y as [1], same as this.position / this.velocity
        if (objectPosition === null || this.position === null) return Infinity;
        let p1 = objectPosition[0] - (this.X + 32);
        let p2 = objectPosition[1] - (this.Y + 32);
        return (p1 * p1) + (p2 * p2);
    }

    checkCollision(lasers, collisionDistance = 2500) {
        lasers.forEach(e => {
            if (this.getDistance(e.position) < collisionDistance) {
                this.hurt(1);
                e.removeFromMap = true;
            }
        });
    }

    clampPlayerInPlayerzone() {
        if (this.velocity.X + this.X > PLAYZONE_X[1]) this.X = PLAYZONE_X[1]
        else if (this.velocity.X + this.X < PLAYZONE_X[0]) this.X = PLAYZONE_X[0]

        if (this.velocity.Y + this.Y > PLAYZONE_Y[1]) this.Y = PLAYZONE_Y[1]
        else if (this.velocity.Y + this.Y < PLAYZONE_Y[0]) this.Y = PLAYZONE_Y[0]
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
            Y: this.Y,
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 64,
            sourceHeight: 64
        }
    }

    serializeLightMap() {
        return {
            position: {
                x: this.X,
                y: this.Y
            },
            width: 64,
            height: 64
        }
    }

    keyUpListener = e => this.keys[e.key] = false;
    keyDownListener = e => {
        if (e.key === ' ') e.preventDefault();
        this.keys[e.key] = true;
    }
}

