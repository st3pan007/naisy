// Navbar Component - Centralized navigation for all pages
(function() {
    // Get current location info
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Check if we're on a main subpage that should have transparent header
    const isSubpage = ['kadernictvi-kosmetika.html', 'naisy-gentleman.html', 'permanentni-makeup.html'].includes(currentPage);
    const isDarkBackground = currentPage === 'naisy-gentleman.html'; // Dark background needs white text
    
    // Function to get base path for links
    function getBasePath() {
        // Determine how many levels deep we are
        if (currentPath.includes('/sluzby/kadernictvi-kosmetika/')) {
            // We're 2 levels deep
            return '/';
        } else if (currentPath.includes('/sluzby/')) {
            // We're 1 level deep (for future use)
            return '/';
        } else {
            // We're at root level
            return '/';
        }
    }
    
    const basePath = getBasePath();
    
    // Determine which nav item should be active
    function getActiveNav() {
        const lowerPath = currentPath.toLowerCase();
        
        if (lowerPath.includes('kadernictvi-kosmetika')) {
            return 'Kadeřnický & Kosmetický salon';
        } else if (lowerPath.includes('naisy-gentleman')) {
            return 'Naisy Gentleman';
        } else if (lowerPath.includes('permanentni-makeup')) {
            return 'Permanentní Make-up';
        }
        return '';
    }
    
    const activeNav = getActiveNav();
    
    // Function to get appropriate logo for current page
    function getLogoForPage() {
        switch(currentPage) {
            case 'kadernictvi-kosmetika.html':
                return 'https://res.cloudinary.com/dlvunn4yc/image/upload/h_60/f_auto/q_auto/v1759832235/NaisyKaKSalonLogo_knyyvy.svg';
            case 'naisy-gentleman.html':
                return 'https://res.cloudinary.com/dlvunn4yc/image/upload/h_50/f_auto/q_auto/v1759832275/NaisyGentlemanLogo_mvc7gc.svg';
            case 'permanentni-makeup.html':
                return 'https://res.cloudinary.com/dlvunn4yc/image/upload/h_60/f_auto/q_auto/v1759230995/NaisyPMULogo_sz9xnk.png';
            default:
                return 'https://res.cloudinary.com/dlvunn4yc/image/upload/h_60/f_auto/q_auto/v1759230987/NaisyLogo_mea9ha.png';
        }
    }
    
    // Create navbar HTML with conditional transparent class
    const navbarHTML = `
    <header class="header${isSubpage ? ' transparent-header' : ''}${isDarkBackground ? ' dark-bg' : ''}">
        <div class="container">
            <div class="nav-wrapper">
                <a href="${currentPath.includes('/sluzby/') ? '../../' : ''}index.html" class="logo">
                    <img src="${getLogoForPage()}" alt="Naisy Logo" height="60" loading="lazy">
                </a>
                <nav class="main-nav">
                    <a href="${currentPath.includes('/sluzby/') ? '../../' : ''}kadernictvi-kosmetika.html" 
                       class="nav-link ${activeNav === 'Kadeřnický & Kosmetický salon' ? 'active' : ''}">
                       Kadeřnický & Kosmetický salon
                    </a>
                    <a href="${currentPath.includes('/sluzby/') ? '../../' : ''}naisy-gentleman.html" 
                       class="nav-link ${activeNav === 'Naisy Gentleman' ? 'active' : ''}">
                       Naisy Gentleman
                    </a>
                    <a href="${currentPath.includes('/sluzby/') ? '../../' : ''}permanentni-makeup.html" 
                       class="nav-link ${activeNav === 'Permanentní Make-up' ? 'active' : ''}">
                       Permanentní Make-up
                    </a>
                </nav>
                <button class="mobile-menu-toggle" aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>
    `;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertNavbar);
    } else {
        insertNavbar();
    }
    
    function insertNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = navbarHTML;
            
            // Re-attach mobile menu toggle functionality
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const mobileOverlay = document.querySelector('.mobile-menu-overlay');
            
            if (mobileToggle && mobileOverlay) {
                mobileToggle.addEventListener('click', function() {
                    mobileOverlay.classList.toggle('active');
                    mobileToggle.classList.toggle('active');
                });
            }
            
            // Transparent header is now handled by main-clean.js
        }
    }
})();