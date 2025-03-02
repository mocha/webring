/**
 * Webring Widget
 * Add this to your site to participate in the webring!
 * https://github.com/mocha/webring for more info
 */
(function() {
  // Default configuration
  const config = {
    ringlet: null,
    colormode: "light",
    position: "bottom", // Possible values: top, bottom, left, right, top-left, top-right, bottom-left, bottom-right
    siteUrl: null, // Allow users to specify their URL if auto-detection fails
    baseUrl: "https://webring.fun", // Base URL for the webring site
    type: "bar", // Widget type: "bar", "box", or "static"
    color: null, // Custom hex color code (takes precedence over colormode)
    opacity: 1, // Opacity value from 0.2 to 1
    slide_out: false, // Whether widget should slide out after a delay
    full_width: false, // For static widget: whether it should take full width
    extra_details: true, // For static widget: whether to show detailed info
    auto_hide: false, // Whether widget should auto-hide after a delay
    hide_delay: 3000, // Delay in milliseconds before auto-hide
    static_position: null, // For static widget: position
    fixed_position: false // For static widget: whether it's fixed-positioned
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
      color: "#000000",
      opacity: 0.85,
      siteUrl: null,
      ringlet: null,
      slide_out: false,
      full_width: false,
      extra_details: true,
      auto_hide: false,
      hide_delay: 3000,
      static_position: 'inline',
      fixed_position: false
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
    
    // Validate color
    if (typeof config.color !== 'string' || !config.color.match(/^#[0-9A-Fa-f]{6}$/)) {
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
    
    // Create HTML
    container.innerHTML = `
      <div class="webring-widget-content">
        <span class="webring-widget-description">
          🎉 This site is a member of ${ringlet.name ? 'the ' : ''}<a href="${ringletLinkUrl}" target="_blank" rel="noopener">
            ${ringletDisplayText}
          </a>!
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
    `;
    
    // Add styles with dynamic colors
    addBarWidgetStyles(siteColor, textColor);
    
    // Add to the document
    document.body.appendChild(container);
    
    // Always make the widget visible initially
    container.classList.add('webring-widget-visible');
    
    // Add slide out functionality if enabled
    if (config.slide_out) {
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
    
    // Define CSS
    styleEl.textContent = `
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
      
      .webring-widget-button svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        fill: currentColor;
      }
      
      .webring-widget-button:hover {
        background-color: ${hoverBackground};
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
  
  /**
   * Creates and inserts the box widget DOM elements
   */
  function createBoxWidgetDOM(prevSite, nextSite, allSites, ringlet, siteColor) {
    // Create container
    const container = document.createElement('div');
    container.id = 'webring-widget';
    container.className = `webring-widget webring-widget-box`;
    
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
      ringletLinkUrl = config.baseUrl;
      ringletDisplayText = 'webring.fun';
    } else if (ringlet.name && !ringlet.url) {
      ringletLinkUrl = `${config.baseUrl}/?ringlet=${config.ringlet}`;
      ringletDisplayText = `${ringlet.name}`;
    } else {
      ringletLinkUrl = ringlet.url;
      ringletDisplayText = `${ringlet.name}`;
    }
    
    // Determine text color based on background color
    const textColor = getTextColorForBackground(siteColor);
    
    // Create HTML
    container.innerHTML = `
      <div class="webring-widget-box-content">
        <div class="webring-widget-box-header">
          <a href="${ringletLinkUrl}" target="_blank" rel="noopener" class="webring-widget-box-title">
            ${ringletDisplayText}
          </a>
        </div>
        <nav class="webring-widget-box-nav">
          <a href="${prevSite.url}" class="webring-widget-box-button" title="Previous: ${prevSite.name}">
            ${getIconHtml('left')}
          </a>
          <a href="${randomSite.url}" class="webring-widget-box-button" title="Random: ${randomSite.name}">
            ${getIconHtml('random')}
          </a>
          <a href="${nextSite.url}" class="webring-widget-box-button" title="Next: ${nextSite.name}">
            ${getIconHtml('right')}
          </a>
        </nav>
      </div>
    `;
    
    // Add styles with dynamic colors
    addBoxWidgetStyles(siteColor, textColor);
    
    // Add to the document
    document.body.appendChild(container);
    
    // Always make the widget visible initially
    container.classList.add('webring-widget-visible');
    
    // Add slide out functionality if enabled
    if (config.slide_out) {
      setupSlideOut(container);
    }
    
    // Add space to the page if widget is at top positions
    if (config.position === 'top-left' || config.position === 'top-right') {
      adjustPageForTopWidget(container);
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
    styleEl.textContent = `
      .webring-widget-box {
        position: fixed;
        ${config.position === 'top-right' ? 'top: 20px; right: 20px;' : 
          config.position === 'top-left' ? 'top: 20px; left: 20px;' : 
          config.position === 'bottom-left' ? 'bottom: 20px; left: 20px;' : 'bottom: 20px; right: 20px;'
        }
        z-index: 9999;
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
        transform: translateY(0); /* Visible by default */
      }
      
      .webring-widget-box.webring-widget-visible {
        transform: translateY(0);
        opacity: 1;
      }
      
      .webring-widget-box:not(.webring-widget-visible) {
        transform: translateY(10px);
        opacity: 0;
      }
      
      .webring-widget-box .webring-widget-content {
        padding: 12px;
      }
      
      .webring-widget-box .webring-widget-description {
        display: block;
        margin-bottom: 10px;
        text-align: center;
      }
      
      .webring-widget a {
        color: inherit;
        text-decoration: none;
      }
      
      .webring-widget-description a:hover {
        text-decoration: underline;
      }
      
      .webring-widget-box .webring-widget-nav {
        display: flex;
        justify-content: space-between;
      }
      
      .webring-widget-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        background: transparent;
        transition: background-color 0.2s;
      }
      
      .webring-widget-button svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        fill: currentColor;
      }
      
      .webring-widget-button:hover {
        background-color: ${hoverBackground};
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
        .webring-widget-box {
          width: 180px;
        }
        
        .webring-widget-description {
          font-size: 12px;
        }
      }
    `;
    
    // Add to document head
    document.head.appendChild(styleEl);
  }
  
  /**
   * Creates and inserts the static widget DOM elements
   */
  function createStaticWidgetDOM(prevSite, nextSite, allSites, ringlet, siteColor) {
    // Find the script tag to insert the widget at that position
    const scriptTags = document.querySelectorAll('script');
    let targetScript = null;
    
    // Find this script
    for (const script of scriptTags) {
      if (script.src && script.src.includes('widget.js')) {
        targetScript = script;
        break;
      }
    }
    
    if (!targetScript) {
      console.error('Could not find webring widget script tag for static widget placement');
      return;
    }
    
    // Create container
    const container = document.createElement('div');
    container.id = 'webring-widget';
    container.className = `webring-widget webring-widget-static ${config.full_width ? 'webring-widget-full-width' : ''}`;
    
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
      ringletLinkUrl = config.baseUrl;
      ringletDisplayText = 'webring.fun';
    } else if (ringlet.name && !ringlet.url) {
      ringletLinkUrl = `${config.baseUrl}/?ringlet=${config.ringlet}`;
      ringletDisplayText = `${ringlet.name} webring`;
    } else {
      ringletLinkUrl = ringlet.url;
      ringletDisplayText = `${ringlet.name} webring`;
    }
    
    // Determine text color based on background color
    const textColor = getTextColorForBackground(siteColor);
    
    // Create HTML
    if (config.extra_details) {
      container.innerHTML = `
        <div class="webring-widget-static-content">
          <div class="webring-widget-static-header">
            <h3 class="webring-widget-static-title">
              Member of <a href="${ringletLinkUrl}" target="_blank" rel="noopener">${ringletDisplayText}</a>
            </h3>
          </div>
          <div class="webring-widget-static-sites">
            <div class="webring-widget-static-site webring-widget-static-prev">
              <span class="webring-widget-static-label">← Previous</span>
              <a href="${prevSite.url}" class="webring-widget-static-link" title="Visit ${prevSite.name}">
                <strong>${prevSite.name}</strong>
                ${prevSite.description ? `<span class="webring-widget-static-description">${prevSite.description}</span>` : ''}
              </a>
            </div>
            <div class="webring-widget-static-site webring-widget-static-random">
              <span class="webring-widget-static-label">↻ Random</span>
              <a href="${randomSite.url}" class="webring-widget-static-link" title="Visit ${randomSite.name}">
                <strong>${randomSite.name}</strong>
                ${randomSite.description ? `<span class="webring-widget-static-description">${randomSite.description}</span>` : ''}
              </a>
            </div>
            <div class="webring-widget-static-site webring-widget-static-next">
              <span class="webring-widget-static-label">Next →</span>
              <a href="${nextSite.url}" class="webring-widget-static-link" title="Visit ${nextSite.name}">
                <strong>${nextSite.name}</strong>
                ${nextSite.description ? `<span class="webring-widget-static-description">${nextSite.description}</span>` : ''}
              </a>
            </div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="webring-widget-static-content">
          <div class="webring-widget-static-header">
            <h3 class="webring-widget-static-title">
              Member of <a href="${ringletLinkUrl}" target="_blank" rel="noopener">${ringletDisplayText}</a>
            </h3>
          </div>
          <div class="webring-widget-static-simple-nav">
            <a href="${prevSite.url}" class="webring-widget-static-simple-button" title="Previous: ${prevSite.name}">← Prev</a>
            <a href="${randomSite.url}" class="webring-widget-static-simple-button" title="Random: ${randomSite.name}">Random</a>
            <a href="${nextSite.url}" class="webring-widget-static-simple-button" title="Next: ${nextSite.name}">Next →</a>
          </div>
        </div>
      `;
    }
    
    // Add styles with dynamic colors
    addStaticWidgetStyles(siteColor, textColor);
    
    // Add to the document
    document.body.appendChild(container);
    
    // Always make the widget visible initially
    container.classList.add('webring-widget-visible');
    
    // Add slide out functionality if enabled
    if (config.slide_out) {
      setupSlideOut(container);
    }
    
    // If the static widget is fixed-positioned at the top, add space
    if (config.static_position === 'top' && config.fixed_position) {
      adjustPageForTopWidget(container);
    }
  }
  
  /**
   * Sets up the slide-out functionality for widgets
   * This is responsible for adding the webring-widget-visible class
   */
  function setupSlideOut(container) {
    // The widget is already visible by default now
    // We only use this function for auto-hide behavior
    
    // For auto-hide functionality (if enabled)
    if (config.auto_hide) {
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
        overflow: hidden;
        ${fixedPositionCSS}
      }
      
      .webring-widget-full-width {
        width: 100%;
      }
      
      .webring-widget-static a {
        color: ${textColor};
        text-decoration: none;
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
      }
      
      .webring-widget-static-label {
        display: block;
        font-size: 12px;
        margin-bottom: 4px;
        opacity: 0.8;
      }
      
      .webring-widget-static-link {
        display: block;
      }
      
      .webring-widget-static-link strong {
        display: block;
        margin-bottom: 2px;
      }
      
      .webring-widget-static-description {
        display: block;
        font-size: 12px;
        opacity: 0.8;
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
        transition: opacity 0.2s;
      }
      
      .webring-widget-static-simple-button:hover {
        opacity: 0.8;
      }
      
      @media (max-width: 600px) {
        .webring-widget-static-sites {
          flex-direction: column;
        }
      }
    `;
    
    // Add to document head
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
})();