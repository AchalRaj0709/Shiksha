// Main JavaScript - Common utilities and mobile menu

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.feature-card, .stat-card, .tip-card, .meditation-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Mock Call Functionality
    const talkBtn = document.getElementById('talkBtn');
    const callModal = document.getElementById('callModal');
    const endCallBtn = document.getElementById('endCallBtn');
    const callStatus = document.getElementById('callStatus');
    const callMessage = document.getElementById('callMessage');
    const callTimer = document.getElementById('callTimer');

    let callInterval;
    let callSeconds = 0;

    const motivationalMessages = [
        "You are stronger than you think. Take it one step at a time.",
        "It's okay to not be okay. We are here to listen.",
        "Your feelings are valid. Be kind to yourself today.",
        "Every storm runs out of rain. This too shall pass.",
        "You have survived 100% of your bad days. You got this.",
        "Rest if you must, but don't you quit. We believe in you.",
        "Focus on the present moment. Just breathe."
    ];

    if (talkBtn && callModal) {
        talkBtn.addEventListener('click', () => {
            startMockCall();
        });

        endCallBtn.addEventListener('click', () => {
            endMockCall();
        });
    }

    function startMockCall() {
        callModal.style.display = 'flex';
        callStatus.textContent = 'Connecting...';
        callMessage.style.display = 'none';
        callMessage.textContent = '';
        callSeconds = 0;
        callTimer.textContent = '00:00';

        // Disable end call initially to prevent accidental clicks
        endCallBtn.style.opacity = '0.5';
        endCallBtn.style.pointerEvents = 'none';
        setTimeout(() => {
            endCallBtn.style.opacity = '1';
            endCallBtn.style.pointerEvents = 'auto';
        }, 1000);

        // Simulate connection delay
        setTimeout(() => {
            callStatus.textContent = 'Connected';
            startTimer();

            // Show message after a short delay
            setTimeout(() => {
                const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                callMessage.textContent = `"${randomMessage}"`;
                callMessage.style.display = 'block';
            }, 1500);

        }, 2000);
    }

    function endMockCall() {
        clearInterval(callInterval);
        callModal.style.display = 'none';
    }

    function startTimer() {
        clearInterval(callInterval);
        callInterval = setInterval(() => {
            callSeconds++;
            const mins = Math.floor(callSeconds / 60);
            const secs = callSeconds % 60;
            callTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
});

// Utility function to format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Utility function to show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#86EFAC' : type === 'error' ? '#FCA5A5' : '#7DD3FC'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
