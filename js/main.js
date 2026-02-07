// ===== GLOBAL VARIABLES =====
let backgroundScene, backgroundCamera, backgroundRenderer;
let particles = [];
let gameState = {
    current: 'memory-lane', // memory-lane, game, proposal
    score: 0,
    gameActive: false
};

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Valentine\'s Day Website Initializing... 🌟');
    console.log('🔍 Checking dependencies...');
    
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js not loaded! Game will not work.');
        alert('⚠️ Three.js library failed to load. Please refresh the page!');
        return;
    } else {
        console.log('✅ Three.js loaded successfully (v' + THREE.REVISION + ')');
    }
    
    // Check canvas elements
    const backgroundCanvas = document.getElementById('background-canvas');
    const gameCanvas = document.getElementById('game-canvas');
    
    if (!backgroundCanvas) {
        console.error('❌ Background canvas not found!');
    } else {
        console.log('✅ Background canvas found');
    }
    
    if (!gameCanvas) {
        console.error('❌ Game canvas not found!');
    } else {
        console.log('✅ Game canvas found');
    }
    
    try {
        console.log('🌸 Initializing background...');
        initBackgroundScene();
        
        console.log('🎯 Initializing event listeners...');
        initEventListeners();
    
        console.log('🖼️ Initializing gallery...');
        initPolaroidGallery();
    
        console.log('🌟 Starting animations...');
        animateBackground();
        
        console.log('💕 Initializing proposal...');
        initProposal();
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        alert('⚠️ Something went wrong during initialization. Check console for details!');
    }
    console.log('🎉 Valentine\'s Day Website Ready! 💕');
});
