// ===== VALENTINE'S BACKGROUND MUSIC SYSTEM =====

let audioState = {
    backgroundMusic: null,
    isMuted: false,
    musicVolume: 0.3,
    currentTrackIndex: 0,
    isPlaying: false,
    tracks: [
        {
            title: "Melancholic Walk",
            src: "./assets/audio/Melancholic Walk.mp3"
        },
        {
            title: "A Lonely Cherry Tree", 
            src: "./assets/audio/A Lonely Cherry Tree.mp3"
        }
    ]
};

// ===== AUDIO SYSTEM INITIALIZATION =====
function initAudioSystem() {
    // Create audio controls UI
    createAudioControls();
    
    // Initialize background music
    initBackgroundMusic();
    
    console.log('🎵 Background music system initialized!');
}

function createAudioControls() {
    const audioControls = document.createElement('div');
    audioControls.id = 'audio-controls';
    audioControls.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
        width: 450px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        padding: 15px 20px;
        border-radius: 15px;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(255, 107, 157, 0.4);
        border: 2px solid rgba(255, 107, 157, 0.3);
        overflow: hidden;
    `;
    
    audioControls.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <button id="music-toggle" class="audio-btn" title="Play/Pause Music">💖</button>
            <button id="next-track" class="audio-btn" title="Next Track">💕</button>
            <button id="mute-toggle" class="audio-btn" title="Mute Music">🌸</button>
        </div>
        <div style="flex: 1; margin: 0 15px; display: flex; flex-direction: column; gap: 8px; min-width: 0;">
            <div id="track-info" style="font-size: 0.9rem; color: #ff6b9d; font-weight: bold; text-align: center; min-height: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Loading...</div>
            <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                <span id="current-time" style="font-size: 0.7rem; color: #c44569; min-width: 35px; flex-shrink: 0;">0:00</span>
                <div id="progress-container" style="flex: 1; height: 6px; background: rgba(255, 107, 157, 0.2); border-radius: 3px; cursor: pointer; overflow: hidden; min-width: 0;">
                    <div id="progress-fill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #ff6b9d, #c44569); transition: width 0.1s ease;"></div>
                </div>
                <span id="total-time" style="font-size: 0.7rem; color: #c44569; min-width: 35px; flex-shrink: 0;">0:00</span>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <span style="font-size: 0.7rem; color: #c44569;">🔊</span>
            <input type="range" id="volume-slider" min="0" max="100" value="30" 
                   title="Volume Control" style="width: 70px; accent-color: #ff6b9d;">
        </div>
    `;
    
    document.body.appendChild(audioControls);
    
    // Add CSS for audio buttons
    const audioStyle = document.createElement('style');
    audioStyle.innerHTML = `
        .audio-btn {
            background: rgba(255, 107, 157, 0.1);
            border: 2px solid rgba(255, 107, 157, 0.3);
            font-size: 1.4rem;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 8px;
            transition: all 0.2s ease;
            color: #ff6b9d;
            min-width: 45px;
            text-align: center;
        }
        .audio-btn:hover {
            background: rgba(255, 107, 157, 0.2);
            transform: scale(1.05);
            border-color: rgba(255, 107, 157, 0.5);
        }
        .audio-btn.active {
            background: rgba(255, 107, 157, 0.3);
            border-color: rgba(255, 107, 157, 0.6);
        }
        #volume-slider {
            accent-color: #ff6b9d;
            height: 4px;
        }
    `;
    document.head.appendChild(audioStyle);
    
    // Set up event listeners
    setupAudioControls();
}

function setupAudioControls() {
    const musicToggle = document.getElementById('music-toggle');
    const nextTrack = document.getElementById('next-track');
    const muteToggle = document.getElementById('mute-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    const progressContainer = document.getElementById('progress-container');
    
    musicToggle.addEventListener('click', toggleBackgroundMusic);
    nextTrack.addEventListener('click', playNextTrack);
    muteToggle.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', (e) => {
        audioState.musicVolume = e.target.value / 100;
        if (audioState.backgroundMusic) {
            audioState.backgroundMusic.volume = audioState.isMuted ? 0 : audioState.musicVolume;
        }
    });
    
    // Progress bar click to seek
    progressContainer.addEventListener('click', (e) => {
        if (audioState.backgroundMusic && audioState.backgroundMusic.duration) {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = clickX / rect.width;
            audioState.backgroundMusic.currentTime = progress * audioState.backgroundMusic.duration;
        }
    });
}

function initBackgroundMusic() {
    // Create HTML5 Audio element for MP3 playback
    audioState.backgroundMusic = new Audio();
    audioState.backgroundMusic.volume = audioState.musicVolume;
    audioState.backgroundMusic.loop = false; // We'll handle track switching
    
    // Load first track
    loadTrack(audioState.currentTrackIndex);
    
    // Auto-play next track when current ends
    audioState.backgroundMusic.addEventListener('ended', playNextTrack);
    
    // Update track info when metadata loads
    audioState.backgroundMusic.addEventListener('loadedmetadata', updateTrackInfo);
    
    // Update progress bar and time during playback
    audioState.backgroundMusic.addEventListener('timeupdate', updateProgress);
    
    // Autoplay music when loaded
    audioState.backgroundMusic.addEventListener('canplaythrough', () => {
        if (!audioState.isPlaying) {
            autoplayMusic();
        }
    });
    
    console.log('🎶 Loaded track:', audioState.tracks[audioState.currentTrackIndex].title);
}

function autoplayMusic() {
    // Try to autoplay (may be blocked by browser policy)
    audioState.backgroundMusic.play().then(() => {
        audioState.isPlaying = true;
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.textContent = '💗';
            musicToggle.classList.add('active');
        }
        console.log('🎵 Autoplay started:', audioState.tracks[audioState.currentTrackIndex].title);
    }).catch(error => {
        console.log('🔇 Autoplay blocked by browser policy. User interaction required.');
        // Add click listener to start music on first user interaction
        const startOnInteraction = () => {
            if (!audioState.isPlaying) {
                audioState.backgroundMusic.play().then(() => {
                    audioState.isPlaying = true;
                    const musicToggle = document.getElementById('music-toggle');
                    if (musicToggle) {
                        musicToggle.textContent = '💗';
                        musicToggle.classList.add('active');
                    }
                    console.log('🎵 Music started on user interaction');
                });
            }
            document.removeEventListener('click', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction);
    });
}

function loadTrack(index) {
    if (index >= 0 && index < audioState.tracks.length) {
        const track = audioState.tracks[index];
        audioState.backgroundMusic.src = track.src;
        audioState.currentTrackIndex = index;
        updateTrackInfo();
        console.log('🎵 Loading:', track.title);
    }
}

function updateTrackInfo() {
    const trackInfo = document.getElementById('track-info');
    if (trackInfo) {
        trackInfo.textContent = audioState.tracks[audioState.currentTrackIndex].title;
    }
    
    // Update total time when metadata loads
    const totalTime = document.getElementById('total-time');
    if (totalTime && audioState.backgroundMusic.duration) {
        totalTime.textContent = formatTime(audioState.backgroundMusic.duration);
    }
}

function updateProgress() {
    if (audioState.backgroundMusic && audioState.backgroundMusic.duration) {
        const progress = (audioState.backgroundMusic.currentTime / audioState.backgroundMusic.duration) * 100;
        const progressFill = document.getElementById('progress-fill');
        const currentTime = document.getElementById('current-time');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (currentTime) {
            currentTime.textContent = formatTime(audioState.backgroundMusic.currentTime);
        }
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function playNextTrack() {
    audioState.currentTrackIndex = (audioState.currentTrackIndex + 1) % audioState.tracks.length;
    loadTrack(audioState.currentTrackIndex);
    
    if (audioState.isPlaying) {
        audioState.backgroundMusic.play().catch(console.error);
    }
}

// ===== MUSIC CONTROL FUNCTIONS =====
function toggleBackgroundMusic() {
    const musicToggle = document.getElementById('music-toggle');
    
    if (audioState.backgroundMusic) {
        if (audioState.isPlaying) {
            // Pause music
            audioState.backgroundMusic.pause();
            audioState.isPlaying = false;
            musicToggle.textContent = '💖';
            musicToggle.classList.remove('active');
            console.log('⏸️ Music paused');
        } else {
            // Play music
            audioState.backgroundMusic.play().then(() => {
                audioState.isPlaying = true;
                musicToggle.textContent = '💗';
                musicToggle.classList.add('active');
                console.log('▶️ Music playing:', audioState.tracks[audioState.currentTrackIndex].title);
            }).catch(error => {
                console.error('❌ Playback failed:', error);
            });
        }
    }
}

function toggleMute() {
    audioState.isMuted = !audioState.isMuted;
    const muteToggle = document.getElementById('mute-toggle');
    
    if (audioState.isMuted) {
        muteToggle.textContent = '🥀';
        muteToggle.classList.add('active');
        if (audioState.backgroundMusic) {
            audioState.backgroundMusic.volume = 0;
        }
    } else {
        muteToggle.textContent = '🌸';
        muteToggle.classList.remove('active');
        if (audioState.backgroundMusic) {
            audioState.backgroundMusic.volume = audioState.musicVolume;
        }
    }
}

// Initialize audio system
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initAudioSystem();
    }, 1000);
});