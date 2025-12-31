// Simple frontend router for SPA navigation
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname, false);
        });
        
        // Handle initial load
        this.navigate(window.location.pathname, false);
    }
    
    addRoute(path, handler) {
        this.routes[path] = handler;
        return this;
    }
    
    navigate(path, pushState = true) {
        // Remove hash if present
        if (path.startsWith('#')) {
            path = path.substring(1);
        }
        
        // Remove leading slash for matching
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        
        // Default to index if path is empty
        const routePath = cleanPath || 'index';
        
        // Update current route
        this.currentRoute = routePath;
        
        // Update browser history
        if (pushState) {
            history.pushState({}, '', path);
        }
        
        // Try to find matching route
        const handler = this.routes[routePath] || this.routes['index'];
        
        if (handler) {
            handler();
        } else {
            // Fallback to index
            this.routes['index']();
        }
        
        // Update active nav item
        this.updateActiveNav();
    }
    
    updateActiveNav() {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current nav item
        const currentLink = document.querySelector(`[href="#/${this.currentRoute}"]`) || 
                           document.querySelector(`[href="/${this.currentRoute}"]`);
        
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }
}

// Initialize router
const router = new Router();

// Export for use in other modules
window.router = router;