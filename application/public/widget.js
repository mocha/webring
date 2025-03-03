/**
 * Webring Widget
 * Add this to your site to participate in the webring!
 * https://github.com/mocha/webring for more info
 */
(function() {
  // Default configuration
  const config = {
    ringlet: null,
    position: "bottom", // Possible values: top, bottom, left, right, top-left, top-right, bottom-left, bottom-right
    position_tab: "left", // Possible values: left, center, right
    siteUrl: null, // Allow users to specify their URL if auto-detection fails
    baseUrl: "https://webring.fun", // Base URL for the webring site
    type: "bar", // Widget type: "bar", "box", or "static"
    color: null, // Custom hex color code
    opacity: 1, // Opacity value from 0.2 to 1
    slide_toggle: false, // Whether widget should have toggle tab and slide in/out
    full_width: false, // For static widget: whether it should take full width
    extra_details: true, // For static widget: whether to show detailed info
    auto_hide: false, // Whether widget should auto-hide after a delay
    hide_delay: 3000, // Delay in milliseconds before auto-hide
    static_position: null, // For static widget: position
    fixed_position: false, // For static widget: whether it's fixed-positioned
    start_collapsed: false // For box widget: whether to start in collapsed (badge) mode
  };
  
  // Initialize with user options
  window.webring = {
    init: function(options) {
      console.log('DEBUG: Initializing webring widget with options:', options);
      
      // Merge user options with defaults
      Object.assign(config, options);
      console.log('DEBUG: Configuration after merging with defaults:', config);
      
      // Validate config values
      validateConfig();
      console.log('DEBUG: Configuration after validation:', config);
      
      // Start loading the webring data
      loadWebringData();
    }
  };
  
  /**
   * Validates and normalizes the configuration
   */
  function validateConfig() {
    // Set defaults for any unspecified options
    const defaults = {
      type: 'bar',
      position: 'bottom',
      position_tab: 'left',
      color: null,
      opacity: 0.85,
      siteUrl: null,
      ringlet: null,
      slide_toggle: false,
      full_width: false,
      extra_details: true,
      auto_hide: false,
      hide_delay: 3000,
      static_position: 'inline',
      fixed_position: false,
      start_collapsed: false
    };
    
    // Apply defaults for any unspecified options
    for (const [key, value] of Object.entries(defaults)) {
      if (config[key] === undefined) {
        config[key] = value;
      }
    }
    
    // Validate type
    if (!['bar', 'box', 'static'].includes(config.type)) {
      console.warn(`Invalid widget type "${config.type}", defaulting to "bar"`);
      config.type = 'bar';
    }
    
    // Validate position based on type
    if (config.type === 'bar' && !['top', 'bottom'].includes(config.position)) {
      console.warn(`Invalid position "${config.position}" for bar widget, defaulting to "bottom"`);
      config.position = 'bottom';
    } else if (config.type === 'box' && !['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(config.position)) {
      console.warn(`Invalid position "${config.position}" for box widget, defaulting to "bottom-right"`);
      config.position = 'bottom-right';
    } else if (config.type === 'static') {
      // For static widget, validate static_position and fixed_position
      if (config.fixed_position && !['top', 'bottom'].includes(config.static_position)) {
        console.warn(`Invalid static_position "${config.static_position}" for fixed static widget, defaulting to "bottom"`);
        config.static_position = 'bottom';
      }
    }
    
    // Validate tab position
    if (!['left', 'center', 'right'].includes(config.position_tab)) {
      console.warn(`Invalid tab position "${config.position_tab}", defaulting to "left"`);
      config.position_tab = 'left';
    }
    
    // Validate color only if it's provided
    if (config.color !== null && (typeof config.color !== 'string' || !config.color.match(/^#[0-9A-Fa-f]{6}$/))) {
      console.warn(`Invalid color "${config.color}", defaulting to "#000000"`);
      config.color = "#000000";
    }
    
    // Validate opacity
    if (typeof config.opacity !== 'number' || config.opacity < 0 || config.opacity > 1) {
      console.warn(`Invalid opacity "${config.opacity}", defaulting to 0.85`);
      config.opacity = 0.85;
    }
    
    return config;
  }
  
  /**
   * Get icon HTML for navigation buttons
   */
  function getIconHtml(iconType) {
    switch (iconType) {
      case 'left':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>';
        
      case 'random':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-32-32 0c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-32-32 0c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"/></svg>';
        
      case 'right':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>';
        
      default:
        return '';
    }
  }
  
  // Color utility functions
  /**
   * Check if a color is light or dark
   */
  function isColorLight(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    // Formula: 0.299*R + 0.587*G + 0.114*B
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Consider light if luminance is greater than 0.5
    return luminance > 0.5;
  }
  
  /**
   * Darken a color for hover states
   */
  function darkenColor(hexColor) {
    // Convert hex to RGB
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
    
    // Darken by 10%
    r = Math.max(0, Math.floor(r * 0.9));
    g = Math.max(0, Math.floor(g * 0.9));
    b = Math.max(0, Math.floor(b * 0.9));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  /**
   * Get appropriate text color (black or white) for a background color
   */
  function getTextColorForBackground(hexColor) {
    return isColorLight(hexColor) ? "black" : "white";
  }
  
  /**
   * Load the appropriate data file based on configuration
   */
  function loadWebringData() {
    // Determine which data file to load
    const dataUrl = config.ringlet 
      ? `${config.baseUrl}/data/${config.ringlet}.json` 
      : `${config.baseUrl}/data/all.json`;
    
    console.log(`Loading webring data from: ${dataUrl}`);
    console.log(`Config: ringlet=${config.ringlet}, baseUrl=${config.baseUrl}`);
    
    fetch(dataUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load webring data (${response.status})`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Webring data loaded:', data);
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
    console.log(`Current URL detected as: ${currentUrl}`);
    
    // Process the data based on structure
    let websites = [];
    let ringletName = null;
    let ringletDescription = null;
    let ringletUrl = null;
    let currentSiteColor = "#666666"; // Default color if none is found
    
    // Debug the structure of the data
    console.log('Data structure received:', {
      hasWebsites: !!data.websites,
      hasId: !!data.id,
      hasName: !!data.name,
      hasRinglets: !!data.ringlets,
      dataType: typeof data,
      keysInData: Object.keys(data)
    });
    
    // Handle different data formats
    if (data.websites) {
      // This could be either full ring format or individual ringlet with metadata
      
      // Check if this is a ringlet file with metadata (has id, name fields)
      if (data.id && data.name) {
        // This is a ringlet file with metadata
        console.log(`Processing ringlet file with metadata: id=${data.id}, name=${data.name}`);
        websites = Object.values(data.websites);
        ringletName = data.name;
        ringletDescription = data.description;
        ringletUrl = data.url;
        console.log(`Set ringlet metadata: name=${ringletName}, url=${ringletUrl}`);
      } 
      // Otherwise it's the full ring data
      else {
        console.log('Processing full ring data');
        websites = Object.values(data.websites);
        
        // If a ringlet is specified in full ring data
        if (config.ringlet && data.ringlets && data.ringlets[config.ringlet]) {
          ringletName = data.ringlets[config.ringlet].name;
          ringletDescription = data.ringlets[config.ringlet].description;
          ringletUrl = data.ringlets[config.ringlet].url;
          console.log(`Using ringlet from full ring: ${config.ringlet}, name=${ringletName}, url=${ringletUrl}`);
          websites = websites.filter(site => 
            site.ringlets && site.ringlets.includes(config.ringlet)
          );
        }
      }
    } else {
      // Legacy format (flat object of websites)
      console.log('Processing legacy format (flat object)');
      websites = Object.values(data);
      
      // Try to find ringlet name from the first site's ringlets info
      if (websites.length > 0 && websites[0].ringlets) {
        const ringletId = websites[0].ringlets[0];
        ringletName = ringletId.replace(/_/g, ' '); // Fallback formatting
        console.log(`Using fallback ringlet name: ${ringletName}`);
      }
    }
    
    // Log what we determined for debugging
    console.log(`Final ringlet values: name=${ringletName}, url=${ringletUrl}, websites count=${websites.length}`);
    
    // Find current site in the websites array
    let currentSiteIndex = websites.findIndex(site => 
      site.url.replace(/\/$/, '') === currentUrl.replace(/\/$/, '')
    );
    
    // If site not found, pick a random position instead of showing error
    // This allows for local testing and graceful handling of misconfiguration
    if (currentSiteIndex === -1) {
      console.warn(`Webring widget: This site (${currentUrl}) is not in the ${ringletName || 'webring'}. Using fallback mode.`);
      
      // Use a random position for better testing/fallback experience
      currentSiteIndex = Math.floor(Math.random() * websites.length);
    } else {
      // Get the color of the current site if available
      if (websites[currentSiteIndex].color) {
        currentSiteColor = websites[currentSiteIndex].color;
        console.log(`Using site color: ${currentSiteColor}`);
      }
    }
    
    // If a custom color is provided, use it
    if (config.color) {
      currentSiteColor = config.color;
      console.log(`Using custom color: ${currentSiteColor}`);
    }
    
    // Calculate previous and next sites
    const prevSite = currentSiteIndex > 0 
      ? websites[currentSiteIndex - 1] 
      : websites[websites.length - 1];
      
    const nextSite = currentSiteIndex < websites.length - 1 
      ? websites[currentSiteIndex + 1] 
      : websites[0];
    
    // Create and insert the widget based on type
    if (config.type === "bar") {
      createBarWidgetDOM(prevSite, nextSite, websites, {
        name: ringletName,
        description: ringletDescription,
        url: ringletUrl
      }, currentSiteColor);
    } else if (config.type === "box") {
      createBoxWidgetDOM(prevSite, nextSite, websites, {
        name: ringletName,
        description: ringletDescription,
        url: ringletUrl
      }, currentSiteColor);
    } else if (config.type === "static") {
      createStaticWidgetDOM(prevSite, nextSite, websites, {
        name: ringletName,
        description: ringletDescription,
        url: ringletUrl
      }, currentSiteColor);
    }
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
   * Creates and inserts the bar widget DOM elements
   */
  function createBarWidgetDOM(prevSite, nextSite, allSites, ringlet, siteColor) {
    // Create container
    const container = document.createElement('div');
    container.id = 'webring-widget';
    container.className = `webring-widget webring-widget-bar`;
    
    // Debug the ringlet object being passed to createWidgetDOM
    console.log('Creating bar widget DOM with ringlet:', ringlet);
    
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
    
    // Handle ringlet URL and text according to requirements:
    let ringletLinkUrl;
    let ringletDisplayText;
    
    if (!ringlet.name) {
      // Case 1: No ringlet specified
      ringletLinkUrl = config.baseUrl;
      ringletDisplayText = 'webring.fun';
    } else if (ringlet.name && !ringlet.url) {
      // Case 2: Ringlet specified but no URL
      ringletLinkUrl = `${config.baseUrl}/?ringlet=${config.ringlet}`;
      ringletDisplayText = `${ringlet.name} webring`;
    } else {
      // Case 3: Ringlet specified with URL
      ringletLinkUrl = ringlet.url;
      ringletDisplayText = `${ringlet.name} webring`;
    }
    
    console.log(`Widget display values: ringletLinkUrl=${ringletLinkUrl}, ringletDisplayText=${ringletDisplayText}`);
    
    // Determine text color based on background color
    const textColor = getTextColorForBackground(siteColor);
    
    // Create pull tab HTML if slide_toggle is enabled
    const pullTabHTML = config.slide_toggle ? `
      <div class="webring-widget-pull-tab" title="Toggle webring widget">
        <div class="webring-widget-pull-tab-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="currentColor">
            <!-- Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) -->
            <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/>
          </svg>
          <span class="webring-widget-pull-tab-text">webring.fun</span>
        </div>
      </div>
    ` : '';
    
    // Create HTML structure for the main content
    const contentHTML = `
      <div class="webring-widget-container">
        <div class="webring-widget-content">
          <span class="webring-widget-description">
            This site is a member of ${ringlet.name ? 'the ' : ''}<a href="${ringletLinkUrl}" target="_blank" rel="noopener">${ringletDisplayText}</a>!
          </span>
          <nav class="webring-widget-nav">
            <a href="${prevSite.url}" class="webring-widget-button" title="Previous: ${prevSite.name}">
              ${getIconHtml('left')}
              <span class="webring-sr-only">Previous site</span>
            </a>
            <a href="${randomSite.url}" class="webring-widget-button" title="Random: ${randomSite.name}">
              ${getIconHtml('random')}
              <span class="webring-sr-only">Random site</span>
            </a>
            <a href="${nextSite.url}" class="webring-widget-button" title="Next: ${nextSite.name}">
              ${getIconHtml('right')}
              <span class="webring-sr-only">Next site</span>
            </a>
          </nav>
        </div>
        ${pullTabHTML}
      </div>
    `;
    
    // Set the container's innerHTML
    container.innerHTML = contentHTML;
    
    // Add styles with dynamic colors
    addBarWidgetStyles(siteColor, textColor);
    
    // Add to the document
    document.body.appendChild(container);
    
    // Always make the widget visible initially
    container.classList.add('webring-widget-visible');
    
    // Add slide out functionality if enabled
    if (config.slide_toggle) {
      setupSlideOut(container);
    }
    
    // Add space to the page if widget is at the top
    if (config.position === 'top') {
      adjustPageForTopWidget(container);
    }
  }
  
  /**
   * Adds the necessary CSS for the bar widget
   */
  function addBarWidgetStyles(backgroundColor, textColor) {
    // Check if styles are already added
    if (document.getElementById('webring-styles')) {
      return;
    }
    
    // Calculate hover background based on text color
    const hoverBackground = textColor === "black" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.id = 'webring-styles';
    
    // Define CSS for the widget
    let widgetStyles = `
      .webring-widget-bar {
        position: fixed;
        left: 0;
        right: 0;
        ${config.position === 'top' ? 'top: 0; border-bottom: 1px solid' : 'bottom: 0; border-top: 1px solid'};
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        background-color: ${backgroundColor};
        opacity: ${config.opacity};
        color: ${textColor};
        border-color: ${textColor === "black" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)"};
        transition: transform 0.3s ease, opacity 0.3s ease;
        transform: translateY(0); /* Visible by default */
      }
      
      .webring-widget-bar.webring-widget-visible {
        transform: translateY(0);
      }
      
      .webring-widget-bar:not(.webring-widget-visible) {
        transform: ${config.position === 'top' ? 'translateY(-100%)' : 'translateY(100%)'};
      }
      
      .webring-widget-bar:hover {
        opacity: 1;
      }
      
      .webring-widget-container {
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        width: 100%;
      }
      
      .webring-widget-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        position: relative;
      }
      
      .webring-widget a {
        color: inherit;
        text-decoration: underline;
      }
    `;
    
    // Add styles for the pull tab only if slide_toggle is enabled
    if (config.slide_toggle) {
      // Calculate the position for the tab based on config.position_tab
      let tabPositionCSS = '';
      if (config.position_tab === 'left') {
        // Align with content padding (1rem = 16px)
        tabPositionCSS = 'left: 1rem;';
      } else if (config.position_tab === 'right') {
        // Align with content at right
        tabPositionCSS = 'right: 1rem; left: auto;';
      } else if (config.position_tab === 'center') {
        // Center the tab
        tabPositionCSS = 'left: 50%; transform: translateX(-50%);';
      }
      
      widgetStyles += `
        .webring-widget-pull-tab {
          position: absolute;
          ${config.position === 'top' ? 'bottom: -32px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;' : 'top: -32px; border-top-left-radius: 8px; border-top-right-radius: 8px;'};
          ${tabPositionCSS}
          background-color: ${backgroundColor};
          border: 1px solid ${textColor === "black" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)"};
          ${config.position === 'top' ? 'border-top: none;' : 'border-bottom: none;'};
          min-width: 100px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.3s ease;
          z-index: 9998; /* Just below the main widget z-index */
          padding: 0 12px;
        }
        
        .webring-widget-pull-tab:hover {
          opacity: 1;
        }
        
        .webring-widget-pull-tab-icon {
          font-size: 14px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .webring-widget-pull-tab-text {
          font-weight: bold;
          font-size: 14px;
        }
      `;
    }
    
    // Add styles for buttons, descriptions, etc.
    widgetStyles += `
      .webring-widget-description a:hover {
        text-decoration: underline;
      }
      
      .webring-widget-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        margin-left: 5px;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      
      .webring-widget-button:hover {
        background-color: ${hoverBackground};
      }
      
      .webring-widget-button svg {
        width: 14px;
        height: 14px;
        fill: currentColor;
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
    `;
    
    // Set the style content
    styleEl.textContent = widgetStyles;
    
    // Add styles to the document
    document.head.appendChild(styleEl);
  }
  
  /**
   * Creates and inserts the box widget DOM elements
   */
  function createBoxWidgetDOM(prevSite, nextSite, allSites, ringlet, siteColor) {
    // Create container
    const container = document.createElement('div');
    container.id = 'webring-widget';
    container.className = `webring-widget webring-widget-box webring-widget-${config.position}`;
    
    // Debug the ringlet object being passed to createWidgetDOM
    console.log('Creating box widget DOM with ringlet:', ringlet);
    
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
    
    // Handle ringlet URL and text according to requirements:
    let ringletLinkUrl;
    let ringletDisplayText;
    
    if (!ringlet.name) {
      // Case 1: No ringlet specified
      ringletLinkUrl = config.baseUrl;
      ringletDisplayText = 'webring.fun';
    } else if (ringlet.name && !ringlet.url) {
      // Case 2: Ringlet specified but no URL
      ringletLinkUrl = `${config.baseUrl}/?ringlet=${config.ringlet}`;
      ringletDisplayText = `${ringlet.name} webring`;
    } else {
      // Case 3: Ringlet specified with URL
      ringletLinkUrl = ringlet.url;
      ringletDisplayText = `${ringlet.name} webring`;
    }
    
    console.log(`Widget display values: ringletLinkUrl=${ringletLinkUrl}, ringletDisplayText=${ringletDisplayText}`);
    
    // Determine text color based on background color
    const textColor = getTextColorForBackground(siteColor);
    
    // Create reopen tab HTML - now using ringletDisplayText
    const reopenTabHTML = `
      <div class="webring-widget-reopen-tab" title="Show webring widget">
        <div class="webring-widget-reopen-tab-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="currentColor">
            <!-- Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) -->
            <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/>
          </svg>
          <span class="webring-widget-reopen-tab-text">${ringletDisplayText}</span>
        </div>
      </div>
    `;
    
    // Create tooltip HTML for each site
    const prevSiteTooltip = `
      <div class="webring-widget-tooltip webring-widget-tooltip-prev">
        <div class="webring-widget-tooltip-title">${prevSite.name}</div>
        ${prevSite.description ? `<div class="webring-widget-tooltip-description">${prevSite.description}</div>` : ''}
      </div>
    `;
    
    const nextSiteTooltip = `
      <div class="webring-widget-tooltip webring-widget-tooltip-next">
        <div class="webring-widget-tooltip-title">${nextSite.name}</div>
        ${nextSite.description ? `<div class="webring-widget-tooltip-description">${nextSite.description}</div>` : ''}
      </div>
    `;
    
    const randomSiteTooltip = `
      <div class="webring-widget-tooltip webring-widget-tooltip-random">
        <div class="webring-widget-tooltip-title">Surprise me!</div>
      </div>
    `;
    
    // Create a wrapper for both the widget and the reopen tab
    const wrapper = document.createElement('div');
    wrapper.className = 'webring-widget-wrapper';
    
    // Store the original position as a class on the wrapper
    wrapper.classList.add(`webring-widget-${config.position}`);
    
    // Create HTML structure for the main content with header
    container.innerHTML = `
      <div class="webring-widget-header">
        <div class="webring-widget-drag-handle" title="Drag to move widget">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,15V13H5V15H3M3,11V9H5V11H3M7,15V13H9V15H7M7,11V9H9V11H7M11,15V13H13V15H11M11,11V9H13V11H11M15,15V13H17V15H15M15,11V9H17V11H15M19,15V13H21V15H19M19,11V9H21V11H19Z" />
          </svg>
        </div>
        <div class="webring-widget-close-button" title="Close widget">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </div>
      </div>
      <div class="webring-widget-box-content">
        <span class="webring-widget-description">
          This site is a member of ${ringlet.name ? 'the ' : ''}<a href="${ringletLinkUrl}" target="_blank" rel="noopener">${ringletDisplayText}</a>!
        </span>
        <nav class="webring-widget-nav">
          <a href="${prevSite.url}" class="webring-widget-button-container" title="Previous: ${prevSite.name}" style="--hover-color: ${prevSite.color || siteColor}">
            <div class="webring-widget-button">
              ${getIconHtml('left')}
              <span class="webring-sr-only">Previous site</span>
            </div>
            ${prevSiteTooltip}
            <span class="webring-widget-button-label">Previous</span>
          </a>
          <a href="${randomSite.url}" class="webring-widget-button-container" title="Random: ${randomSite.name}" style="--hover-color: ${randomSite.color || siteColor}">
            <div class="webring-widget-button">
              ${getIconHtml('random')}
              <span class="webring-sr-only">Random site</span>
            </div>
            ${randomSiteTooltip}
            <span class="webring-widget-button-label">Random</span>
          </a>
          <a href="${nextSite.url}" class="webring-widget-button-container" title="Next: ${nextSite.name}" style="--hover-color: ${nextSite.color || siteColor}">
            <div class="webring-widget-button">
              ${getIconHtml('right')}
              <span class="webring-sr-only">Next site</span>
            </div>
            ${nextSiteTooltip}
            <span class="webring-widget-button-label">Next</span>
          </a>
        </nav>
      </div>
    `;
    
    // Create the reopen tab element
    const reopenTab = document.createElement('div');
    reopenTab.className = 'webring-widget-reopen-container';
    reopenTab.innerHTML = reopenTabHTML;
    
    // Add both to the wrapper
    wrapper.appendChild(container);
    wrapper.appendChild(reopenTab);
    
    // Add styles with dynamic colors
    addBoxWidgetStyles(siteColor, textColor);
    
    // Add to the document
    document.body.appendChild(wrapper);
    
    // Always make the widget visible initially
    container.classList.add('webring-widget-visible');
    
    // Store the original position values for restoration when closed
    let originalPosition = {
      position: 'fixed',
      top: '',
      right: '',
      bottom: '',
      left: ''
    };
    
    // Set initial position based on config.position
    if (config.position === 'top-right') {
      originalPosition.top = '20px';
      originalPosition.right = '20px';
    } else if (config.position === 'top-left') {
      originalPosition.top = '20px';
      originalPosition.left = '20px';
    } else if (config.position === 'bottom-left') {
      originalPosition.bottom = '20px';
      originalPosition.left = '20px';
    } else { // bottom-right is default
      originalPosition.bottom = '20px';
      originalPosition.right = '20px';
    }
    
    // Store last known dragged position
    let draggedPosition = {
      position: 'fixed',
      top: originalPosition.top,
      right: originalPosition.right,
      bottom: originalPosition.bottom,
      left: originalPosition.left
    };
    
    // Set up close button functionality
    const closeButton = container.querySelector('.webring-widget-close-button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        // Save current position before changing it
        if (wrapper.style.top) draggedPosition.top = wrapper.style.top;
        if (wrapper.style.right) draggedPosition.right = wrapper.style.right;
        if (wrapper.style.bottom) draggedPosition.bottom = wrapper.style.bottom;
        if (wrapper.style.left) draggedPosition.left = wrapper.style.left;
        
        // Reset to original position
        wrapper.style.position = originalPosition.position;
        wrapper.style.top = originalPosition.top;
        wrapper.style.right = originalPosition.right;
        wrapper.style.bottom = originalPosition.bottom;
        wrapper.style.left = originalPosition.left;
        
        // Add classes for closed state
        wrapper.classList.add('webring-widget-closed');
        wrapper.classList.add('webring-widget-tab-visible');
        
        // Store closed state in session storage
        try {
          sessionStorage.setItem('webring-widget-closed', 'true');
          // Store dragged position
          sessionStorage.setItem('webring-widget-position', JSON.stringify(draggedPosition));
        } catch (e) {
          console.error('Failed to store widget state:', e);
        }
      });
    }
    
    // Set up reopen tab functionality
    reopenTab.addEventListener('click', () => {
      wrapper.classList.remove('webring-widget-closed');
      wrapper.classList.remove('webring-widget-tab-visible');
      
      // Try to restore dragged position
      try {
        const savedPosition = JSON.parse(sessionStorage.getItem('webring-widget-position'));
        if (savedPosition) {
          wrapper.style.position = savedPosition.position;
          wrapper.style.top = savedPosition.top;
          wrapper.style.right = savedPosition.right;
          wrapper.style.bottom = savedPosition.bottom;
          wrapper.style.left = savedPosition.left;
        }
      } catch (e) {
        console.error('Failed to restore widget position:', e);
      }
      
      // Update session storage
      try {
        sessionStorage.removeItem('webring-widget-closed');
      } catch (e) {
        console.error('Failed to update widget state:', e);
      }
    });
    
    // Check if widget was previously closed in this session or configured to start collapsed
    try {
      if (sessionStorage.getItem('webring-widget-closed') === 'true' || config.start_collapsed) {
        wrapper.classList.add('webring-widget-closed');
        wrapper.classList.add('webring-widget-tab-visible');
        
        // Ensure we're in the original position
        wrapper.style.position = originalPosition.position;
        wrapper.style.top = originalPosition.top;
        wrapper.style.right = originalPosition.right;
        wrapper.style.bottom = originalPosition.bottom;
        wrapper.style.left = originalPosition.left;
        
        // If this is initial load with start_collapsed, store the state
        if (config.start_collapsed && sessionStorage.getItem('webring-widget-closed') !== 'true') {
          sessionStorage.setItem('webring-widget-closed', 'true');
        }
      } else {
        // Check if we have a saved position to restore
        const savedPosition = JSON.parse(sessionStorage.getItem('webring-widget-position'));
        if (savedPosition) {
          wrapper.style.position = savedPosition.position;
          wrapper.style.top = savedPosition.top;
          wrapper.style.right = savedPosition.right;
          wrapper.style.bottom = savedPosition.bottom;
          wrapper.style.left = savedPosition.left;
        }
      }
    } catch (e) {
      console.error('Failed to retrieve widget state:', e);
    }
    
    // Add drag functionality to the box widget
    makeWidgetDraggable(container, wrapper, draggedPosition);
  }
  
  /**
   * Makes the box widget draggable
   */
  function makeWidgetDraggable(widget, wrapper, draggedPosition) {
    const handle = widget.querySelector('.webring-widget-header');
    
    if (!handle) return;
    
    let isDragging = false;
    let offsetX, offsetY;
    
    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });
    
    function startDrag(e) {
      // Don't start dragging if the close button was clicked
      if (e.target.closest('.webring-widget-close-button')) {
        return;
      }
      
      e.preventDefault();
      isDragging = true;
      
      // Get either mouse or touch coordinates
      const pageX = e.pageX || e.touches[0].pageX;
      const pageY = e.pageY || e.touches[0].pageY;
      
      // Calculate the offset
      const rect = widget.getBoundingClientRect();
      offsetX = pageX - (rect.left + window.scrollX);
      offsetY = pageY - (rect.top + window.scrollY);
      
      // Add event listeners for moving and stopping
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('touchmove', dragMove, { passive: false });
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
      
      // Add dragging class
      widget.classList.add('webring-widget-dragging');
    }
    
    function dragMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      
      // Get either mouse or touch coordinates
      const pageX = e.pageX || e.touches[0].pageX;
      const pageY = e.pageY || e.touches[0].pageY;
      
      // Calculate new position
      let left = pageX - offsetX;
      let top = pageY - offsetY;
      
      // Get widget dimensions
      const rect = widget.getBoundingClientRect();
      
      // Constrain to window boundaries
      left = Math.max(0, Math.min(left, window.innerWidth - rect.width));
      top = Math.max(0, Math.min(top, window.innerHeight - rect.height));
      
      // Apply new position - using fixed positioning to maintain position relative to viewport
      wrapper.style.position = 'fixed';
      wrapper.style.left = `${left}px`;
      wrapper.style.top = `${top}px`;
      wrapper.style.bottom = 'auto'; // Ensure bottom is not also set when dragging (fixes the stretching issue)
      wrapper.style.right = 'auto'; // Ensure right is not also set when dragging
      
      // Update the saved position
      if (draggedPosition) {
        draggedPosition.position = 'fixed';
        draggedPosition.top = `${top}px`;
        draggedPosition.left = `${left}px`;
        draggedPosition.right = 'auto';
        draggedPosition.bottom = 'auto';
      }
      
      // Update sessionStorage immediately
      try {
        sessionStorage.setItem('webring-widget-position', JSON.stringify(draggedPosition));
      } catch (e) {
        console.error('Failed to save widget position:', e);
      }
    }
    
    function stopDrag() {
      if (!isDragging) return;
      isDragging = false;
      
      // Remove event listeners
      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('touchmove', dragMove);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
      
      // Remove dragging class
      widget.classList.remove('webring-widget-dragging');
    }
  }
  
  /**
   * Adds the necessary CSS for the box widget
   */
  function addBoxWidgetStyles(backgroundColor, textColor) {
    // Check if styles are already added
    if (document.getElementById('webring-styles')) {
      return;
    }
    
    // Calculate hover background based on text color
    const hoverBackground = textColor === "black" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.id = 'webring-styles';
    
    // Define CSS
    let widgetStyles = `
      .webring-widget-wrapper {
        position: fixed;
        z-index: 9999;
      }
      
      .webring-widget-top-right {
        top: 20px;
        right: 20px;
      }
      
      .webring-widget-top-left {
        top: 20px;
        left: 20px;
      }
      
      .webring-widget-bottom-left {
        bottom: 20px;
        left: 20px;
      }
      
      .webring-widget-bottom-right {
        bottom: 20px;
        right: 20px;
      }
      
      .webring-widget-box {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        background-color: ${backgroundColor};
        color: ${textColor};
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        width: 220px;
        opacity: ${config.opacity};
        transition: opacity 0.3s ease, transform 0.3s ease;
        transform: translateY(0);
        overflow: visible;
      }
      
      .webring-widget-closed .webring-widget-box {
        display: none;
      }
      
      .webring-widget-reopen-container {
        display: none;
      }
      
      .webring-widget-tab-visible .webring-widget-reopen-container {
        display: block;
      }
      
      .webring-widget-reopen-tab {
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 8px;
        padding: 8px;
        margin-top: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s, opacity 0.3s;
        opacity: ${config.opacity};
      }
      
      .webring-widget-reopen-tab:hover {
        opacity: 1;
        background-color: ${backgroundColor};
      }
      
      .webring-widget-reopen-tab-icon {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .webring-widget-reopen-tab-text {
        font-weight: bold;
        font-size: 14px;
      }
      
      .webring-widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 8px;
        background-color: ${textColor === "black" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)"};
        cursor: move;
        user-select: none;
      }
      
      .webring-widget-drag-handle {
        display: flex;
        align-items: center;
      }
      
      .webring-widget-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s, background-color 0.2s;
      }
      
      .webring-widget-close-button:hover {
        opacity: 1;
        background-color: ${textColor === "black" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)"};
      }
      
      .webring-widget-box.webring-widget-visible {
        transform: translateY(0);
        opacity: ${config.opacity};
      }
      
      .webring-widget-box:not(.webring-widget-visible) {
        transform: translateY(10px);
        opacity: 0;
      }
      
      .webring-widget-box:hover {
        opacity: 1;
      }
      
      .webring-widget-box-content {
        padding: 0;
      }
      
      .webring-widget-description {
        display: block;
        margin: 10px;
        text-align: center;
      }
      
      .webring-widget-dragging {
        opacity: 0.8;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        transition: none;
      }
      
      .webring-widget a {
        color: inherit;
        text-decoration: underline;
      }
      
      .webring-widget-description a:hover {
        text-decoration: underline;
      }
      
      .webring-widget-nav {
        display: flex;
        justify-content: space-between;
        margin: 8px;
      }
      
      .webring-widget-button-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        padding: 4px;
        border-radius: 8px;
        transition: background-color 0.2s;
        width: 65px; /* Fixed width to ensure all buttons are equal size */
        position: relative;
      }
      
      .webring-widget-button-container:hover {
        background-color: var(--hover-color);
        opacity: 0.85;
      }
      
      .webring-widget-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: transparent;
      }
      
      .webring-widget-button svg {
        width: 12px;
        height: 12px;
        fill: currentColor;
      }
      
      .webring-widget-button-label {
        font-size: 11px;
        margin-top: 4px;
        text-align: center;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      /* Tooltip styles */
      .webring-widget-tooltip {
        position: absolute;
        top: -80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px;
        width: 160px;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
        pointer-events: none;
        z-index: 10000;
        text-align: center;
      }
      
      .webring-widget-tooltip:after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid rgba(0, 0, 0, 0.9);
      }
      
      .webring-widget-tooltip-title {
        font-weight: bold;
        margin-bottom: 4px;
        color: white;
        text-align: center;
      }
      
      .webring-widget-tooltip-description {
        font-size: 11px;
        opacity: 0.9;
        line-height: 1.3;
        max-height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
      }
      
      .webring-widget-button-container:hover .webring-widget-tooltip {
        opacity: 1;
        visibility: visible;
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
    `;
    
    // Add media query for mobile
    widgetStyles += `
      @media (max-width: 600px) {
        .webring-widget-box {
          width: 180px;
          font-size: 12px;
        }
        
        .webring-widget-description {
          font-size: 12px;
        }
        
        .webring-widget-button {
          width: 16px;
          height: 16px;
        }
        
        .webring-widget-tooltip {
          width: 140px;
        }
      }
    `;
    
    // Set the style content
    styleEl.textContent = widgetStyles;
    
    // Add to document head
    document.head.appendChild(styleEl);
  }
  
  /**
   * Creates and inserts the static widget DOM elements
   */
  function createStaticWidgetDOM(prevSite, nextSite, allSites, ringlet, siteColor) {
    // Create container
    const container = document.createElement('div');
    container.id = 'webring-widget';
    container.className = `webring-widget webring-widget-static ${config.full_width ? 'webring-widget-full-width' : ''}`;
    
    if (config.static_position === 'inline') {
      // If inline position, no additional classes needed
    } else if (config.fixed_position) {
      // If fixed position, add fixed class and position class
      container.classList.add('webring-widget-fixed');
      container.classList.add(`webring-widget-${config.static_position}`);
    }
    
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
    
    // Handle ringlet URL and text according to requirements
    let ringletLinkUrl;
    let ringletDisplayText;
    
    if (!ringlet.name) {
      // Case 1: No ringlet specified
      ringletLinkUrl = config.baseUrl;
      ringletDisplayText = 'webring.fun';
    } else if (ringlet.name && !ringlet.url) {
      // Case 2: Ringlet specified but no URL
      ringletLinkUrl = `${config.baseUrl}/?ringlet=${config.ringlet}`;
      ringletDisplayText = `${ringlet.name} webring`;
    } else {
      // Case 3: Ringlet specified with URL
      ringletLinkUrl = ringlet.url;
      ringletDisplayText = `${ringlet.name} webring`;
    }
    
    console.log(`Widget display values: ringletLinkUrl=${ringletLinkUrl}, ringletDisplayText=${ringletDisplayText}`);
    
    // Determine text color based on background color
    const textColor = getTextColorForBackground(siteColor);
    
    // Create tooltip HTML for each site
    const prevSiteTooltip = `
      <div class="webring-widget-tooltip webring-widget-tooltip-prev">
        <div class="webring-widget-tooltip-title">${prevSite.name}</div>
        ${prevSite.description ? `<div class="webring-widget-tooltip-description">${prevSite.description}</div>` : ''}
      </div>
    `;
    
    const nextSiteTooltip = `
      <div class="webring-widget-tooltip webring-widget-tooltip-next">
        <div class="webring-widget-tooltip-title">${nextSite.name}</div>
        ${nextSite.description ? `<div class="webring-widget-tooltip-description">${nextSite.description}</div>` : ''}
      </div>
    `;
    
    const randomSiteTooltip = `
      <div class="webring-widget-tooltip webring-widget-tooltip-random">
        <div class="webring-widget-tooltip-title">Surprise me!</div>
      </div>
    `;
    
    // Create HTML content
    let contentHTML;
    
    if (config.extra_details) {
      contentHTML = `
        <div class="webring-widget-static-content">
          <div class="webring-widget-static-header">
            <h3 class="webring-widget-static-title">
              This site is a member of <a href="${ringletLinkUrl}" target="_blank" rel="noopener">${ringletDisplayText}</a>
            </h3>
          </div>
          <div class="webring-widget-static-sites">
            <a href="${prevSite.url}" class="webring-widget-static-site webring-widget-static-prev" style="--hover-color: ${prevSite.color || siteColor}">
              <span class="webring-widget-static-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="webring-widget-icon">
                  <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                </svg>
                Previous
              </span>
              <div class="webring-widget-static-link-content">
                <strong>${prevSite.name}</strong>
                ${prevSite.description ? `<span class="webring-widget-static-description">${prevSite.description}</span>` : ''}
              </div>
              ${prevSiteTooltip}
            </a>
            <a href="${randomSite.url}" class="webring-widget-static-site webring-widget-static-random" style="--hover-color: ${randomSite.color || siteColor}">
              <span class="webring-widget-static-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="webring-widget-icon">
                  <path d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z" />
                </svg>
                Random
              </span>
              <div class="webring-widget-static-link-content">
                <strong>${randomSite.name}</strong>
                ${randomSite.description ? `<span class="webring-widget-static-description">${randomSite.description}</span>` : ''}
              </div>
              ${randomSiteTooltip}
            </a>
            <a href="${nextSite.url}" class="webring-widget-static-site webring-widget-static-next" style="--hover-color: ${nextSite.color || siteColor}">
              <span class="webring-widget-static-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="webring-widget-icon">
                  <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                </svg>
                Next
              </span>
              <div class="webring-widget-static-link-content">
                <strong>${nextSite.name}</strong>
                ${nextSite.description ? `<span class="webring-widget-static-description">${nextSite.description}</span>` : ''}
              </div>
              ${nextSiteTooltip}
            </a>
          </div>
        </div>
      `;
    } else {
      contentHTML = `
        <div class="webring-widget-static-content">
          <div class="webring-widget-static-header">
            <h3 class="webring-widget-static-title">
              Member of <a href="${ringletLinkUrl}" target="_blank" rel="noopener">${ringletDisplayText}</a>
            </h3>
          </div>
          <div class="webring-widget-static-simple-nav">
            <a href="${prevSite.url}" class="webring-widget-static-simple-button" title="Previous: ${prevSite.name}" style="--hover-color: ${prevSite.color || siteColor}">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="webring-widget-icon">
                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
              </svg>
              Prev
              ${prevSiteTooltip}
            </a>
            <a href="${randomSite.url}" class="webring-widget-static-simple-button" title="Random: ${randomSite.name}" style="--hover-color: ${randomSite.color || siteColor}">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="webring-widget-icon">
                <path d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z" />
              </svg>
              Random
              ${randomSiteTooltip}
            </a>
            <a href="${nextSite.url}" class="webring-widget-static-simple-button" title="Next: ${nextSite.name}" style="--hover-color: ${nextSite.color || siteColor}">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="webring-widget-icon">
                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
              </svg>
              Next
              ${nextSiteTooltip}
            </a>
          </div>
        </div>
      `;
    }
    
    // Set container content
    container.innerHTML = contentHTML;
    
    // Add styles with dynamic colors
    addStaticWidgetStyles(siteColor, textColor);
    
    // Add to the document
    document.body.appendChild(container);
    
    // Always make the widget visible initially
    container.classList.add('webring-widget-visible');
    
    // If the static widget is fixed-positioned at the top, add space
    if (config.static_position === 'top' && config.fixed_position) {
      adjustPageForTopWidget(container);
    }
  }
  
  /**
   * Adds the necessary CSS for the static widget
   */
  function addStaticWidgetStyles(backgroundColor, textColor) {
    // Check if styles are already added
    if (document.getElementById('webring-styles')) {
      return;
    }
    
    // Calculate accent colors
    const hoverBackground = textColor === "black" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)";
    const borderColor = textColor === "black" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)";
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.id = 'webring-styles';
    
    // Fixed position CSS
    const fixedPositionCSS = config.fixed_position ? `
      position: fixed;
      ${config.static_position === 'top' ? 'top: 0;' : 'bottom: 0;'}
      left: 0;
      right: 0;
      z-index: 9999;
      border-radius: 0;
      ${config.static_position === 'top' ? 'border-top: none; border-left: none; border-right: none;' : 'border-bottom: none; border-left: none; border-right: none;'}
      margin: 0;
    ` : '';
    
    // Define CSS
    styleEl.textContent = `
      .webring-widget-static {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: ${textColor};
        border: 1px solid ${borderColor};
        border-radius: 8px;
        background-color: ${backgroundColor};
        margin: 20px 0;
        overflow: visible;
        ${fixedPositionCSS}
      }
      
      .webring-widget-full-width {
        width: 100%;
      }
      
      .webring-widget-static a {
        color: ${textColor};
        text-decoration: none;
        position: relative;
      }
      
      .webring-widget-static-content {
        padding: 16px;
      }
      
      .webring-widget-static-header {
        margin-bottom: 12px;
        text-align: center;
      }
      
      .webring-widget-static-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .webring-widget-static-title a:hover {
        text-decoration: underline;
      }
      
      .webring-widget-static-sites {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }
      
      .webring-widget-static-site {
        flex: 1;
        min-width: 200px;
        padding: 12px;
        border-radius: 6px;
        background-color: ${hoverBackground};
        transition: background-color 0.2s;
        text-decoration: none;
        cursor: pointer;
        display: block;
      }
      
      .webring-widget-static-site:hover {
        background-color: var(--hover-color);
      }
      
      .webring-widget-icon {
        vertical-align: -0.125em;
        margin-right: 4px;
        display: inline-block;
      }
      
      .webring-widget-static-label {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-bottom: 4px;
      }
      
      .webring-widget-static-link-content {
        display: block;
      }
      
      .webring-widget-static-prev .webring-widget-static-link-content {
        text-align: left;
      }
      
      .webring-widget-static-random .webring-widget-static-link-content {
        text-align: center;
      }
      
      .webring-widget-static-next .webring-widget-static-link-content {
        text-align: right;
      }
      
      .webring-widget-static-random .webring-widget-static-label,
      .webring-widget-static-next .webring-widget-static-label {
        justify-content: center;
      }
      
      .webring-widget-static-next .webring-widget-static-label {
        justify-content: flex-end;
      }
      
      .webring-widget-static-link-content strong {
        display: block;
        margin-bottom: 2px;
      }
      
      .webring-widget-static-description {
        display: block;
        font-size: 12px;
      }
      
      .webring-widget-static-simple-nav {
        display: flex;
        justify-content: center;
        gap: 12px;
      }
      
      .webring-widget-static-simple-button {
        padding: 6px 12px;
        border-radius: 4px;
        background-color: ${hoverBackground};
        transition: background-color 0.2s;
        position: relative;
        display: flex;
        align-items: center;
      }
      
      .webring-widget-static-simple-button:hover {
        background-color: var(--hover-color);
      }
      
      /* Tooltip styles */
      .webring-widget-tooltip {
        position: absolute;
        top: -80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px;
        width: 160px;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
        pointer-events: none;
        z-index: 10000;
        text-align: center;
      }
      
      .webring-widget-tooltip:after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid rgba(0, 0, 0, 0.9);
      }
      
      .webring-widget-tooltip-title {
        font-weight: bold;
        margin-bottom: 4px;
        color: white;
        text-align: center;
      }
      
      .webring-widget-tooltip-description {
        font-size: 11px;
        line-height: 1.3;
        max-height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
      }
      
      .webring-widget-static-site:hover .webring-widget-tooltip,
      .webring-widget-static-simple-button:hover .webring-widget-tooltip {
        opacity: 1;
        visibility: visible;
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
        .webring-widget-static-sites {
          flex-direction: column;
        }
        
        .webring-widget-tooltip {
          width: 140px;
        }
      }
    `;
    
    // Set the style content
    styleEl.textContent = styleEl.textContent.trim();
    
    // Add styles to the document
    document.head.appendChild(styleEl);
  }
  
  /**
   * Adds space to the top of the page to prevent content from being hidden under the widget
   */
  function adjustPageForTopWidget(widgetElement) {
    // Get the height of the widget
    let widgetHeight = widgetElement.offsetHeight;
    
    // Create a style element if it doesn't exist
    let spacerStyle = document.getElementById('webring-spacer-style');
    if (!spacerStyle) {
      spacerStyle = document.createElement('style');
      spacerStyle.id = 'webring-spacer-style';
      document.head.appendChild(spacerStyle);
    }
    
    // Set the body padding to match widget height
    spacerStyle.textContent = `
      body {
        padding-top: ${widgetHeight}px !important;
      }
    `;
    
    // Set up a resize observer to adjust the padding if widget size changes
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target === widgetElement) {
            const newHeight = entry.contentRect.height;
            spacerStyle.textContent = `
              body {
                padding-top: ${newHeight}px !important;
              }
            `;
          }
        }
      });
      
      resizeObserver.observe(widgetElement);
    }
    
    // Fallback for browsers without ResizeObserver - listen for window resize
    else {
      const updatePadding = () => {
        const newHeight = widgetElement.offsetHeight;
        spacerStyle.textContent = `
          body {
            padding-top: ${newHeight}px !important;
          }
        `;
      };
      
      window.addEventListener('resize', updatePadding);
    }
  }
  
  /**
   * Sets up the slide-out functionality for widgets
   * This is responsible for adding the webring-widget-visible class
   */
  function setupSlideOut(container) {
    // For slide-out functionality
    if (config.slide_toggle) {
      // Track whether the user has manually toggled the widget
      let userToggled = false;
      
      // Initially show widget for a few seconds
      setTimeout(() => {
        // Only auto-hide initially if user hasn't toggled
        if (!userToggled) {
          container.classList.remove('webring-widget-visible');
        }
      }, 3000);
      
      // Find the pull tab element
      const pullTab = container.querySelector('.webring-widget-pull-tab');
      
      // Make sure pull tab is always visible by positioning it outside the container
      // when the container is slid out
      if (pullTab) {
        pullTab.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          userToggled = true; // Mark that user has manually toggled
          container.classList.toggle('webring-widget-visible');
        });
      }
      
      // No automatic behavior on hover or mouseleave - only respond to explicit user actions
      container.addEventListener('mouseenter', () => {
        // Don't auto-show on hover
      });
      
      container.addEventListener('mouseleave', () => {
        // Don't auto-hide on mouseleave
      });
    }
    
    // For auto-hide functionality (if enabled)
    else if (config.auto_hide) {
      let timer = null;
      const hideWidget = () => {
        container.classList.remove('webring-widget-visible');
      };
      
      const showWidget = () => {
        container.classList.add('webring-widget-visible');
        
        // Reset timer
        if (timer) clearTimeout(timer);
        
        // Set new timer for hiding
        timer = setTimeout(hideWidget, config.hide_delay || 3000);
      };
      
      // Initially hide after delay
      timer = setTimeout(hideWidget, config.hide_delay || 3000);
      
      // Show on hover or scroll
      container.addEventListener('mouseenter', showWidget);
      window.addEventListener('scroll', showWidget, { passive: true });
    }
  }
})();