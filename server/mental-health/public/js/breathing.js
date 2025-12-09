// Breathing Exercise Logic - 4-7-8 Technique

document.addEventListener('DOMContentLoaded', () => {
    const breathingCircle = document.getElementById('breathingCircle');
    const breathingText = document.getElementById('breathingText');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');

    let isRunning = false;
    let isPaused = false;
    let currentPhase = 0;
    let phaseTimer = null;
    let cycleCount = 0;

    const phases = [
        { name: 'Get Ready', duration: 3, class: '' },
        { name: 'Breathe In', duration: 4, class: 'inhale' },
        { name: 'Hold', duration: 7, class: 'hold' },
        { name: 'Breathe Out', duration: 8, class: 'exhale' }
    ];

    function startBreathing() {
        if (isRunning && !isPaused) return;

        isRunning = true;
        isPaused = false;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';

        if (currentPhase === 0) {
            showNotification('Starting breathing exercise...', 'info');
        }

        runPhase();
    }

    function pauseBreathing() {
        isPaused = true;
        clearTimeout(phaseTimer);
        pauseBtn.textContent = 'Resume';
        pauseBtn.classList.remove('btn-secondary');
        pauseBtn.classList.add('btn-primary');

        pauseBtn.onclick = () => {
            isPaused = false;
            pauseBtn.textContent = 'Pause';
            pauseBtn.classList.remove('btn-primary');
            pauseBtn.classList.add('btn-secondary');
            runPhase();
        };
    }

    function resetBreathing() {
        isRunning = false;
        isPaused = false;
        currentPhase = 0;
        cycleCount = 0;
        clearTimeout(phaseTimer);

        breathingText.textContent = 'Get Ready';
        breathingCircle.className = 'breathing-circle';

        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        pauseBtn.textContent = 'Pause';
        pauseBtn.classList.remove('btn-primary');
        pauseBtn.classList.add('btn-secondary');
        pauseBtn.onclick = pauseBreathing;

        showNotification('Breathing exercise reset', 'info');
    }

    function runPhase() {
        if (!isRunning || isPaused) return;

        const phase = phases[currentPhase];
        breathingText.textContent = phase.name;
        breathingCircle.className = `breathing-circle ${phase.class}`;

        let timeLeft = phase.duration;
        let countdown = setInterval(() => {
            if (isPaused) {
                clearInterval(countdown);
                return;
            }

            timeLeft--;
            if (timeLeft > 0 && currentPhase > 0) {
                breathingText.textContent = `${phase.name}\n${timeLeft}`;
            }

            if (timeLeft <= 0) {
                clearInterval(countdown);
            }
        }, 1000);

        phaseTimer = setTimeout(() => {
            currentPhase++;

            // Complete one cycle
            if (currentPhase >= phases.length) {
                currentPhase = 1; // Skip "Get Ready" on subsequent cycles
                cycleCount++;

                if (cycleCount % 3 === 0) {
                    showNotification(`Great! You've completed ${cycleCount} cycles.`, 'success');
                }
            }

            runPhase();
        }, phase.duration * 1000);
    }

    // Event listeners
    startBtn.addEventListener('click', startBreathing);
    pauseBtn.addEventListener('click', pauseBreathing);
    resetBtn.addEventListener('click', resetBreathing);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!isRunning || isPaused) {
                startBreathing();
            } else {
                pauseBreathing();
            }
        } else if (e.code === 'Escape') {
            resetBreathing();
        }
    });
});
