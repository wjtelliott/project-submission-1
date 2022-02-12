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
        spaceRender.context.drawImage(sObject.image, sObject.X, sObject.Y);
    }
}