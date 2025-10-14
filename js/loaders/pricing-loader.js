/**
 * Pricing Loader
 * Loads pricing from Supabase and renders as HTML
 */

(function() {
    'use strict';

    const CONFIG = {
        websiteId: 1
    };

    /**
     * Load pricing categories and items
     */
    async function loadPricing(pageSections, containerId) {
        try {
            // Convert to array if single section
            const sections = Array.isArray(pageSections) ? pageSections : [pageSections];
            
            const container = document.getElementById(containerId);
            if (!container) {
                return;
            }

            container.innerHTML = '<div style="text-align:center;padding:2rem;color:#999;">Načítám ceníky...</div>';

            // Fetch all categories and items
            const cacheKey = `naisy_pricing_${sections.join('_')}`;
            const allData = await window.NaisyDB.getCached(
                cacheKey,
                async () => {
                    const results = [];
                    for (const section of sections) {
                        const categories = await window.NaisyDB.fetch('pricing_categories', {
                            select: 'id,category_name,category_description,display_order',
                            eq: { 
                                website_id: CONFIG.websiteId,
                                page_section: section
                            },
                            order: 'display_order.asc'
                        });

                        if (categories && categories.length > 0) {
                            for (const category of categories) {
                                const items = await window.NaisyDB.fetch('pricing_items', {
                                    select: 'service_name,service_description,price,display_order',
                                    eq: { category_id: category.id },
                                    order: 'display_order.asc'
                                });
                                category.items = items || [];
                            }
                            results.push(...categories);
                        }
                    }
                    return results;
                }
            );

            if (!allData || allData.length === 0) {
                container.innerHTML = '<div style="text-align:center;padding:2rem;color:#999;">Žádné ceníky k zobrazení</div>';
                return;
            }

            // Render pricing
            renderPricing(allData, container);

        } catch (error) {
            console.error('Error loading pricing:', error);
        }
    }

    /**
     * Render pricing HTML
     */
    function renderPricing(categories, container) {
        let html = '';

        categories.forEach(category => {
            html += `<div class="service-category">`;
            html += `<h3 class="category-title">${escapeHtml(category.category_name)}</h3>`;
            
            if (category.category_description) {
                html += `<p class="category-description">${escapeHtml(category.category_description)}</p>`;
            }

            html += `<div class="service-list">`;
            
            category.items.forEach(item => {
                html += `<div class="service-item">`;
                html += `<div class="service-info">`;
                html += `<span class="service-name">${escapeHtml(item.service_name)}</span>`;
                if (item.service_description) {
                    html += `<span class="service-description" style="font-size: 0.85rem; opacity: 0.8;">${escapeHtml(item.service_description)}</span>`;
                }
                html += `</div>`;
                html += `<span class="service-price">${escapeHtml(item.price)}</span>`;
                html += `</div>`;
            });

            html += `</div></div>`;
        });

        container.innerHTML = html;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    window.loadPricing = loadPricing;
})();
