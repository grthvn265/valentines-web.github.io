class MusicPlayer {
    constructor() {
        this.tracks = [
            {
                title: "Melancholic Walk",
                src: "./assets/audio/Melancholic Walk.mp3"
            },
            {
                title: "A Lonely Cherry Tree", 
                src: "./assets/audio/A Lonely Cherry Tree.mp3"
            }
        ];
        
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isShuffleOn = false;
        this.isCollapsed = false;
        this.volume = 0.5;
        
        this.initializePlayer();
    }
    
    initializePlayer() {
        console.log('🎵 Initializing Valentine\'s Music Player...');
        
        // Get DOM elements
        this.audio = document.getElementById('audio-player');
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.playerToggle = document.getElementById('player-toggle');
        this.playerContent = document.getElementById('player-content');
        this.trackTitle = document.getElementById('track-title');
        this.trackTime = document.getElementById('track-time');
        this.progressBar = document.getElementById('progress-bar');
        this.progressFill = document.getElementById('progress-fill');
        this.volumeSlider = document.getElementById('volume-slider');
        
        this.audio.volume = this.volume;
        this.volumeSlider.value = this.volume * 100;
        
        // Load first track
        this.loadTrack(this.currentTrackIndex);
        
        // Add event listeners
        this.addEventListeners();
        
        console.log('✅ Music Player initialized with', this.tracks.length, 'tracks');
    }
    
    addEventListeners() {
        // Control buttons
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.playerToggle.addEventListener('click', () => this.togglePlayer());
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateTrackInfo());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('error', (e) => this.handleError(e));
        
        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        
        // Volume slider
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    loadTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        
        const track = this.tracks[index];
        this.audio.src = track.src;
        this.trackTitle.textContent = track.title;
        this.trackTime.textContent = '0:00 / 0:00';
        this.progressFill.style.width = '0%';
        
        console.log('🎶 Loaded track:', track.title);
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playBtn.textContent = '⏸️';
            this.playBtn.setAttribute('aria-label', 'Pause');
            console.log('▶️ Playing:', this.tracks[this.currentTrackIndex].title);
        }).catch(error => {
            console.error('❌ Playback failed:', error);
            this.handleError(error);
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playBtn.textContent = '▶️';
        this.playBtn.setAttribute('aria-label', 'Play');
        console.log('⏸️ Paused');
    }
    
    nextTrack() {
        if (this.isShuffleOn) {
            this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length);
        } else {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        }
        
        this.loadTrack(this.currentTrackIndex);
        
        if (this.isPlaying) {
            this.play();
        }
    }
    
    previousTrack() {
        if (this.audio.currentTime > 3) {
            // If more than 3 seconds played, restart current track
            this.audio.currentTime = 0;
        } else {
            // Go to previous track
            this.currentTrackIndex = this.currentTrackIndex === 0 
                ? this.tracks.length - 1 
                : this.currentTrackIndex - 1;
            
            this.loadTrack(this.currentTrackIndex);
            
            if (this.isPlaying) {
                this.play();
            }
        }
    }
    
    toggleShuffle() {
        this.isShuffleOn = !this.isShuffleOn;
        this.shuffleBtn.classList.toggle('active', this.isShuffleOn);
        this.shuffleBtn.setAttribute('aria-label', this.isShuffleOn ? 'Shuffle On' : 'Shuffle Off');
        
        console.log('🔀 Shuffle:', this.isShuffleOn ? 'ON' : 'OFF');
    }
    
    togglePlayer() {
        this.isCollapsed = !this.isCollapsed;
        this.playerContent.classList.toggle('collapsed', this.isCollapsed);
        this.playerToggle.textContent = this.isCollapsed ? '▲' : '▼';
        
        console.log('🎵 Player:', this.isCollapsed ? 'Collapsed' : 'Expanded');
    }
    
    updateTrackInfo() {
        const duration = this.formatTime(this.audio.duration);
        this.trackTime.textContent = `0:00 / ${duration}`;
    }
    
    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = `${progress}%`;
            
            const current = this.formatTime(this.audio.currentTime);
            const duration = this.formatTime(this.audio.duration);
            this.trackTime.textContent = `${current} / ${duration}`;
        }
    }
    
    setProgress(e) {
        if (this.audio.duration) {
            const rect = this.progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = (clickX / rect.width);
            this.audio.currentTime = progress * this.audio.duration;
        }
    }
    
    setVolume(value) {
        this.volume = value / 100;
        this.audio.volume = this.volume;
        console.log('🔊 Volume:', Math.round(this.volume * 100) + '%');
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    handleKeyboard(e) {
        // Only handle if not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowRight':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.nextTrack();
                }
                break;
            case 'ArrowLeft':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.previousTrack();
                }
                break;
            case 'KeyS':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.toggleShuffle();
                }
                break;
        }
    }
    
    handleError(error) {
        console.error('🚫 Audio Error:', error);
        this.pause();
        this.trackTitle.textContent = 'Error loading track';
        this.trackTime.textContent = 'Try next track';
        
        // Auto-advance to next track on error
        setTimeout(() => {
            if (!this.audio.src || this.audio.error) {
                this.nextTrack();
            }
        }, 2000);
    }
}

// ===== INITIALIZE MUSIC PLAYER =====
let valentineMusicPlayer = null;

function initMusicPlayer() {
    if (document.getElementById('music-player')) {
        valentineMusicPlayer = new MusicPlayer();
        console.log('✅ Valentine\'s Music Player ready!');
    } else {
        console.warn('⚠️ Music player element not found');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other scripts are loaded
    setTimeout(() => {
        initMusicPlayer();
    }, 1000);
});

// Export for global access
window.valentineMusicPlayer = valentineMusicPlayer;