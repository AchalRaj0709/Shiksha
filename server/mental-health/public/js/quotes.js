// Motivational Quotes Logic

document.addEventListener('DOMContentLoaded', () => {
    const refreshQuote = document.getElementById('refreshQuote');
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');

    // Check if elements exist (we might not be on quotes page)
    if (!refreshQuote || !quoteText) {
        return;
    }

    // Refresh quote
    refreshQuote.addEventListener('click', async () => {
        // Add loading animation
        refreshQuote.disabled = true;
        refreshQuote.style.opacity = '0.6';
        const svg = refreshQuote.querySelector('svg');
        svg.style.animation = 'spin 0.5s linear';

        try {
            const response = await fetch('/api/quotes');
            const data = await response.json();

            if (data.success) {
                // Fade out current quote
                quoteText.style.opacity = '0';
                quoteAuthor.style.opacity = '0';

                setTimeout(() => {
                    // Update quote
                    quoteText.textContent = data.data.text;
                    quoteAuthor.textContent = `— ${data.data.author}`;

                    // Fade in new quote
                    quoteText.style.opacity = '1';
                    quoteAuthor.style.opacity = '1';
                }, 300);

                if (typeof showNotification !== 'undefined') {
                    showNotification('New quote loaded!', 'success');
                }
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
            if (typeof showNotification !== 'undefined') {
                showNotification('Failed to load new quote', 'error');
            }
        } finally {
            // Remove loading state
            setTimeout(() => {
                refreshQuote.disabled = false;
                refreshQuote.style.opacity = '1';
                svg.style.animation = '';
            }, 500);
        }
    });

    // Add transition to quote elements
    quoteText.style.transition = 'opacity 0.3s ease';
    quoteAuthor.style.transition = 'opacity 0.3s ease';

    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Keyboard shortcut to refresh
    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            refreshQuote.click();
        }
    });

    // Auto-refresh every 30 seconds (optional - can be disabled)
    let autoRefreshEnabled = false;
    let autoRefreshInterval;

    if (autoRefreshEnabled) {
        autoRefreshInterval = setInterval(() => {
            refreshQuote.click();
        }, 30000);
    }

    // Affirmation cards hover effect
    const affirmationCards = document.querySelectorAll('.affirmation-card');
    affirmationCards.forEach(card => {
        card.addEventListener('click', () => {
            // Copy affirmation to clipboard
            const text = card.querySelector('p').textContent;
            navigator.clipboard.writeText(text).then(() => {
                if (typeof showNotification !== 'undefined') {
                    showNotification('Affirmation copied to clipboard!', 'success');
                }

                // Visual feedback
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });

        // Add cursor pointer
        card.style.cursor = 'pointer';
    });
});
