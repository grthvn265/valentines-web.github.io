// ===== POLAROID GALLERY ANIMATIONS =====
function initPolaroidGallery() {
    // Animate polaroids on initial load
    setTimeout(() => {
        animatePolaroids();
    }, 800);
}

function animatePolaroids() {
    const polaroids = document.querySelectorAll('.polaroid');
    
    polaroids.forEach((polaroid, index) => {
        const delay = parseInt(polaroid.dataset.delay) || index * 200;
        
        setTimeout(() => {
            polaroid.classList.add('animate-in');
        }, delay);
    });
}