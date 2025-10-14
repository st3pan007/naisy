/**
 * Popup Loader
 * Loads and displays popup from Supabase
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        delay: 1500, // Show popup after 1.5 seconds
        websiteId: 1
    };

    /**
     * Check if popup was already seen
     */
    function wasPopupSeen(popupId) {
        const seenKey = `naisy_popup_seen_${popupId}`;
        return localStorage.getItem(seenKey) === 'true';
    }

    /**
     * Mark popup as seen
     */
    function markPopupAsSeen(popupId) {
        const seenKey = `naisy_popup_seen_${popupId}`;
        localStorage.setItem(seenKey, 'true');
    }

    /**
     * Create popup HTML
     */
    function createPopupHTML(popup) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.innerHTML = `
            <div class="popup-modal">
                <button class="popup-close" aria-label="Zavřít">×</button>
                <h2 class="popup-title">${escapeHtml(popup.title || '')}</h2>
                <div class="popup-divider"></div>
                <p class="popup-text">${escapeHtml(popup.text || '')}</p>
            </div>
        `;

        return overlay;
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

    /**
     * Show popup
     */
    function showPopup(popup) {
        const popupElement = createPopupHTML(popup);
        document.body.appendChild(popupElement);

        // Close handlers
        const closeBtn = popupElement.querySelector('.popup-close');
        const closePopup = () => {
            popupElement.style.opacity = '0';
            setTimeout(() => {
                popupElement.remove();
            }, 300);
            markPopupAsSeen(popup.id);
        };

        closeBtn.addEventListener('click', closePopup);
        popupElement.addEventListener('click', (e) => {
            if (e.target === popupElement) {
                closePopup();
            }
        });

        // ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    /**
     * Load and display popup
     */
    async function loadPopup() {
        try {
            // Fetch popup from Supabase
            const cacheKey = 'naisy_popup_data';
            const popups = await window.NaisyDB.getCached(
                cacheKey,
                () => window.NaisyDB.fetch('popups', {
                    select: '*',
                    eq: { 
                        website_id: CONFIG.websiteId,
                        is_active: true 
                    }
                })
            );

            if (!popups || popups.length === 0) {
                return;
            }

            const popup = popups[0];

            // Check if already seen
            if (wasPopupSeen(popup.id)) {
                return;
            }

            // Check if has content
            if (!popup.title && !popup.text) {
                return;
            }

            // Show popup after delay
            setTimeout(() => {
                showPopup(popup);
            }, CONFIG.delay);

        } catch (error) {
            console.error('Error loading popup:', error);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPopup);
    } else {
        loadPopup();
    }
})();
