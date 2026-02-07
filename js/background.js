// ===== THREE.JS BACKGROUND PARTICLE FIELD =====
function initBackgroundScene() {
    // Create scene, camera, and renderer
    backgroundScene = new THREE.Scene();
    backgroundCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    backgroundRenderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('background-canvas'),
        alpha: true,
        antialias: true 
    });
    
    backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
    backgroundRenderer.setClearColor(0x000000, 0); // Transparent background
    
    // Create particle system
    createParticleField();
    
    // Position camera
    backgroundCamera.position.z = 5;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createParticleField() {
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    
    // Pink color palette for particles
    const pinkColors = [
        new THREE.Color(0xff6b9d), // Primary pink
        new THREE.Color(0xffc3e1), // Secondary pink
        new THREE.Color(0xff8fab), // Accent pink
        new THREE.Color(0xe91e63)  // Deep pink
    ];
    
    for (let i = 0; i < particleCount; i++) {
        // Random positions
        positions.push((Math.random() - 0.5) * 20);
        positions.push((Math.random() - 0.5) * 20);
        positions.push((Math.random() - 0.5) * 20);
        
        // Random colors from palette
        const color = pinkColors[Math.floor(Math.random() * pinkColors.length)];
        colors.push(color.r, color.g, color.b);
        
        // Random sizes
        sizes.push(Math.random() * 3 + 1);
        
        // Store particle data for animation
        particles.push({
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            originalPosition: {
                x: positions[i * 3],
                y: positions[i * 3 + 1],
                z: positions[i * 3 + 2]
            }
        });
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    // Create heart-shaped particles using heart.png texture
    const textureLoader = new THREE.TextureLoader();
    const heartTexture = textureLoader.load(
        './assets/misc/heart.png',
        function(texture) {
            console.log('✅ Heart texture loaded for background particles');
            // Set texture settings for clean rendering
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
        },
        undefined,
        function(error) {
            console.error('❌ Failed to load heart texture, using fallback:', error);
            // Fallback to programmatic heart if image fails
            const fallbackTexture = createHeartTexture();
            material.map = fallbackTexture;
            material.needsUpdate = true;
        }
    );
    
    const material = new THREE.PointsMaterial({
        size: 0.15, // Slightly larger to show the PNG detail
        map: heartTexture,
        transparent: true,
        alphaTest: 0.1,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(geometry, material);
    backgroundScene.add(particleSystem);
    
    // Store reference for animation
    window.particleSystem = particleSystem;
}

function createHeartTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Create heart shape
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.arc(8, 10, 4, 0, Math.PI * 2);
    ctx.arc(16, 10, 4, 0, Math.PI * 2);
    ctx.arc(12, 18, 6, 0, Math.PI);
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function animateBackground() {
    requestAnimationFrame(animateBackground);
    
    // Animate particles
    if (window.particleSystem) {
        const positions = window.particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            const index = i * 3;
            
            // Update positions
            positions[index] += particle.velocity.x;
            positions[index + 1] += particle.velocity.y;
            positions[index + 2] += particle.velocity.z;
            
            // Wrap around screen edges
            if (positions[index] > 10) positions[index] = -10;
            if (positions[index] < -10) positions[index] = 10;
            if (positions[index + 1] > 10) positions[index + 1] = -10;
            if (positions[index + 1] < -10) positions[index + 1] = 10;
        }
        
        window.particleSystem.geometry.attributes.position.needsUpdate = true;
        
        // Rotate particle system slowly
        window.particleSystem.rotation.y += 0.001;
    }
    
    backgroundRenderer.render(backgroundScene, backgroundCamera);
}

// ===== MOUSE INTERACTION FOR PARTICLES =====
let mouse = { x: 0, y: 0 };
document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Make particles react to mouse
    if (window.particleSystem) {
        const positions = window.particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            const index = i * 3;
            
            // Calculate distance to mouse
            const dx = positions[index] - (mouse.x * 5);
            const dy = positions[index + 1] - (mouse.y * 5);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Repel particles from mouse
            if (distance < 3) {
                particle.velocity.x += (dx / distance) * 0.001;
                particle.velocity.y += (dy / distance) * 0.001;
            }
            
            // Add some damping
            particle.velocity.x *= 0.99;
            particle.velocity.y *= 0.99;
        }
    }
});