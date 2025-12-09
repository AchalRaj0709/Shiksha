// Meditation Audio Player Logic

document.addEventListener('DOMContentLoaded', () => {
    const meditationPlayer = document.getElementById('meditationPlayer');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const closePlayer = document.getElementById('closePlayer');
    const playerTitle = document.getElementById('playerTitle');
    const progressBar = document.getElementById('progressBar');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');

    // Check if elements exist (we might not be on meditation page)
    if (!meditationPlayer || !audioPlayer || !playPauseBtn) {
        return;
    }

    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const visualizerBars = document.querySelectorAll('.visualizer-bar');

    let currentMeditation = null;

    // Play meditation session
    document.querySelectorAll('.play-meditation').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.meditation-card');
            const title = card.dataset.title;
            const audioUrl = card.dataset.audio;

            loadMeditation(title, audioUrl);
        });
    });

    function loadMeditation(title, audioUrl) {
        playerTitle.textContent = title;
        audioPlayer.src = audioUrl;
        meditationPlayer.style.display = 'block';

        // Scroll to player
        meditationPlayer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Auto play
        setTimeout(() => {
            audioPlayer.play();
            updatePlayPauseButton(true);
        }, 300);

        // Show notification if function exists
        if (typeof showNotification !== 'undefined') {
            showNotification(`Now playing: ${title}`, 'info');
        }
    }

    // Play/Pause toggle
    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            updatePlayPauseButton(true);
        } else {
            audioPlayer.pause();
            updatePlayPauseButton(false);
        }
    });

    function updatePlayPauseButton(isPlaying) {
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            startVisualizer();
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            stopVisualizer();
        }
    }

    // Close player
    closePlayer.addEventListener('click', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        meditationPlayer.style.display = 'none';
        updatePlayPauseButton(false);
    });

    // Update progress bar and time
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.setProperty('--progress', `${progress}%`);
        progressBar.querySelector('::before') || (progressBar.style.background = `linear-gradient(to right, var(--gradient-primary) ${progress}%, var(--border-color) ${progress}%)`);

        currentTime.textContent = formatTime(Math.floor(audioPlayer.currentTime));
    });

    // Set total time when metadata loads
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTime.textContent = formatTime(Math.floor(audioPlayer.duration));
    });

    // Auto close when ended
    audioPlayer.addEventListener('ended', () => {
        if (typeof showNotification !== 'undefined') {
            showNotification('Meditation session completed! 🧘', 'success');
        }
        updatePlayPauseButton(false);
        setTimeout(() => {
            meditationPlayer.style.display = 'none';
        }, 2000);
    });

    // Visualizer animation
    let visualizerInterval;

    function startVisualizer() {
        stopVisualizer();
        visualizerInterval = setInterval(() => {
            visualizerBars.forEach(bar => {
                const height = Math.random() * 40 + 20;
                bar.style.height = `${height}px`;
            });
        }, 200);
    }

    function stopVisualizer() {
        if (visualizerInterval) {
            clearInterval(visualizerInterval);
            visualizerBars.forEach(bar => {
                bar.style.height = '20px';
            });
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (meditationPlayer.style.display === 'none') return;

        if (e.code === 'Space') {
            e.preventDefault();
            playPauseBtn.click();
        } else if (e.code === 'Escape') {
            closePlayer.click();
        } else if (e.code === 'ArrowLeft') {
            audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
        } else if (e.code === 'ArrowRight') {
            audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
        }
    });
});

// Format time helper (if not already defined in main.js)
if (typeof formatTime === 'undefined') {
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
