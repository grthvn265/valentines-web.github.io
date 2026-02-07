// ===== SECTION MANAGEMENT (SPA) =====
function showSection(sectionId) {
    // Add fade out effect to current section
    const currentSection = document.querySelector('.section.active');
    if (currentSection) {
        currentSection.style.opacity = '0';
        currentSection.style.transform = 'translateY(-30px)';
    }
    
    // Hide all sections
    setTimeout(() => {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
        });
        
        // Show target section with fade in
        const targetSection = document.getElementById(sectionId);
        targetSection.classList.add('active');
        
        // Trigger entrance animations based on section
        setTimeout(() => {
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
            
            // Special entrance for memory lane
            if (sectionId === 'memory-lane') {
                animatePolaroids();
            }
            
            gameState.current = sectionId;
        }, 50);
    }, 400);
}