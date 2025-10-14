/**
 * Gallery Loader
 * Loads images from Supabase and renders them as carousel or grid
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        websiteId: 1,
        cloudinaryBaseUrl: 'https://res.cloudinary.com/dlvunn4yc/image/upload/'
    };

    /**
     * Load gallery images from Supabase
     */
    async function loadGalleryImages(galleryType) {
        try {
            // Get gallery ID first
            const galleries = await window.NaisyDB.fetch('galleries', {
                select: 'id,name',
                eq: { 
                    website_id: CONFIG.websiteId,
                    gallery_type: galleryType
                }
            });

            if (!galleries || galleries.length === 0) {
                return null;
            }

            const gallery = galleries[0];

            // Get images for this gallery
            const cacheKey = `naisy_gallery_${galleryType}`;
            const images = await window.NaisyDB.getCached(
                cacheKey,
                () => window.NaisyDB.fetch('gallery_images', {
                    select: 'id,cloudinary_url,cloudinary_public_id,alt_text,display_order',
                    eq: { gallery_id: gallery.id },
                    order: 'display_order.asc'
                })
            );

            if (!images || images.length === 0) {
                return null;
            }

            return images;

        } catch (error) {
            console.error('Error loading gallery images:', error);
            return null;
        }
    }

    /**
     * Render images as CAROUSEL (for index.html home-carousel)
     */
    function renderCarousel(images, carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) {
            return;
        }

        const track = carousel.querySelector('.carousel__track');
        if (!track) {
            return;
        }

        // Clear existing slides
        track.innerHTML = '';

        // Add new slides
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel__slide';
            slide.setAttribute('role', 'listitem');
            
            const img = document.createElement('img');
            img.src = image.cloudinary_url;
            img.alt = image.alt_text || `Naisy salon ${index + 1}`;
            img.loading = index < 3 ? 'eager' : 'lazy'; // First 3 eager, rest lazy
            
            slide.appendChild(img);
            track.appendChild(slide);
        });

        // Reinitialize carousel if needed
        if (window.salonCarousel && window.salonCarousel.reinit) {
            window.salonCarousel.reinit();
        }
    }

    /**
     * Render images as GRID (for interior galleries)
     */
    function renderGrid(images, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Add gallery-grid class if not present
        if (!container.classList.contains('gallery-grid')) {
            container.classList.add('gallery-grid');
        }

        // Add images
        images.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-grid-item';
            
            const img = document.createElement('img');
            img.src = image.cloudinary_url;
            img.alt = image.alt_text || `Interiér ${index + 1}`;
            img.loading = index < 6 ? 'eager' : 'lazy';
            
            item.appendChild(img);
            container.appendChild(item);
        });
    }

    /**
     * Render images as SLIDER (for kadernictvi work gallery)
     */
    function renderSlider(images, sliderId) {
        const slider = document.querySelector(`#${sliderId} .slider-track`);
        if (!slider) {
            return;
        }

        // Clear existing slides
        slider.innerHTML = '';

        // Add new slides
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.minWidth = '100%';
            slide.style.position = 'relative';
            
            const img = document.createElement('img');
            img.src = image.cloudinary_url;
            img.alt = image.alt_text || `Kadeřnictví práce ${index + 1}`;
            img.loading = 'lazy';
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            
            slide.appendChild(img);
            slider.appendChild(slide);
        });

        // Update dots
        const dotsContainer = document.querySelector(`#${sliderId} .slider-dots`);
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            images.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.onclick = () => window.goToSlide && window.goToSlide(index);
                dot.style.cssText = `
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 2px solid var(--accent-gold);
                    background: ${index === 0 ? 'var(--accent-gold)' : 'transparent'};
                    cursor: pointer;
                    transition: all 0.3s;
                `;
                dotsContainer.appendChild(dot);
            });
        }

        // Update slides count for existing slider JS
        if (typeof window.moveSlide === 'function') {
            // Reset to first slide
            const track = slider;
            track.style.transform = 'translateX(0%)';
        }
    }

    /**
     * Main loader function
     */
    async function loadGallery(galleryType, elementId, layoutType = 'carousel') {
        // Show loading state
        const element = document.getElementById(elementId);
        if (element && layoutType === 'grid') {
            element.innerHTML = '<div style="text-align:center;padding:2rem;color:#999;">Načítám galerii...</div>';
        }

        // Load images
        const images = await loadGalleryImages(galleryType);
        
        if (!images || images.length === 0) {
            if (element && layoutType === 'grid') {
                element.innerHTML = '<div style="text-align:center;padding:2rem;color:#999;">Galerie je prázdná</div>';
            }
            return;
        }

        // Render based on layout type
        switch (layoutType) {
            case 'carousel':
                renderCarousel(images, elementId);
                break;
            case 'grid':
                renderGrid(images, elementId);
                break;
            case 'slider':
                renderSlider(images, elementId);
                break;
            default:
                break;
        }
    }

    // Export to global scope
    window.loadGallery = loadGallery;
})();
