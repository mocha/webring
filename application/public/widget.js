/**
 * Webring Widget
 * Add this to your site to participate in the webring navigation
 * Documentation: https://webring.fun/docs
 */
(function() {
  // Default configuration
  const config = {
    ringlet: null,
    colormode: "light",
    position: "bottom", // Could allow for other positions in the future
    siteUrl: null, // Allow users to specify their URL if auto-detection fails
    baseUrl: "https://webring.fun" // Base URL for the webring site
  };
  
  // Initialize with user options
  window.webring = {
    init: function(options) {
      // Merge user options with defaults
      Object.assign(config, options);
      
      // Start loading the widget
      loadWebringData();
    }
  };
  
  /**
   * Load the appropriate data file based on configuration
   */
  function loadWebringData() {
    // Determine which data file to load
    const dataUrl = config.ringlet 
      ? `${config.baseUrl}/data/${config.ringlet}.json` 
      : `${config.baseUrl}/data/full-ring.json`;
    
    fetch(dataUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load webring data (${response.status})`);
        }
        return response.json();
      })
      .then(data => {
        renderWidget(data);
      })
      .catch(error => {
        console.error('Webring widget error:', error);
        // Optionally render a fallback or error message
      });
  }
  
  /**
   * Find the current site in the ring and render the widget
   */
  function renderWidget(data) {
    // Get current site URL, stripping trailing slash for consistency
    const currentUrl = detectCurrentSiteUrl();
    
    // Process the data based on structure
    let websites = [];
    let ringletName = config.ringlet ? null : "Webring.fun";
    
    // Handle different data formats
    if (data.websites) {
      // Full ring format
      websites = Object.values(data.websites);
      
      // If a ringlet is specified, filter to only that ringlet's sites
      if (config.ringlet && data.ringlets && data.ringlets[config.ringlet]) {
        ringletName = data.ringlets[config.ringlet].name;
        websites = websites.filter(site => 
          site.ringlets && site.ringlets.includes(config.ringlet)
        );
      }
    } else {
      // Individual ringlet format
      websites = Object.values(data);
      
      // Try to find ringlet name from the first site's ringlets info
      if (websites.length > 0 && websites[0].ringlets) {
        const ringletId = websites[0].ringlets[0];
        ringletName = ringletId.replace(/_/g, ' '); // Fallback formatting
      }
    }
    
    // Find current site in the websites array
    const currentSiteIndex = websites.findIndex(site => 
      site.url.replace(/\/$/, '') === currentUrl.replace(/\/$/, '')
    );
    
    // If site not found, show a warning (could be misconfiguration)
    if (currentSiteIndex === -1) {
      console.warn(`Webring widget: This site (${currentUrl}) is not in the ${ringletName || 'webring'}.`);
      // Optional: render a special version of the widget for non-member sites
      renderNonMemberWidget(websites, ringletName);
      return;
    }
    
    // Calculate previous and next sites
    const prevSite = currentSiteIndex > 0 
      ? websites[currentSiteIndex - 1] 
      : websites[websites.length - 1];
      
    const nextSite = currentSiteIndex < websites.length - 1 
      ? websites[currentSiteIndex + 1] 
      : websites[0];
    
    // Create and insert the widget
    createWidgetDOM(prevSite, nextSite, websites, ringletName);
  }
  
  /**
   * Tries to detect the current site URL
   * Falls back to user-provided URL if available
   */
  function detectCurrentSiteUrl() {
    // If the user specified a URL, use that
    if (config.siteUrl) {
      return config.siteUrl;
    }
    
    // Otherwise try to get it from the current page
    return window.location.origin;
  }
  
  /**
   * Renders a special widget for sites not in the ring
   */
  function renderNonMemberWidget(websites, ringletName) {
    const container = document.createElement('div');
    container.id = 'webring-widget';
    container.className = `webring-widget webring-widget-${config.colormode}`;
    
    container.innerHTML = `
      <div class="webring-widget-content">
        <span class="webring-widget-description">
          <a href="${config.baseUrl}" target="_blank" rel="noopener">
            Not a member of ${ringletName || 'the webring'}
          </a>
        </span>
        <div class="webring-widget-nav">
          <a href="${config.baseUrl}/join" class="webring-widget-button" target="_blank" rel="noopener">
            Join
          </a>
        </div>
      </div>
    `;
    
    // Add styles and append to the document
    addWidgetStyles();
    document.body.appendChild(container);
  }
  
  /**
   * Creates and inserts the widget DOM elements
   */
  function createWidgetDOM(prevSite, nextSite, allSites, ringletName) {
    // Create container
    const container = document.createElement('div');
    container.id = 'webring-widget';
    container.className = `webring-widget webring-widget-${config.colormode}`;
    
    // Calculate a random site that's not the current one
    const getRandomSite = () => {
      // Get current URL
      const currentUrl = detectCurrentSiteUrl();
      
      // Filter out the current site
      const otherSites = allSites.filter(site => 
        site.url.replace(/\/$/, '') !== currentUrl.replace(/\/$/, '')
      );
      
      // Pick a random site
      return otherSites[Math.floor(Math.random() * otherSites.length)];
    };
    
    // Prepare random site
    const randomSite = getRandomSite();
    
    // Create HTML
    container.innerHTML = `
      <div class="webring-widget-content">
        <span class="webring-widget-description">
          <a href="${config.baseUrl}" target="_blank" rel="noopener">
            Member of ${ringletName ? `the ${ringletName}` : 'webring.fun'}
          </a>
        </span>
        <nav class="webring-widget-nav">
          <a href="${prevSite.url}" class="webring-widget-button" title="Previous: ${prevSite.name}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span class="webring-sr-only">Previous site</span>
          </a>
          <a href="${randomSite.url}" class="webring-widget-button" title="Random: ${randomSite.name}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l4-4"></path><path d="M2 9l4 4"></path><path d="M18 9l4-4"></path><path d="M18 9l4 4"></path><path d="M9 22l3-3"></path><path d="M15 22l-3-3"></path><path d="M3 7h3a5 5 0 0 1 5 5 5 5 0 0 0 5 5h5"></path></svg>
            <span class="webring-sr-only">Random site</span>
          </a>
          <a href="${nextSite.url}" class="webring-widget-button" title="Next: ${nextSite.name}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            <span class="webring-sr-only">Next site</span>
          </a>
        </nav>
      </div>
    `;
    
    // Add styles
    addWidgetStyles();
    
    // Add to the document
    document.body.appendChild(container);
  }
  
  /**
   * Adds the necessary CSS for the widget
   */
  function addWidgetStyles() {
    // Check if styles are already added
    if (document.getElementById('webring-styles')) {
      return;
    }
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.id = 'webring-styles';
    
    // Define CSS
    styleEl.textContent = `
      .webring-widget {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .webring-widget-light {
        background-color: #f5f5f5;
        color: #333;
        border-top: 1px solid #e0e0e0;
      }
      
      .webring-widget-dark {
        background-color: #222;
        color: #fff;
        border-top: 1px solid #444;
      }
      
      .webring-widget-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
      }
      
      .webring-widget a {
        color: inherit;
        text-decoration: none;
      }
      
      .webring-widget-description a:hover {
        text-decoration: underline;
      }
      
      .webring-widget-nav {
        display: flex;
        gap: 8px;
      }
      
      .webring-widget-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        background: transparent;
        transition: background-color 0.2s;
      }
      
      .webring-widget-light .webring-widget-button:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
      
      .webring-widget-dark .webring-widget-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      .webring-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
      
      @media (max-width: 600px) {
        .webring-widget-description {
          font-size: 12px;
        }
      }
    `;
    
    // Add to document head
    document.head.appendChild(styleEl);
  }
})();

