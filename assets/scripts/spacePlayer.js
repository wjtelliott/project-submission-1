const PLAYER_MAX_SPEED = 7;
const PLAYER_FRICTION = 0.2;
const PLAYER_ACCEL = 0.4

const PLAYZONE_X = [25, 1125]
const PLAYZONE_Y = [420, 725]


class Player extends spaceEntity {

    constructor() {
        super();
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

        this.sourceWidth = this.sourceHeight = 64;
        this.sourceX = this.sourceY = 0;

        this.score = 0;

        this.useFriction = true;

        this.velocity = {X: 0, Y: 0};

        window.addEventListener('keydown', this.keyDownListener, false);
        window.addEventListener('keyup', this.keyUpListener, false);
    }

    /**
     * Laser
     */

    createPlayerLaser() {
        if (this.laserCurrentCooldown > 0 || this.overheatedGuns) return;
        
        this.playSound('#playerLaser', true);

        if (this.score > 100) {
            this.lasers.push(new Laser('./assets/resources/misc/beams.png', [this.X + 28, this.Y - 16], [0, -15], 75, 'red'))
        } else this.lasers.push(new Laser('./assets/resources/misc/beams.png', [this.X + 28, this.Y - 16], [0, -20], 55))
        this.laserOverheat += 2;
        this.laserCurrentCooldown = this.laserCooldown;
    }

    /**
     * Scoring and lives
     */

    addScore = toAdd => this.score += Number(toAdd.toFixed(0));
    hurt = amount => {
        if (amount > 0) this.playSound('#playerHurt');
        this.lives-=amount;
    }


    /**
     * Player UI
     */

    drawUI = (ctx) => {


        spaceRender.context.font = '3em serif';


        let uiInfo = {
            overheatTextX: 20,
            overheatTextY: 830,
            overheatTextColor: 'red',
            overheatbgRectX: 220,
            overheatbgRectY: 795,
            overheatbgWidth: this.laserOverheatMax * 5.75,
            overheatbgHeight: 40,
            overheatbgColor: 'grey',
            overheatRectX: 230,
            overheatRectY: 800,
            overheatRectWidth: this.laserOverheat * 5,
            overheatRectHeight: 30,
            overheatRectColor: 'blue',
            overheatRectColor2: 'red',

            scoreTextX: 600,
            scoreTextY: 830,

            livesTextX: 400,
            livesTextY: 830
        }


        // Draw background
        spaceRender.context.fillStyle = 'black';
        spaceRender.context.fillRect(0, uiInfo.overheatbgRectY - 5, 1200, 300);


        // Draw overheat
        spaceRender.context.fillStyle = uiInfo.overheatTextColor;
        spaceRender.context.fillText(`Overheat:`, uiInfo.overheatTextX, uiInfo.overheatTextY);
        
        spaceRender.context.fillStyle = 'grey';
        spaceRender.context.fillRect(uiInfo.overheatbgRectX, uiInfo.overheatbgRectY, uiInfo.overheatbgWidth, uiInfo.overheatbgHeight);

        
        spaceRender.context.fillStyle = (this.overheatedGuns) ? 'red' : 'blue';
        spaceRender.context.fillRect(uiInfo.overheatRectX, uiInfo.overheatRectY, uiInfo.overheatRectWidth, uiInfo.overheatRectHeight);


        // Draw score
        spaceRender.context.fillStyle = uiInfo.overheatTextColor;
        spaceRender.context.fillText(`Score: ${this.score}`, uiInfo.scoreTextX, uiInfo.scoreTextY);

        
        spaceRender.context.fillStyle = uiInfo.overheatTextColor;
        spaceRender.context.fillText(`Lives: ${this.lives}`, uiInfo.livesTextX, uiInfo.livesTextY);
    }

    

    update(enemyLasers) {


        //If we aren't playing background music, it will start
        if (!this.isSoundPlaying('#backgroundAudio')) this.playSound('#backgroundAudio', false);


        // Win / lose conditions
        if (this.lives <= 0) episodeController.stopGame(false);
        if (this.score > 200) episodeController.nextMap();

        // Movement keys
        if (this.keys['d']) this.velocity.X+=PLAYER_ACCEL;
        if (this.keys['a']) this.velocity.X-=PLAYER_ACCEL;
        if (this.keys['s']) this.velocity.Y+=PLAYER_ACCEL;
        if (this.keys['w']) this.velocity.Y-=PLAYER_ACCEL;

        // Laser overheat / firing
        this.laserOverheat = (this.laserOverheat - 0.1 <= 0) ? 0 : this.laserOverheat - 0.1;
        this.laserCurrentCooldown = (this.laserCurrentCooldown <= 0) ? 0 : this.laserCurrentCooldown - 1;

        if (this.laserOverheat >= this.laserOverheatMax) this.overheatedGuns = true;
        if (this.overheatedGuns && this.laserOverheat <= 0) this.overheatedGuns = false;

        // Fire a laser!
        if (this.keys[' ']) this.createPlayerLaser();

        // Using friction?
        (this.useFriction) ? this.friction() : null;

        // Clamp velocity within bounds
        this.clampVelocity();

        // Move player
        this.X += this.velocity.X;
        this.Y += this.velocity.Y;


        // Collisions and clamp in playzone
        this.checkCollision(enemyLasers);

        this.clampPlayerInPlayerzone();
    }

    /**
     * We need a custom collision check here
     */

    checkCollision(lasers, collisionDistance = 2500) {
        lasers.forEach(e => {
            if (this.getDistance(e.position, 32) < collisionDistance) {
                this.hurt(1);
                e.removeFromMap = true;
            }
        });
    }

    /**
     * Key listener handlers
     */

    keyUpListener = e => this.keys[e.key] = false;
    keyDownListener = e => {
        if (e.key === ' ') e.preventDefault();
        this.keys[e.key] = true;
    }
}

