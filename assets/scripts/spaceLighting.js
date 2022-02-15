class Light {
    constructor(pos, rad, color) {
        this.position = pos;
        this.radius = rad;
        this.color = color;
        this.angleSpread = 360;
        this.angle = 90;
    }

}

function Vector(x, y) {
    this.x = x ?? 0;
    this.y = y ?? 0;
}


let lightController = {
    lights: [],
    draw: (context) => {
        for (let i = 0; i < lightController.lights.length; i++) {
            context.strokeStyle = lightController.lights[i].color;
            lightUtil.shineLight(lightController.lights[i], context);
        }
    }
}


const lightUtil = {
    findDistance: (light, object, angle, rLen, start, shortest, closestObject) => {
        
        // Get origin of object, find distance to object with triangle hypot
        let y = (object.position.y + object.height / 2) - light.position.y;
        let x = (object.position.x + object.width / 2) - light.position.x;

        // a2 = b2 + c2
        let dist = Math.sqrt((y * y) + (x * x));

        // We found a closer object, change properties and return
        if (light.radius >= dist) {
            let radians = angle * (Math.PI / 180);
            let pointPos = new Vector(light.position.x, light.position.y);

            pointPos.x += Math.cos(radians) * dist;
            pointPos.y += Math.sin(radians) * dist;

            if (
            pointPos.x > object.position.x && pointPos.x < object.position.x + object.width &&
            pointPos.y > object.position.y && pointPos.y < object.position.y + object.height
            ) {
                if (start || dist < shortest) {
                    start = false;
                    shortest = dist;
                    rLen = dist;
                    closestObject = object;
                }
            }
        }

        // Return light data
        return {
            'start': start,
            'shortest': shortest,
            'rLen': rLen,
            'block': closestObject
        };
    },

    shineLight: (light, ctx) => {
        let curAngle = light.angle - (light.angleSpread / 2);
        let dynLen = light.radius;
        let addTo = 1 / light.radius;
        

        for (curAngle; curAngle < light.angle + (light.angleSpread / 2); curAngle += (addTo * (180 / Math.PI)) * 2) {
            dynLen = light.radius;



            let findDistRes = {};
            findDistRes.start = true;
            findDistRes.shortest = 0;
            findDistRes.rLen = dynLen;
            findDistRes.block = {};


            // obstructions
            for (let i = 0; i < r.enemies.length; i++) findDistRes = lightUtil.findDistance(light, r.enemies[i].serializeLightMap(), curAngle, findDistRes.rLen, findDistRes.start, findDistRes.shortest, findDistRes.block);

            // player
            findDistRes = lightUtil.findDistance(light, r.player.serializeLightMap(), curAngle, findDistRes.rLen, findDistRes.start, findDistRes.shortest, findDistRes.block);

            let rads = curAngle * (Math.PI / 180);
            let end = new Vector(light.position.x, light.position.y);

            findDistRes.block.visible = true;
            end.x += Math.cos(rads) * findDistRes.rLen;
            end.y += Math.sin(rads) * findDistRes.rLen;

            ctx.beginPath();
            ctx.moveTo(light.position.x, light.position.y);
            ctx.lineTo(end.x, end.y);
            ctx.closePath();
            ctx.stroke();
        }
    }
}
