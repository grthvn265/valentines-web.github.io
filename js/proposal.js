let proposalState = {
    noButtonPosition: { x: 0, y: 0 },
    evasionDistance: 80,
    clickCount: 0,
    isEvading: false
};

function initProposal() {
    const proposalSection = document.getElementById('proposal-section');
    const noButton = document.getElementById('no-btn');
    const yesButton = document.getElementById('yes-btn');
    
    // Enhanced proposal title with heartbeat
    document.querySelector('.proposal-title').style.animation = 'heartbeat 2s ease-in-out infinite';
    // Initialize button positions
    const container = document.querySelector('.proposal-buttons');
    const containerRect = container.getBoundingClientRect();
    
    proposalState.noButtonPosition = {
        x: noButton.offsetLeft,
        y: noButton.offsetTop
    };
    
    // Set up evasive button behavior
    initEvasiveButton();
    
    console.log('💕 Proposal initialized with evasive "No" button!');
}

// ===== TASK 4.2: THE EVASIVE "NO" BUTTON =====
function initEvasiveButton() {
    const noButton = document.getElementById('no-btn');
    const container = document.querySelector('.proposal-buttons');
    
    // Make the container relative for absolute positioning
    container.style.position = 'relative';
    container.style.minHeight = '120px';
    
    // Track mouse movement around the "No" button
    document.addEventListener('mousemove', (event) => {
        if (gameState.current === 'proposal-section') {
            handleNoButtonEvasion(event, noButton, container);
        }
    });
    
    // Add click tracking for the "No" button
    noButton.addEventListener('click', handleNoClick);
    noButton.addEventListener('mouseover', () => handleNoButtonHover(noButton, container));
}

function handleNoButtonEvasion(event, noButton, container) {
    if (proposalState.isEvading) return;
    
    const buttonRect = noButton.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate distance between mouse and button center
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const distance = Math.sqrt(
        Math.pow(mouseX - buttonCenterX, 2) + 
        Math.pow(mouseY - buttonCenterY, 2)
    );
    
    // If mouse is too close, move the button!
    if (distance < proposalState.evasionDistance) {
        moveNoButtonAway(noButton, container, mouseX, mouseY);
    }
}

function moveNoButtonAway(noButton, container, mouseX, mouseY) {
    proposalState.isEvading = true;
    
    // Play evasion sound
    if (typeof playSound === 'function') {
        playSound('noButtonEscape');
    }
    
    const containerRect = container.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();
    const yesButton = document.getElementById('yes-btn');
    const yesButtonRect = yesButton.getBoundingClientRect();
    
    // Calculate new position away from mouse
    const containerWidth = containerRect.width;
    const containerHeight = Math.max(containerRect.height, 120);
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;
    
    // Calculate yes button position relative to container
    const yesButtonX = yesButtonRect.left - containerRect.left;
    const yesButtonY = yesButtonRect.top - containerRect.top;
    const yesButtonWidth = yesButtonRect.width;
    const yesButtonHeight = yesButtonRect.height;
    
    // Generate random position away from mouse and yes button
    let newX, newY;
    let attempts = 0;
    
    do {
        newX = Math.random() * (containerWidth - buttonWidth);
        newY = Math.random() * (containerHeight - buttonHeight);
        
        // Ensure the new position is far enough from mouse
        const relativeMouseX = mouseX - containerRect.left;
        const relativeMouseY = mouseY - containerRect.top;
        const distanceFromMouse = Math.sqrt(
            Math.pow(newX + buttonWidth/2 - relativeMouseX, 2) + 
            Math.pow(newY + buttonHeight/2 - relativeMouseY, 2)
        );
        
        // Check if the new position overlaps with the yes button
        const overlapsWithYes = !(newX > yesButtonX + yesButtonWidth + 10 || 
                                 newX + buttonWidth < yesButtonX - 10 || 
                                 newY > yesButtonY + yesButtonHeight + 10 || 
                                 newY + buttonHeight < yesButtonY - 10);
        
        attempts++;
    } while ((distanceFromMouse < proposalState.evasionDistance * 1.5 || overlapsWithYes) && attempts < 20);
    
    // If we couldn't find a good position after 20 attempts, place it far from yes button
    if (attempts >= 20) {
        // Place on opposite side of container from yes button
        if (yesButtonX < containerWidth / 2) {
            // Yes button is on left, place no button on right
            newX = Math.max(containerWidth - buttonWidth - 10, yesButtonX + yesButtonWidth + 20);
        } else {
            // Yes button is on right, place no button on left
            newX = Math.min(10, yesButtonX - buttonWidth - 20);
        }
        newX = Math.max(0, Math.min(newX, containerWidth - buttonWidth));
        newY = Math.random() * (containerHeight - buttonHeight);
    }
    
    // Apply the new position with animation
    noButton.style.position = 'absolute';
    noButton.style.left = newX + 'px';
    noButton.style.top = newY + 'px';
    noButton.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    // Add a little shake animation for fun
    noButton.style.animation = 'none';
    setTimeout(() => {
        noButton.style.animation = 'shake 0.5s ease-in-out';
    }, 100);
    
    // Reset evasion state after animation
    setTimeout(() => {
        proposalState.isEvading = false;
    }, 400);
    
    // Increase evasion distance slightly each time
    proposalState.evasionDistance = Math.min(proposalState.evasionDistance + 5, 120);
}

function handleNoButtonHover(noButton, container) {
    // Additional evasion on hover
    const containerRect = container.getBoundingClientRect();
    const yesButton = document.getElementById('yes-btn');
    const yesButtonRect = yesButton.getBoundingClientRect();
    
    // Calculate yes button position relative to container
    const yesButtonX = yesButtonRect.left - containerRect.left;
    const yesButtonY = yesButtonRect.top - containerRect.top;
    const yesButtonWidth = yesButtonRect.width;
    const yesButtonHeight = yesButtonRect.height;
    
    let newX, newY;
    let attempts = 0;
    
    do {
        newX = Math.random() * (containerRect.width - noButton.offsetWidth);
        newY = Math.random() * Math.max(containerRect.height, 120 - noButton.offsetHeight);
        
        // Check if the new position overlaps with the yes button
        const overlapsWithYes = !(newX > yesButtonX + yesButtonWidth + 10 || 
                                 newX + noButton.offsetWidth < yesButtonX - 10 || 
                                 newY > yesButtonY + yesButtonHeight + 10 || 
                                 newY + noButton.offsetHeight < yesButtonY - 10);
        
        attempts++;
        
        // If overlaps, try again
        if (!overlapsWithYes) break;
        
    } while (attempts < 15);
    
    // If still overlapping after attempts, place on opposite side
    if (attempts >= 15) {
        if (yesButtonX < containerRect.width / 2) {
            newX = Math.max(containerRect.width - noButton.offsetWidth - 10, yesButtonX + yesButtonWidth + 20);
        } else {
            newX = Math.min(10, yesButtonX - noButton.offsetWidth - 20);
        }
        newX = Math.max(0, Math.min(newX, containerRect.width - noButton.offsetWidth));
    }
    
    noButton.style.position = 'absolute';
    noButton.style.left = newX + 'px';
    noButton.style.top = newY + 'px';
    noButton.style.transition = 'all 0.2s ease-out';
}

// ===== ENHANCED NO BUTTON CLICK =====
function handleNoClick(event) {
    event.preventDefault();
    proposalState.clickCount++;
    
    const noButton = document.getElementById('no-btn');
    const messages = [
        "Are you sure? 🥺",
        "Really? But... 💔",
        "Please reconsider! 😢",
        "Think about our memories! 📸",
        "Just one more chance? 🙏",
        "My heart is breaking! 💔",
        "Please say yes! 😭"
    ];
    
    if (proposalState.clickCount < messages.length) {
        noButton.textContent = messages[proposalState.clickCount - 1];
        noButton.style.transform = `scale(${Math.max(0.7, 1 - proposalState.clickCount * 0.1)})`;
        noButton.style.backgroundColor = '#ffb3ba';
        noButton.style.borderColor = '#ff8a95';
        createSadParticleEffect();
    } else {
        noButton.innerHTML = '😭 Fine... maybe? 🤔';
        noButton.style.backgroundColor = '#ffd1dc';
        
        setTimeout(() => {
            // Automatically trigger yes
            document.querySelector('.proposal-title').innerHTML = 'You wore me down! That\'s dedication! 💕';
            handleYesClick();
        }, 2000);
    }
}

function handleYesClick() {
    proposalState.isEvading = false;
    if (typeof playSound === 'function') {
        playSound('confetti');
    }
    
    const celebrationSequence = [
        { delay: 0, particleCount: 100, spread: 70, origin: { y: 0.6 } },
        { delay: 200, particleCount: 50, spread: 60, origin: { y: 0.7, x: 0.2 } },
        { delay: 400, particleCount: 50, spread: 60, origin: { y: 0.7, x: 0.8 } },
        { delay: 600, particleCount: 150, spread: 80, origin: { y: 0.6 } }
    ];
    
    celebrationSequence.forEach(burst => {
        setTimeout(() => {
            confetti({
                particleCount: burst.particleCount,
                spread: burst.spread,
                origin: burst.origin,
                colors: ['#ff6b9d', '#ffc3e1', '#ff8fab', '#e91e63', '#ffffff', '#ffd700']
            });
        }, burst.delay);
    });
    
    setTimeout(() => {
        createFireworksEffect();
    }, 800);
    
    const proposalTitle = document.querySelector('.proposal-title');
    const proposalButtons = document.querySelector('.proposal-buttons');
    
    proposalTitle.innerHTML = 'YES! You made me the happiest! 💕✨';
    proposalTitle.style.animation = 'heartbeat 1s ease-in-out infinite, rainbow 3s linear infinite';
    
    proposalButtons.innerHTML = `
        <div class="celebration-message" style="
            text-align: center;
            animation: float 2s ease-in-out infinite;
            background: linear-gradient(45deg, #ff6b9d, #ffc3e1);
            padding: 30px;
            border-radius: 20px;
            margin-top: 30px;
            box-shadow: 0 10px 30px rgba(255, 107, 157, 0.4);
        ">
            <h3 style="color: white; margin-bottom: 15px; font-size: 2rem;">Happy Valentine's Day, chat! 💖</h3>
            <p style="color: white; font-size: 1.2rem; margin-bottom: 20px;">Thank you for being my everything! 🌟</p>
        </div>
    `;
    
    if (!document.getElementById('rainbow-style')) {
        const style = document.createElement('style');
        style.id = 'rainbow-style';
        style.innerHTML = `
            @keyframes rainbow {
                0% { color: #ff6b9d; }
                16% { color: #ff8fab; }
                33% { color: #e91e63; }
                50% { color: #ffc3e1; }
                66% { color: #ff6b9d; }
                83% { color: #ff8fab; }
                100% { color: #e91e63; }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px) rotate(-5deg); }
                75% { transform: translateX(5px) rotate(5deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function createSadParticleEffect() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            confetti({
                particleCount: 3,
                spread: 30,
                origin: { y: 0.3 },
                colors: ['#87ceeb', '#4682b4', '#5f9ea0'],
                gravity: 2,
                scalar: 0.8
            });
        }, i * 100);
    }
}

function createFireworksEffect() {
    // Create multiple firework bursts
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * 0.8 + 0.1;
            const y = Math.random() * 0.5 + 0.3;
            
            confetti({
                particleCount: 30,
                spread: 360,
                origin: { x, y },
                colors: ['#ff6b9d', '#ffc3e1', '#ff8fab', '#e91e63', '#ffd700'],
                gravity: 0.8,
                scalar: 1.2
            });
        }, i * 300);
    }
}

// ===== UTILITY FUNCTIONS =====
function playAgain() {
    // Reset everything and go back to memory lane
    proposalState.clickCount = 0;
    proposalState.evasionDistance = 80;
    proposalState.isEvading = false;
    
    // Reset buttons to original state
    const noButton = document.getElementById('no-btn');
    noButton.textContent = 'No';
    noButton.style = '';
    
    document.querySelector('.proposal-title').innerHTML = 'Will You Be My Valentine? 💕';
    document.querySelector('.proposal-buttons').innerHTML = `
        <button id="yes-btn" class="btn btn-valentine btn-lg me-3">Yes! 💖</button>
        <button id="no-btn" class="btn btn-secondary btn-lg">No</button>
    `;
    
    // Re-initialize event listeners
    document.getElementById('yes-btn').addEventListener('click', handleYesClick);
    document.getElementById('no-btn').addEventListener('click', handleNoClick);
    initEvasiveButton();
    
    // Go back to memory lane
    setTimeout(() => {
        showSection('memory-lane');
    }, 500);
}

// Initialize proposal when section becomes active
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit then initialize proposal
    setTimeout(() => {
        if (document.getElementById('proposal-section')) {
            initProposal();
        }
    }, 1000);
});
