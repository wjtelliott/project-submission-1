let scriptLoader = {

    /**
     * Some scripts are dependant on others. We need to make sure the most dependant is on top, and the
     * scripts with least amount of calls to others are on the bottom
     */
    scriptList: [
        './assets/scripts/episodes.js',
        './assets/scripts/spaceMap.js',
        './assets/scripts/spaceAsteroid.js',
        './assets/scripts/spaceParticle.js',
        './assets/scripts/spaceLighting.js',
        './assets/scripts/spacePlayer.js',
        './assets/scripts/spaceLaser.js',
        './assets/scripts/spaceRender.js',
        './assets/scripts/spaceEnemy.js',
        './assets/scripts/spaceEntity.js',
    ],

    runScript: (srcFile) => {
        let scriptDOM = Object.assign(document.createElement('script'), {src: srcFile})
        // Run scripts, pop next one
        scriptDOM.onload = () => scriptLoader.loadScripts();
        document.querySelector('body').append(scriptDOM);
    },
    loadScripts: () => (scriptLoader.scriptList.length > 0) ? scriptLoader.runScript(scriptLoader.scriptList.pop()) : null,
}

$(document).ready(()=>scriptLoader.loadScripts());