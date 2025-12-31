// Navigation handler for SPA
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation clicks
    document.addEventListener('click', function(e) {
        // Handle links with href starting with #
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const path = e.target.getAttribute('href').substring(1);
            router.navigate(path);
        }
        
        // Handle nav links
        if (e.target.classList.contains('nav-link')) {
            e.preventDefault();
            const path = e.target.getAttribute('href');
            if (path) {
                router.navigate(path.startsWith('#') ? path.substring(1) : path);
            }
        }
    });
    
    // Handle form submissions
    document.addEventListener('submit', function(e) {
        if (e.target.tagName === 'FORM') {
            // Prevent default form submission for SPA
            e.preventDefault();
        }
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        router.navigate(window.location.pathname, false);
    });
});

// Navigation functions
function navigateTo(path) {
    router.navigate(path);
}

// Export for global use
window.navigateTo = navigateTo;