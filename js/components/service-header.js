// Service Header Component - Unified header for all service pages
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServiceHeader);
    } else {
        initServiceHeader();
    }
    
    function initServiceHeader() {
        const headerElement = document.querySelector('.service-hero');
        if (!headerElement) return;
        
        // Get data attributes from the element
        const title = headerElement.getAttribute('data-title') || 'Název služby';
        const subtitle = headerElement.getAttribute('data-subtitle') || '';
        const backgroundImage = headerElement.getAttribute('data-background');
        
        // Build the header HTML with centered content
        const headerHTML = `
            <div class="container">
                <div class="service-hero-content">
                    <h1 class="service-hero-title">${title}</h1>
                    ${subtitle ? `<p class="service-hero-subtitle">${subtitle}</p>` : ''}
                    <a href="../../kadernictvi-kosmetika.html" class="back-link">
                        <i class="fas fa-arrow-left"></i>
                        <span>Zpět na služby</span>
                    </a>
                </div>
            </div>
        `;
        
        // Set background image if provided
        if (backgroundImage) {
            headerElement.style.backgroundImage = `url('${backgroundImage}')`;
        }
        
        // Insert the content
        headerElement.innerHTML = headerHTML;
    }
})();