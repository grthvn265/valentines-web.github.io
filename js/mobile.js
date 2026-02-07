// ===== MOBILE OPTIMIZATION (Phase 5) =====

let mobileState = {
    isMobile: false,
    touchStartX: 0,
    touchStartY: 0,
    isTouch: false
};

// ===== TASK 5.2: MOBILE RESPONSIVENESS =====
function initMobileOptimizations() {
    detectMobileDevice();
    setupMobileGameControls();
    setupMobileTouchInteractions();
    optimizeMobileUI();
    
    console.log(`📱 Mobile optimizations initialized (isMobile: ${mobileState.isMobile})`);
}

function detectMobileDevice() {
    mobileState.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                         || window.innerWidth <= 768
                         || 'ontouchstart' in window;
    
    if (mobileState.isMobile) {
        document.body.classList.add('mobile-device');
    }
}

function setupMobileGameControls() {
    const gameCanvas = document.getElementById('game-canvas');
    
    if (mobileState.isMobile) {
        // Add mobile control instructions
        updateMobileGameUI();
        
        // Enhanced touch controls for game
        gameCanvas.addEventListener('touchstart', handleGameTouchStart, { passive: false });
        gameCanvas.addEventListener('touchmove', handleGameTouchMove, { passive: false });
        gameCanvas.addEventListener('touchend', handleGameTouchEnd, { passive: false });
        
        // Prevent zoom on double tap
        gameCanvas.addEventListener('touchend', preventZoom, { passive: false });
    }
}

function updateMobileGameUI() {
    const instructions = document.querySelector('.instructions');
    if (instructions) {
        instructions.innerHTML = '📱 Tap left/right side of screen to move! 💖';
        instructions.style.fontSize = '1rem';
    }
}

function handleGameTouchStart(e) {
    e.preventDefault();
    if (!gameState.gameActive) return;
    
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    
    mobileState.touchStartX = x;
    mobileState.isTouch = true;
    
    // Immediate response for better feel
    if (x < rect.width / 2) {
        keys.left = true;
    } else {
        keys.right = true;
    }
    
    // Add visual feedback
    showTouchFeedback(touch.clientX, touch.clientY);
}

function handleGameTouchMove(e) {
    e.preventDefault();
    if (!gameState.gameActive || !mobileState.isTouch) return;
    
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    
    // Reset keys
    keys.left = false;
    keys.right = false;
    
    // Set new direction
    if (x < rect.width / 2) {
        keys.left = true;
    } else {
        keys.right = true;
    }
}

function handleGameTouchEnd(e) {
    e.preventDefault();
    keys.left = false;
    keys.right = false;
    mobileState.isTouch = false;
}

function preventZoom(e) {
    e.preventDefault();
}

function showTouchFeedback(x, y) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 40px;
        height: 40px;
        background: rgba(255, 107, 157, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: touchFeedback 0.3s ease-out forwards;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 300);
}

function setupMobileTouchInteractions() {
    // Optimize polaroid interactions for touch
    const polaroids = document.querySelectorAll('.polaroid');
    polaroids.forEach(polaroid => {
        polaroid.addEventListener('touchstart', handlePolaroidTouch, { passive: true });
    });
    
    // Optimize proposal buttons for touch
    optimizeProposalForMobile();
}

function handlePolaroidTouch(e) {
    const polaroid = e.currentTarget;
    polaroid.style.transform = 'rotate(0deg) scale(1.1) translateY(-10px)';
    
    setTimeout(() => {
        polaroid.style.transform = '';
    }, 200);
}

function optimizeProposalForMobile() {
    if (mobileState.isMobile) {
        const proposalButtons = document.querySelector('.proposal-buttons');
        if (proposalButtons) {
            proposalButtons.style.flexDirection = 'column';
            proposalButtons.style.gap = '20px';
            proposalButtons.style.minHeight = '200px';
            
            const yesBtn = document.getElementById('yes-btn');
            const noBtn = document.getElementById('no-btn');
            
            if (yesBtn && noBtn) {
                yesBtn.style.width = '100%';
                yesBtn.style.maxWidth = '300px';
                noBtn.style.width = '100%';
                noBtn.style.maxWidth = '300px';
                
                // Increase evasion distance for mobile
                if (proposalState) {
                    proposalState.evasionDistance = 100;
                }
            }
        }
    }
}

function optimizeMobileUI() {
    if (mobileState.isMobile) {
        // Add mobile-specific CSS
        const mobileStyle = document.createElement('style');
        mobileStyle.innerHTML = `
            @keyframes touchFeedback {
                from {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0.8;
                }
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
            
            .mobile-device .section-title {
                font-size: 2.5rem !important;
            }
            
            .mobile-device .proposal-title {
                font-size: 2.8rem !important;
            }
            
            .mobile-device .polaroid {
                min-width: 280px;
            }
            
            .mobile-device #game-canvas {
                height: 350px !important;
                touch-action: none;
            }
            
            .mobile-device .proposal-buttons {
                flex-direction: column !important;
                gap: 20px !important;
            }
            
            .mobile-device .proposal-buttons .btn {
                width: 100% !important;
                max-width: 300px !important;
                font-size: 1.2rem !important;
                padding: 18px 25px !important;
            }
            
            .mobile-device #audio-controls {
                top: 10px !important;
                right: 10px !important;
                scale: 0.9;
            }
            
            /* Improve touch targets */
            .mobile-device .btn {
                min-height: 48px;
            }
            
            .mobile-device .polaroid {
                cursor: default;
            }
            
            /* Prevent text selection on touch */
            .mobile-device * {
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            /* Allow text selection for readable content */
            .mobile-device .polaroid-caption,
            .mobile-device .section-subtitle,
            .mobile-device .celebration-message p {
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }
        `;
        document.head.appendChild(mobileStyle);
        
        // Optimize viewport for mobile
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
        
        // Add haptic feedback if available
        setupHapticFeedback();
    }
}

function setupHapticFeedback() {
    if ('vibrate' in navigator) {
        // Add vibration feedback for key interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn') || e.target.classList.contains('polaroid')) {
                navigator.vibrate(50); // Short vibration
            }
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function optimizePerformance() {
    // Reduce particle count on mobile for better performance
    if (mobileState.isMobile && window.particleSystem) {
        const positions = window.particleSystem.geometry.attributes.position.array;
        const mobileParticleCount = Math.min(particles.length, 75); // Reduce to 75 particles
        
        // Keep only the first 75 particles
        particles = particles.slice(0, mobileParticleCount);
        
        console.log(`📱 Reduced particles to ${mobileParticleCount} for mobile performance`);
    }
}

// ===== ORIENTATION HANDLING =====
function handleOrientationChange() {
    // Handle orientation changes gracefully
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Resize renderers if they exist
            if (backgroundRenderer) {
                backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
            }
            if (gameRenderer) {
                const canvas = document.getElementById('game-canvas');
                gameRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
            }
            
            // Re-initialize mobile optimizations
            optimizeMobileUI();
        }, 100);
    });
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initMobileOptimizations();
        optimizePerformance();
        handleOrientationChange();
    }, 500);
});