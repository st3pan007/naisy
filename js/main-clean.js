// Main JavaScript - Clean Version without GSAP
document.addEventListener('DOMContentLoaded', function() {
    
    // Wait a bit for navbar to be inserted by navbar.js
    setTimeout(function() {
        // Mobile Menu Toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (mobileToggle && mobileOverlay) {
            // Remove any existing listeners first
            const newToggle = mobileToggle.cloneNode(true);
            mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
            
            newToggle.addEventListener('click', function() {
                mobileOverlay.classList.toggle('active');
                newToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // Close menu when clicking overlay
            mobileOverlay.addEventListener('click', function(e) {
                if (e.target === mobileOverlay) {
                    mobileOverlay.classList.remove('active');
                    newToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }, 100);
    
    // Smooth Scroll for anchor links
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
    
    // Simple fade-in effect on scroll (CSS-based)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    if (header) {
        // Check if this is a subpage with transparent header
        const isTransparentHeader = header.classList.contains('transparent-header');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add scrolled class only for transparent headers or when scrolled > 50
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show on scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            
            lastScroll = currentScroll;
        });
    }
});
