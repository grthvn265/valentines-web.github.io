// ===== UTILITY FUNCTIONS =====
function onWindowResize() {
    // 1. Resize Background
    if (typeof backgroundCamera !== 'undefined' && typeof backgroundRenderer !== 'undefined') {
        backgroundCamera.aspect = window.innerWidth / window.innerHeight;
        backgroundCamera.updateProjectionMatrix();
        backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // 2. Resize Game
    if (typeof gameCamera !== 'undefined' && typeof gameRenderer !== 'undefined') {
        const gameCanvas = document.getElementById('game-canvas');
        if (gameCanvas) {
            const width = gameCanvas.clientWidth;
            const height = gameCanvas.clientHeight;
            
            gameCamera.aspect = width / height;
            gameCamera.updateProjectionMatrix();
            
            // Pass false to setSize to prevent overwriting CSS dimensions
            gameRenderer.setSize(width, height, false);
        }
    }
}