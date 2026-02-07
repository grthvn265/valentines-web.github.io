// ===== EVENT LISTENERS =====
function initEventListeners() {
    console.log('🎯 Initializing event listeners...');
    
    // Start Game Button
    const gameButton = document.getElementById('start-game-btn');
    if (gameButton) {
        gameButton.addEventListener('click', () => {
            console.log('🎮 Game button clicked!');
            showSection('game-section');
            setTimeout(() => {
                console.log('🎮 Initializing game after section change...');
                initGame();
            }, 1000); // Increased delay to ensure section is fully loaded
        });
        console.log('✅ Game button event listener added');
    } else {
        console.error('❌ Game button not found!');
    }
    
    // Proposal Buttons
    const yesButton = document.getElementById('yes-btn');
    const noButton = document.getElementById('no-btn');
    
    if (yesButton) {
        yesButton.addEventListener('click', handleYesClick);
        console.log('✅ Yes button event listener added');
    } else {
        console.error('❌ Yes button not found!');
    }
    
    if (noButton) {
        noButton.addEventListener('click', handleNoClick);
        console.log('✅ No button event listener added');
    } else {
        console.error('❌ No button not found!');
    }
}