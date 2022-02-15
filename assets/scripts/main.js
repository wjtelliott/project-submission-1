let scriptLoader = {
    scriptList: [
        './assets/scripts/lighting.js',
        './assets/scripts/e1m1.js',
        './assets/scripts/player.js',
        './assets/scripts/laser.js',
        './assets/scripts/spaceRender.js',
        './assets/scripts/spaceEnemy.js',
    ],
    runScript: (srcFile) => {
        let scriptDOM = Object.assign(document.createElement('script'), {src: srcFile})
        scriptDOM.onload = () => scriptLoader.loadScripts();
        document.querySelector('body').append(scriptDOM);
    },
    loadScripts: () => {
        if (scriptLoader.scriptList.length > 0) scriptLoader.runScript(scriptLoader.scriptList.pop())
    },
}

$(document).ready(()=>scriptLoader.loadScripts());