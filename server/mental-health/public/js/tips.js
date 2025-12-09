// Study Tips and Pomodoro Timer Logic

document.addEventListener('DOMContentLoaded', () => {
    // Pomodoro Timer
    const timerDisplay = document.getElementById('timerDisplay');
    const timerLabel = document.getElementById('timerLabel');
    const timerProgress = document.getElementById('timerProgress');
    const startTimer = document.getElementById('startTimer');
    const pauseTimer = document.getElementById('pauseTimer');
    const resetTimer = document.getElementById('resetTimer');
    const completedPomodoros = document.getElementById('completedPomodoros');
    const totalFocusTime = document.getElementById('totalFocusTime');

    // Check if timer elements exist (we might not be on tips page)
    if (!timerDisplay || !startTimer) {
        return;
    }

    const FOCUS_TIME = 25 * 60; // 25 minutes
    const BREAK_TIME = 5 * 60;  // 5 minutes
    const CIRCUMFERENCE = 565.48; // 2 * π * 90

    let timeLeft = FOCUS_TIME;
    let totalTime = FOCUS_TIME;
    let isRunning = false;
    let isPaused = false;
    let isFocusMode = true;
    let timerInterval = null;
    let pomodoroCount = 0;
    let totalMinutes = 0;

    function updateTimerDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
        const progress = ((totalTime - timeLeft) / totalTime) * CIRCUMFERENCE;
        timerProgress.style.strokeDashoffset = progress;
    }

    function startPomodoroTimer() {
        if (isRunning && !isPaused) return;

        isRunning = true;
        isPaused = false;
        startTimer.style.display = 'none';
        pauseTimer.style.display = 'inline-block';

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                completePhase();
            }
        }, 1000);
    }

    function pausePomodoroTimer() {
        isPaused = true;
        clearInterval(timerInterval);
        pauseTimer.textContent = 'Resume';
        pauseTimer.classList.remove('btn-secondary');
        pauseTimer.classList.add('btn-primary');

        pauseTimer.onclick = () => {
            isPaused = false;
            pauseTimer.textContent = 'Pause';
            pauseTimer.classList.remove('btn-primary');
            pauseTimer.classList.add('btn-secondary');
            pauseTimer.onclick = pausePomodoroTimer;
            startPomodoroTimer();
        };
    }

    function resetPomodoroTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        isPaused = false;
        isFocusMode = true;
        timeLeft = FOCUS_TIME;
        totalTime = FOCUS_TIME;

        timerLabel.textContent = 'Focus Time';
        updateTimerDisplay();

        startTimer.style.display = 'inline-block';
        pauseTimer.style.display = 'none';
        pauseTimer.textContent = 'Pause';
        pauseTimer.classList.remove('btn-primary');
        pauseTimer.classList.add('btn-secondary');
        pauseTimer.onclick = pausePomodoroTimer;
    }

    function completePhase() {
        clearInterval(timerInterval);

        if (isFocusMode) {
            // Focus session completed
            pomodoroCount++;
            totalMinutes += 25;
            completedPomodoros.textContent = pomodoroCount;
            totalFocusTime.textContent = totalMinutes;

            if (typeof showNotification !== 'undefined') {
                showNotification('Focus session complete! Time for a break. 🎉', 'success');
            }

            // Switch to break mode
            isFocusMode = false;
            timeLeft = BREAK_TIME;
            totalTime = BREAK_TIME;
            timerLabel.textContent = 'Break Time';
        } else {
            // Break completed
            if (typeof showNotification !== 'undefined') {
                showNotification('Break over! Ready for another focus session? 💪', 'info');
            }

            // Switch back to focus mode
            isFocusMode = true;
            timeLeft = FOCUS_TIME;
            totalTime = FOCUS_TIME;
            timerLabel.textContent = 'Focus Time';
        }

        updateTimerDisplay();
        isRunning = false;
        startTimer.style.display = 'inline-block';
        pauseTimer.style.display = 'none';

        // Play notification sound (optional)
        playNotificationSound();
    }

    function playNotificationSound() {
        // Create a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Event listeners
    startTimer.addEventListener('click', startPomodoroTimer);
    pauseTimer.addEventListener('click', pausePomodoroTimer);
    resetTimer.addEventListener('click', resetPomodoroTimer);

    // Initialize display
    updateTimerDisplay();

    // Tips Shuffle
    const shuffleTips = document.getElementById('shuffleTips');
    const tipsGrid = document.getElementById('tipsGrid');

    shuffleTips.addEventListener('click', async () => {
        // Add shuffle animation
        tipsGrid.style.opacity = '0.5';
        tipsGrid.style.transform = 'scale(0.95)';

        try {
            const response = await fetch('/api/tips?shuffle=true');
            const data = await response.json();

            if (data.success) {
                // Clear current tips
                tipsGrid.innerHTML = '';

                // Add shuffled tips
                data.data.forEach(tip => {
                    const tipCard = document.createElement('div');
                    tipCard.className = 'tip-card';
                    tipCard.dataset.category = tip.category;
                    tipCard.innerHTML = `
                        <div class="tip-icon">${tip.icon}</div>
                        <div class="tip-category">${tip.category}</div>
                        <h3 class="tip-title">${tip.title}</h3>
                        <p class="tip-description">${tip.description}</p>
                    `;
                    tipsGrid.appendChild(tipCard);
                });

                // Restore animation
                setTimeout(() => {
                    tipsGrid.style.opacity = '1';
                    tipsGrid.style.transform = 'scale(1)';
                }, 100);

                if (typeof showNotification !== 'undefined') {
                    showNotification('Tips shuffled!', 'success');
                }
            }
        } catch (error) {
            console.error('Error shuffling tips:', error);
            if (typeof showNotification !== 'undefined') {
                showNotification('Failed to shuffle tips', 'error');
            }
            tipsGrid.style.opacity = '1';
            tipsGrid.style.transform = 'scale(1)';
        }
    });

    // Add transition to tips grid
    tipsGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
});

// Format time helper
if (typeof formatTime === 'undefined') {
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
