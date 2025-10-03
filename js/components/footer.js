// Footer Component - Centralized footer for all pages
(function() {
    // Get current location info for path calculation
    const currentPath = window.location.pathname;
    
    // Function to calculate correct path (same logic as navbar)
    function getCorrectPath(targetPage) {
        // If we're in sluzby/kadernictvi-kosmetika/ subfolder
        if (currentPath.includes('/sluzby/kadernictvi-kosmetika/')) {
            return '../../' + targetPage;
        }
        // If we're in any sluzby subfolder
        else if (currentPath.includes('/sluzby/')) {
            return '../../' + targetPage;
        }
        // If we're in root or any main page
        else {
            return targetPage;
        }
    }
    
    // Determine which business we're on for copyright
    let businessName = 'Naisy';
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    if (currentPath.includes('/sluzby/kadernictvi-kosmetika/') || 
        currentPage === 'kadernictvi-kosmetika.html') {
        businessName = 'Naisy Kadeřnický & Kosmetický salon';
    } else if (currentPath.includes('/sluzby/naisy-gentleman/') || 
               currentPage === 'naisy-gentleman.html') {
        businessName = 'Naisy Gentleman';
    } else if (currentPath.includes('/sluzby/permanentni-makeup/') || 
               currentPage === 'permanentni-makeup.html') {
        businessName = 'Naisy PMU';
    }
    
    // Create footer HTML with better logo alignment
    const footerHTML = `
    <footer class="footer" style="padding: 1.5rem 0;">
        <div class="container">
            <div class="footer-content">
                <p class="footer-copyright" style="margin: 0; font-size: 0.875rem;">
                    © 2025 ${businessName}
                </p>
                <div class="footer-credits" style="display: flex; align-items: baseline; gap: 0.75rem;">
                    <span style="font-size: 0.875rem;">Webové stránky od</span>
                    <a href="https://trendtap.cz/" target="_blank" rel="noopener" style="display: inline-flex; align-items: baseline;">
                        <img src="https://imagedelivery.net/TtlFh2d-eb4ze5NHgekWCg/d0826255-f81e-4d89-81fb-d2c5644e6300/public" 
                             alt="TrendTap" 
                             class="footer-logo"
                             style="height: 28px; width: auto; filter: none; vertical-align: text-bottom; margin-bottom: -0.125rem;">
                    </a>
                </div>
            </div>
        </div>
    </footer>
    `;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertFooter);
    } else {
        insertFooter();
    }
    
    function insertFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
        }
    }
})();