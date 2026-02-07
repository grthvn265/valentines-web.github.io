// ===== UTILITY FUNCTIONS =====
function onWindowResize() {
    backgroundCamera.aspect = window.innerWidth / window.innerHeight;
    backgroundCamera.updateProjectionMatrix();
    backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
}