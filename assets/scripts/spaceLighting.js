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

/**
 * 
 * 
 * Lighting system inspired and pushed into this project from
 * https://jsfiddle.net/yckart/bfk8jzam/
 * 
 */
const lightUtil = {
    findDistance: (light, object, angle, rLen, start, shortest, closestObject) => {
        
        // Get origin of object, find distance to object with triangle hypot
        let y = (object.position.y + object.height / 2) - light.position.y;
        let x = (object.position.x + object.width / 2) - light.position.x;

        // a2 = b2 + c2
        let dist = Math.sqrt((y * y) + (x * x));

        // Light shines farther than the distance to this object
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
                    // we found a new object with shorter distance
                    // I don't like how the original edits params as variables
                    start = false;
                    shortest = dist;
                    rLen = dist;
                    closestObject = object;
                }
            }
        }

        // Return light distance data
        return {
            'start': start,
            'shortest': shortest,
            'rLen': rLen,
            'object': closestObject
        };
    },

    setAlphaColor: (string, delta) => {
        /**
         * This will have unexpected results if the alpha channel has
         * the same value as a color
         */
        let alpha = string.match(/^.+\((?:(?:.+\,)?)+(.+)\)$/)[1];
        return string.replace(alpha, Math.max(0, Number(alpha) - Number(delta)).toFixed(2))
    },

    shineLight: (light, ctx) => {

        // If the current map's enemies are null, the map is not yet initialized correctly
        if (episodeController?.currentMap?.enemies == null) return;


        let curAngle = light.angle - (light.angleSpread / 2);
        let dynLen = light.radius;
        let addTo = 1 / light.radius;
        

        // For each angle, find the distance to the nearest object, and then draw a colored line equal to that distance
        for (curAngle; curAngle < light.angle + (light.angleSpread / 2); curAngle += (addTo * (180 / Math.PI)) * 2) {

            dynLen = light.radius;
            let findDistRes = {};
            findDistRes.start = true;
            findDistRes.shortest = 0;
            findDistRes.rLen = dynLen;
            findDistRes.block = {};


            // obstructions
            for (let i = 0; i < episodeController.currentMap.enemies.length; i++) findDistRes = lightUtil.findDistance(light, episodeController.currentMap.enemies[i].serializeLightMap(), curAngle, findDistRes.rLen, findDistRes.start, findDistRes.shortest, findDistRes.block);

            // player
            findDistRes = lightUtil.findDistance(light, episodeController.currentMap.player.serializeLightMap(), curAngle, findDistRes.rLen, findDistRes.start, findDistRes.shortest, findDistRes.object);


            // get rotation
            let rads = curAngle * (Math.PI / 180);

            // end = light position
            let end = new Vector(light.position.x, light.position.y);

            // end position += angle * length of nearest object
            end.x += Math.cos(rads) * findDistRes.rLen;
            end.y += Math.sin(rads) * findDistRes.rLen;

            // Draw from this light pos to end pos
            ctx.beginPath();
            ctx.moveTo(light.position.x, light.position.y);
            ctx.lineTo(end.x, end.y);
            ctx.closePath();
            ctx.stroke();
        }

        

        if (light.isExplosive) {
            // Light decay
            light.color = lightUtil.setAlphaColor(light.color, 0.01)
        }
    }
}
