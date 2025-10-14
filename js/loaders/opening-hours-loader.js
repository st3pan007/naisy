/**
 * Opening Hours Loader
 * Loads opening hours from Supabase
 */

(function() {
    'use strict';

    const CONFIG = {
        websiteId: 1
    };

    async function loadOpeningHours(section, containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                return;
            }

            const cacheKey = `naisy_hours_${section}`;
            const hours = await window.NaisyDB.getCached(
                cacheKey,
                () => window.NaisyDB.fetch('opening_hours', {
                    select: 'days_label,time_range,note,display_order',
                    eq: { 
                        website_id: CONFIG.websiteId,
                        section: section
                    },
                    order: 'display_order.asc'
                })
            );

            if (!hours || hours.length === 0) {
                return;
            }

            renderHours(hours, container);

        } catch (error) {
            console.error('Error loading opening hours:', error);
        }
    }

    function renderHours(hours, container) {
        let html = '<div class="hours-list">';
        
        // First pass: render all regular hours (rows with days_label AND time_range)
        hours.forEach(hour => {
            // If both days_label and time_range exist, it's a regular hour entry
            if (hour.days_label && hour.days_label.trim() !== '' && 
                hour.time_range && hour.time_range.trim() !== '') {
                html += `<div class="hours-item">`;
                html += `<span class="day">${escapeHtml(hour.days_label)}</span>`;
                html += `<span class="time">${escapeHtml(hour.time_range)}</span>`;
                html += `</div>`;
            }
        });

        html += '</div>';
        
        // Second pass: collect notes (rows with note, regardless of other fields)
        hours.forEach(hour => {
            if (hour.note && hour.note.trim() !== '') {
                html += `<p class="hours-note"><i class="ph-info"></i> <span>${escapeHtml(hour.note)}</span></p>`;
            }
        });

        container.innerHTML = html;
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    window.loadOpeningHours = loadOpeningHours;
})();
