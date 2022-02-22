const spaceRender = {
    context: document.querySelector('#gameSpace').getContext('2d'),
    canvasObject: document.querySelector('#gameSpace'),
    canvasSpace: {
        width: document.querySelector('#gameSpace').width,
        height: document.querySelector('#gameSpace').height
    },
    clearDrawing: (x = 0, y = 0, width = spaceRender.canvasSpace.width, height = spaceRender.canvasSpace.height) => spaceRender.context.clearRect(x, y, width, height),
    drawRotatedObject: sObject => {
        /**
         * Save context
         * Translate to object location,
         * Rotate canvas,
         * Draw image with drawSerializedObject,
         * Restore original canvas context
         */
        spaceRender.context.save();
        spaceRender.context.translate(sObject.X + sObject.sourceWidth / 2, sObject.Y + sObject.sourceHeight / 2);
        //spaceRender.context.translate(spaceRender.canvasSpace.width / 2, spaceRender.canvasSpace.height / 2);
        spaceRender.context.rotate(sObject.rotate * Math.PI / 180);
        //const {rotate, ...newObject} = sObject;
        spaceRender.context.drawImage(sObject.image, sObject.sourceX, sObject.sourceY, sObject.sourceWidth,
            sObject.sourceHeight, -(sObject.sourceWidth / 2), -(sObject.sourceHeight / 2), sObject.sourceWidth, sObject.sourceHeight);
        spaceRender.context.restore();
    },
    drawSerializedObject: sObject => {
        /**
         * If null, don't draw anything
         * If has rotation values, draw rotated object
         * If has source image values, use image sourcing
         * If has width / height values, use image sizing
         * Else draw image normally
         */
        if (sObject === null) return;
        if (sObject?.rotate !== undefined) spaceRender.drawRotatedObject(sObject);
        else if (sObject?.sourceX !== undefined) {
            spaceRender.context.drawImage(sObject.image, sObject.sourceX, sObject.sourceY, sObject.sourceWidth,
                sObject.sourceHeight, sObject.X, sObject.Y, sObject.sourceWidth, sObject.sourceHeight);
        } else if (sObject.width !== undefined) spaceRender.context.drawImage(sObject.image, sObject.X, sObject.Y, sObject.width, sObject.height)
        else spaceRender.context.drawImage(sObject.image, sObject.X, sObject.Y);
    }
}