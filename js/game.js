// ===== SKY RUNNER GAME =====

// ===== GAME VARIABLES =====
let gameScene, gameCamera, gameRenderer;
let player;
let obstacles = [];
let hearts = [];
let gameWorld = [];
let gameSpeed = 0.1;
let spawnTimer = 0;
let zigzagDirection = 1; // Track zigzag direction: 1 for right, -1 for left
let heartCount = 0; // Track number of hearts spawned for zigzag pattern

// ===== INPUT HANDLING =====
let keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

// ===== TASK 3.1: GAME SCENE INITIALIZATION =====
function initGame() {
    console.log('🎮 Starting game initialization...');
    
    gameState.gameActive = true;
    gameState.score = 0;
    gameSpeed = 0.1;
    updateScore();
    
    // Clear previous game objects
    hearts = [];
    obstacles = [];
    gameWorld = [];
    spawnTimer = 0;
    zigzagDirection = 1; // Reset zigzag pattern
    heartCount = 0;
    
    try {
        // Initialize Three.js game scene
        console.log('🎮 Initializing game scene...');
        initGameScene();
        
        console.log('🎮 Creating player...');
        initPlayer();
        
        console.log('🎮 Creating world...');
        initGameWorld();
        
        console.log('🎮 Setting up controls...');
        initGameControls();
        
        // Start game loop
        console.log('🎮 Starting game loop...');
        gameLoop();
        
        console.log('🎮 Sky Runner Game Successfully Initialized!');
    } catch (error) {
        console.error('❌ Game initialization failed:', error);
        showGameError(error.message);
    }
}

function initGameScene() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        throw new Error('Game canvas not found!');
    }
    
    console.log('🎮 Canvas found:', canvas.width, 'x', canvas.height);
    
    // Use explicit 1280x720 dimensions for consistency
    const gameWidth = 1280;
    const gameHeight = 720;
    
    // Create game scene, camera, and renderer
    gameScene = new THREE.Scene();
    
    // Optimized camera for 16:9 widescreen gaming
    gameCamera = new THREE.PerspectiveCamera(60, gameWidth / gameHeight, 0.1, 1000);
    gameRenderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true,
        premultipliedAlpha: false
    });
    
    gameRenderer.setSize(gameWidth, gameHeight);
    gameRenderer.setClearColor(0x000000, 0); // Completely transparent background
    
    // Camera positioned for optimal centering in 1280x720 canvas
    gameCamera.position.set(0, 2.5, 6);
    gameCamera.lookAt(0, -1, -6);
    
    console.log('🎮 Game initialized at 1280x720 resolution');
    console.log('🎮 Game scene initialized successfully');
}

// ===== TASK 3.2: PLAYER OBJECT =====
function initPlayer() {
    // Create heart-shaped player (using multiple spheres)
    const heartGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const heartMaterial = new THREE.MeshLambertMaterial({ color: 0xff6b9d });
    
    // Create heart shape with two spheres and a bottom part
    const heartGroup = new THREE.Group();
    
    const leftHeart = new THREE.Mesh(heartGeometry, heartMaterial);
    leftHeart.position.set(-0.2, 0.1, 0);
    heartGroup.add(leftHeart);
    
    const rightHeart = new THREE.Mesh(heartGeometry, heartMaterial);
    rightHeart.position.set(0.2, 0.1, 0);
    heartGroup.add(rightHeart);
    
    const bottomHeart = new THREE.Mesh(
        new THREE.ConeGeometry(0.35, 0.8, 8),
        heartMaterial
    );
    bottomHeart.position.set(0, -0.3, 0);
    bottomHeart.rotation.z = Math.PI;
    heartGroup.add(bottomHeart);
    
    player = heartGroup;
    player.position.set(0, -1, 0);
    gameScene.add(player);
}

// ===== TASK 3.3: THE WORLD (OPTIMIZED MOVING GRID FLOOR) =====
function initGameWorld() {
    console.log('🌍 Creating optimized game world...');
    
    // Optimized grid parameters for 1280x720
    const gridWidth = 16; // Wider for 16:9 aspect ratio
    const gridDepth = 12;
    const gridDivisions = 16;
    const gridSpacing = 25;
    
    // Create multiple grid segments for seamless movement
    for (let i = 0; i < 4; i++) {
        const gridHelper = new THREE.GridHelper(
            gridWidth, 
            gridDivisions,
            0xff8fab, // Primary pink lines
            0xffc3e1  // Secondary pink lines
        );
        
        // Position grids to fill canvas area properly
        gridHelper.position.set(0, -3, -i * gridSpacing);
        gridHelper.rotation.x = 0; // Keep flat
        
        // Scale for better proportions
        gridHelper.scale.set(1, 1, 1.5); // Stretch depth for perspective
        
        // Add subtle animation data
        gridHelper.userData = {
            originalZ: -i * gridSpacing,
            segment: i,
            pulsePhase: i * Math.PI / 2
        };
        
        gameWorld.push(gridHelper);
        gameScene.add(gridHelper);
    }
    
    // Add atmospheric elements
    createAtmosphere();
    
    console.log('✅ Game world created with 4 grid segments');
}

function createAtmosphere() {
    // Add subtle fog for depth
    gameScene.fog = new THREE.Fog(0xffeef6, 10, 50);
    
    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    gameScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 15, 10);
    directionalLight.castShadow = false; // Disable for performance
    gameScene.add(directionalLight);
    
    // Add rim lighting
    const rimLight = new THREE.DirectionalLight(0xff6b9d, 0.3);
    rimLight.position.set(-5, 10, 5);
    gameScene.add(rimLight);
}

// ===== TASK 3.4: SPAWNING LOGIC =====
function spawnCollectibles() {
    spawnTimer++;
    
    if (spawnTimer > 60) { // Spawn every 60 frames (about 1 second)
        spawnTimer = 0;
        
        // Randomly spawn hearts or obstacles
        if (Math.random() > 0.3) { // 70% chance for heart
            spawnHeart();
        } else { // 30% chance for obstacle
            spawnObstacle();
        }
    }
}

function spawnHeart() {
    const heartGeometry = new THREE.SphereGeometry(0.2, 12, 12);
    const heartMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xe91e63,
        transparent: true,
        opacity: 0.9
    });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    
    // Create random zigzag pattern
    heartCount++;
    
    // Change direction randomly every 1-3 hearts
    if (heartCount % (Math.floor(Math.random() * 3) + 1) === 0) {
        zigzagDirection *= -1;
    }
    
    // Calculate zigzag position
    const zigzagOffset = zigzagDirection * (1 + Math.random() * 2); // 1-3 units offset
    const randomVariation = (Math.random() - 0.5) * 0.5; // Small random variation
    
    heart.position.set(
        zigzagOffset + randomVariation, // X: zigzag pattern with variation
        -0.5,  // Y: consistent height
        -15    // Z: spawn distance
    );
    
    // No animation data - hearts stay static except for movement
    heart.userData = {
        type: 'heart'
    };
    
    hearts.push(heart);
    gameScene.add(heart);
}

function spawnObstacle() {
    const obstacleGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.8);
    const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    
    obstacle.position.set(
        (Math.random() - 0.5) * 8, // X: -4 to 4
        0,                          // Y: ground level
        -15                         // Z: spawn distance
    );
    
    obstacle.userData = { type: 'obstacle' };
    
    obstacles.push(obstacle);
    gameScene.add(obstacle);
}

// ===== TASK 3.5: COLLISION DETECTION =====
function checkCollisions() {
    const playerBox = new THREE.Box3().setFromObject(player);
    
    // Check heart collisions
    for (let i = hearts.length - 1; i >= 0; i--) {
        const heart = hearts[i];
        const heartBox = new THREE.Box3().setFromObject(heart);
        
        if (playerBox.intersectsBox(heartBox)) {
            // Collected a heart!
            gameScene.remove(heart);
            hearts.splice(i, 1);
            
            gameState.score++;
            updateScore();
            
            // Heart collection effect
            createParticleEffect(heart.position, 0xff6b9d);
            
            // Play heart collection sound
            if (typeof playSound === 'function') {
                playSound('heartCollect');
            }
        }
    }
    
    // Check obstacle collisions
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        const obstacleBox = new THREE.Box3().setFromObject(obstacle);
        
        if (playerBox.intersectsBox(obstacleBox)) {
            // Hit an obstacle!
            gameOver();
            break;
        }
    }
}

function createParticleEffect(position, color) {
    // Create small particle explosion effect
    for (let i = 0; i < 8; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ color: color });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        particle.position.copy(position);
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                Math.random() * 0.2,
                (Math.random() - 0.5) * 0.2
            ),
            life: 30
        };
        
        gameScene.add(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            gameScene.remove(particle);
        }, 500);
    }
}

// ===== GAME CONTROLS =====
function initGameControls() {
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        if (!gameState.gameActive) return;
        
        switch(event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                keys.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                keys.right = true;
                break;
        }
    });
    
    document.addEventListener('keyup', (event) => {
        switch(event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                keys.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                keys.right = false;
                break;
        }
    });
    
    // Touch controls for mobile (Phase 5)
    const gameCanvas = document.getElementById('game-canvas');
    
    gameCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!gameState.gameActive) return;
        
        const touch = e.touches[0];
        const rect = gameCanvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        
        if (x < rect.width / 2) {
            keys.left = true;
        } else {
            keys.right = true;
        }
    });
    
    gameCanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys.left = false;
        keys.right = false;
    });
}

// ===== GAME LOOP =====
function gameLoop() {
    if (!gameState.gameActive) {
        console.log('🎮 Game loop stopped - game not active');
        return;
    }
    
    try {
        // Update player movement
        updatePlayer();
        
        // Update world movement
        updateWorld();
        
        // Spawn collectibles
        spawnCollectibles();
        
        // Update collectibles
        updateCollectibles();
        
        // Check collisions
        checkCollisions();
        
        // Render game scene
        if (gameRenderer && gameScene && gameCamera) {
            gameRenderer.render(gameScene, gameCamera);
        } else {
            console.error('❌ Missing game renderer components');
            return;
        }
        
        // Continue game loop
        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error('❌ Game loop error:', error);
        gameState.gameActive = false;
        showGameError('Game loop error: ' + error.message);
    }
}

function updatePlayer() {
    // Player movement
    const moveSpeed = 0.15;
    
    if (keys.left && player.position.x > -4) {
        player.position.x -= moveSpeed;
    }
    if (keys.right && player.position.x < 4) {
        player.position.x += moveSpeed;
    }
    
    // Player floating animation
    player.position.y = Math.sin(Date.now() * 0.005) * 0.2;
    player.rotation.y += 0.02;
}

function updateWorld() {
    const time = Date.now() * 0.001; // Convert to seconds
    
    // Optimized grid movement with smooth animations
    gameWorld.forEach((grid, index) => {
        // Main forward movement
        grid.position.z += gameSpeed;
        
        // Subtle pulse animation for visual interest
        const pulseIntensity = 0.02;
        const pulse = Math.sin(time * 2 + grid.userData.pulsePhase) * pulseIntensity;
        grid.scale.y = 1 + pulse;
        
        // Subtle color animation
        if (grid.material && grid.material.color) {
            const colorPulse = Math.sin(time * 1.5 + index) * 0.1;
            grid.material.opacity = 0.8 + colorPulse;
        }
        
        // Reset position for seamless looping
        const resetDistance = 100; // Distance before reset
        const totalSegments = gameWorld.length;
        const segmentSpacing = 25;
        
        if (grid.position.z > resetDistance / totalSegments) {
            grid.position.z -= totalSegments * segmentSpacing;
        }
    });
    
    // Dynamic camera movement for immersion (properly centered)
    const cameraFloat = Math.sin(time * 0.5) * 0.05;
    gameCamera.position.y = 2.5 + cameraFloat;
    
    // Gradually increase speed with smooth acceleration
    const maxSpeed = 0.25;
    const acceleration = 0.00005;
    gameSpeed = Math.min(gameSpeed + acceleration, maxSpeed);
}

function updateCollectibles() {
    // Update hearts
    for (let i = hearts.length - 1; i >= 0; i--) {
        const heart = hearts[i];
        heart.position.z += gameSpeed;
        
        // No animations - hearts move in static zigzag pattern
        
        // Remove if too far
        if (heart.position.z > 10) {
            gameScene.remove(heart);
            hearts.splice(i, 1);
        }
    }
    
    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.position.z += gameSpeed;
        
        // Remove if too far
        if (obstacle.position.z > 10) {
            gameScene.remove(obstacle);
            obstacles.splice(i, 1);
        }
    }
}

// ===== TASK 3.6: WIN CONDITION & GAME OVER =====
function updateScore() {
    document.getElementById('score').textContent = gameState.score;
    
    if (gameState.score >= 10) {
        // Win condition - trigger proposal!
        gameWin();
    }
}

function gameWin() {
    gameState.gameActive = false;
    
    // Victory effect
    createParticleEffect(player.position, 0xffd700);
    
    // Play win sound
    if (typeof playSound === 'function') {
        playSound('gameWin');
    }
    
    // Show victory message briefly
    const gameContainer = document.getElementById('game-container');
    const overlay = document.createElement('div');
    overlay.id = 'game-win-overlay';
    overlay.innerHTML = `
        <div class="victory-message" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
            border: 2px solid var(--primary-pink);
            z-index: 1000;
            font-family: var(--pixelated-font);
        ">
            <h2 style="color: #ff6b9d; margin-bottom: 10px;">🎉 Amazing! You collected 10 hearts! 💕</h2>
            <p style="color: #e91e63;">Get ready for something special...</p>
        </div>
    `;
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 182, 193, 0.4);
        z-index: 999;
    `;
    gameContainer.appendChild(overlay);
    
    setTimeout(() => {
        showSection('proposal-section');
    }, 2000);
}

function gameOver() {
    gameState.gameActive = false;
    
    // Game over effect
    createParticleEffect(player.position, 0x666666);
    
    // Show game over message
    const gameContainer = document.getElementById('game-container');
    const overlay = document.createElement('div');
    overlay.id = 'game-over-overlay';
    overlay.innerHTML = `
        <div class="game-over-message" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
            border: 2px solid var(--primary-pink);
            z-index: 1000;
            font-family: var(--pixelated-font);
        ">
            <h2 style="color: #e91e63; margin-bottom: 15px;">Oops! Try Again! 💖</h2>
            <p style="color: #ff6b9d; margin-bottom: 20px;">Hearts collected: ${gameState.score}/10</p>
            <button onclick="restartGame()" class="btn btn-valentine">Play Again 🎮</button>
        </div>
    `;
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        z-index: 999;
    `;
    gameContainer.appendChild(overlay);
}

function restartGame() {
    // Remove any existing overlays
    const gameContainer = document.getElementById('game-container');
    const existingOverlay = document.getElementById('game-over-overlay');
    if (existingOverlay) {
        gameContainer.removeChild(existingOverlay);
    }
    
    // Reset game UI
    document.getElementById('game-ui').innerHTML = `
        <div class="score">Hearts Collected: <span id="score">0</span>/10</div>
        <div class="instructions">Use ← → arrow keys to collect hearts! 💖</div>
    `;
    
    // Clear game scene
    if (gameScene) {
        hearts.forEach(heart => gameScene.remove(heart));
        obstacles.forEach(obstacle => gameScene.remove(obstacle));
        gameWorld.forEach(grid => gameScene.remove(grid));
    }
    
    // Restart game
    setTimeout(() => {
        initGame();
    }, 100);
}

// ===== ERROR HANDLING =====
function showGameError(message) {
    const gameUI = document.getElementById('game-ui');
    gameUI.innerHTML = `
        <div class="game-error-message" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
            border: 2px solid #ff6b9d;
        ">
            <h2 style="color: #e91e63; margin-bottom: 15px;">🎮 Game Loading Issue</h2>
            <p style="color: #666; margin-bottom: 20px;">${message}</p>
            <p style="color: #ff6b9d; margin-bottom: 20px; font-size: 0.9rem;">
                This might be due to browser compatibility. Try refreshing the page!
            </p>
            <button onclick="location.reload()" class="btn btn-valentine">
                🔄 Refresh Page
            </button>
            <br><br>
            <button onclick="skipToProposal()" class="btn btn-secondary" style="margin-top: 10px;">
                💕 Skip to Proposal
            </button>
        </div>
    `;
}

function skipToProposal() {
    console.log('⏭️ Skipping to proposal section');
    showSection('proposal-section');
}

// ===== DEBUGGING HELPERS =====
function checkThreeJS() {
    console.log('🔍 Checking Three.js availability...');
    console.log('THREE object:', typeof THREE);
    
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js not loaded!');
        return false;
    }
    
    console.log('✅ Three.js version:', THREE.REVISION);
    
    // Test basic Three.js functionality
    try {
        const testScene = new THREE.Scene();
        const testGeometry = new THREE.BoxGeometry(1, 1, 1);
        const testMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const testMesh = new THREE.Mesh(testGeometry, testMaterial);
        testScene.add(testMesh);
        console.log('✅ Three.js basic functionality working');
        return true;
    } catch (error) {
        console.error('❌ Three.js functionality test failed:', error);
        return false;
    }
}

// Check Three.js when game module loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        checkThreeJS();
    }, 2000);
});