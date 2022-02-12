const spaceRender = {
    context: document.querySelector('#gameSpace').getContext('2d'),
    canvasObject: document.querySelector('#gameSpace'),
    canvasSpace: {
        width: document.querySelector('#gameSpace').width,
        height: document.querySelector('#gameSpace').height
    },
    clearDrawing: (x = 0, y = 0, width = spaceRender.canvasSpace.width, height = spaceRender.canvasSpace.height) => spaceRender.context.clearRect(x, y, width, height),
    drawSerializedObject: (sObject) => {
        if (sObject === null) return;
        if (sObject.sourceX !== undefined) {
            spaceRender.context.drawImage(sObject.image, sObject.sourceX, sObject.sourceY, sObject.sourceWidth,
                sObject.sourceHeight, sObject.X, sObject.Y, sObject.sourceWidth, sObject.sourceHeight);
        } else spaceRender.context.drawImage(sObject.image, sObject.X, sObject.Y);
    }
}