let scriptLoader = {
    scriptList: [
        './assets/scripts/episodes.js',
        './assets/scripts/spaceMap.js',
        './assets/scripts/spaceLighting.js',
        './assets/scripts/spacePlayer.js',
        './assets/scripts/spaceLaser.js',
        './assets/scripts/spaceRender.js',
        './assets/scripts/spaceEnemy.js',
    ],
    runScript: (srcFile) => {
        let scriptDOM = Object.assign(document.createElement('script'), {src: srcFile})
        scriptDOM.onload = () => scriptLoader.loadScripts();
        document.querySelector('body').append(scriptDOM);
    },
    loadScripts: () => {
        if (scriptLoader.scriptList.length > 0) scriptLoader.runScript(scriptLoader.scriptList.pop());
    },
}

$(document).ready(()=>scriptLoader.loadScripts());