/* ==========================================================================
   Claude Flow BLE Marketing Site - Main JavaScript
   ========================================================================== */

/**
 * Main application initialization and global utilities
 */
class MarketingSiteApp {
  constructor() {
    this.isInitialized = false;
    this.debug = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  /**
   * Initialize the application
   */
  init() {
    if (this.isInitialized) return;
    
    this.log('Initializing Claude Flow BLE Marketing Site...');
    
    try {
      // Initialize core components
      this.initializeScrollNavigation();
      this.initializeAccessibility();
      this.initializePerformanceMonitoring();
      this.initializeAnalytics();
      
      this.isInitialized = true;
      this.log('Application initialized successfully');
      
      // Dispatch custom event
      this.dispatchEvent('app:initialized');
      
    } catch (error) {
      this.error('Failed to initialize application:', error);
    }
  }

  /**
   * Initialize scroll navigation functionality
   */
  initializeScrollNavigation() {
    // Initialize smooth scrolling with section detection
    this.initializeSectionScrolling();
    
    // Initialize scroll-based animations
    this.initializeScrollAnimations();
    
    this.log('Scroll navigation initialized');
  }

  /**
   * Initialize section-based scrolling
   */
  initializeSectionScrolling() {
    // Get all sections
    this.sections = document.querySelectorAll('.section');
    this.currentSection = 0;
    
    // Initialize intersection observer for section detection
    if ('IntersectionObserver' in window) {
      this.initializeSectionObserver();
    }
    
    // Add smooth scroll behavior to all internal links
    this.initializeAnchorLinks();
  }

  /**
   * Initialize intersection observer for section detection
   */
  initializeSectionObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.5
    };

    this.sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionIndex = Array.from(this.sections).indexOf(entry.target);
          this.currentSection = sectionIndex;
          
          // Dispatch section change event
          this.dispatchEvent('section:changed', {
            sectionIndex,
            sectionId: entry.target.id,
            sectionTitle: this.getSectionTitle(entry.target)
          });
        }
      });
    }, options);

    this.sections.forEach(section => {
      this.sectionObserver.observe(section);
    });
  }

  /**
   * Initialize anchor link smooth scrolling
   */
  initializeAnchorLinks() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
  }

  /**
   * Initialize scroll-based animations
   */
  initializeScrollAnimations() {
    // Add scroll listener for animations
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScrollAnimations();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Handle scroll-based animations
   */
  handleScrollAnimations() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    // Animate elements that come into view
    const animateElements = document.querySelectorAll('.card, .feature-card, .use-case, .roadmap-item');
    
    animateElements.forEach(element => {
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      
      if (scrollTop + windowHeight > elementTop + elementHeight * 0.2) {
        element.classList.add('animate-in');
      }
    });
  }

  /**
   * Get section title for accessibility
   */
  getSectionTitle(section) {
    const titleElement = section.querySelector('h1, h2, [id*="title"]');
    if (titleElement) {
      return titleElement.textContent.trim();
    }
    return section.id ? section.id.charAt(0).toUpperCase() + section.id.slice(1) : 'Section';
  }

  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    // Keyboard navigation
    this.initializeKeyboardNavigation();
    
    // Focus management
    this.initializeFocusManagement();
    
    // Screen reader support
    this.initializeScreenReaderSupport();
    
    this.log('Accessibility features initialized');
  }

  /**
   * Initialize keyboard navigation
   */
  initializeKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      // Don't interfere with form inputs
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.code) {
        case 'ArrowUp':
          event.preventDefault();
          this.scrollToPreviousSection();
          break;
        
        case 'ArrowDown':
        case 'Space':
          event.preventDefault();
          this.scrollToNextSection();
          break;
        
        case 'Home':
          event.preventDefault();
          this.scrollToSection('hero');
          break;
        
        case 'End':
          event.preventDefault();
          this.scrollToSection('download');
          break;
        
        case 'Escape':
          // Future: Close modal or exit fullscreen
          break;
      }
    });
  }

  /**
   * Scroll to previous section
   */
  scrollToPreviousSection() {
    if (this.currentSection > 0) {
      const prevSection = this.sections[this.currentSection - 1];
      if (prevSection && prevSection.id) {
        this.scrollToSection(prevSection.id);
      }
    }
  }

  /**
   * Scroll to next section
   */
  scrollToNextSection() {
    if (this.currentSection < this.sections.length - 1) {
      const nextSection = this.sections[this.currentSection + 1];
      if (nextSection && nextSection.id) {
        this.scrollToSection(nextSection.id);
      }
    }
  }

  /**
   * Scroll to specific section by ID
   */
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Track analytics if available
      if (this.analytics) {
        this.analytics.track('section_navigated', {
          section: sectionId,
          method: 'scroll'
        });
      }
      
      // Update URL hash without triggering scroll
      history.replaceState(null, null, `#${sectionId}`);
      
      this.log(`Scrolled to section: ${sectionId}`);
    }
  }

  /**
   * Initialize focus management
   */
  initializeFocusManagement() {
    // Skip links for screen readers
    this.createSkipLink();
    
    // Focus trap for modal-like behavior (if needed)
    this.initializeFocusTrap();
  }

  /**
   * Create skip link for accessibility
   */
  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#mainContent';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--color-primary);
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.2s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
      skipLink.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
      skipLink.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Initialize focus trap (for future modal usage)
   */
  initializeFocusTrap() {
    // Implementation for focus trapping when needed
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  }

  /**
   * Initialize screen reader support
   */
  initializeScreenReaderSupport() {
    // Create screen reader announcement area
    this.createScreenReaderAnnouncement();
    
    // Listen for section changes and announce them
    document.addEventListener('section:changed', (event) => {
      const { sectionId, sectionTitle } = event.detail;
      this.announceToScreenReader(`Navigated to section: ${sectionTitle}`);
    });
  }

  /**
   * Create screen reader announcement area
   */
  createScreenReaderAnnouncement() {
    const announcement = document.createElement('div');
    announcement.id = 'sectionAnnouncement';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    document.body.appendChild(announcement);
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    const announcement = document.getElementById('sectionAnnouncement');
    if (announcement) {
      announcement.textContent = message;
    }
  }

  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    // Web Vitals monitoring (if available)
    this.monitorWebVitals();
    
    // Custom performance metrics
    this.monitorScrollPerformance();
    
    this.log('Performance monitoring initialized');
  }

  /**
   * Monitor Web Vitals
   */
  monitorWebVitals() {
    // Placeholder for Web Vitals integration
    if (typeof webVitals !== 'undefined') {
      webVitals.getFCP(this.handleWebVital.bind(this));
      webVitals.getLCP(this.handleWebVital.bind(this));
      webVitals.getCLS(this.handleWebVital.bind(this));
    }
  }

  /**
   * Handle Web Vital measurements
   */
  handleWebVital(metric) {
    this.log(`Web Vital ${metric.name}:`, metric.value);
    
    // Send to analytics if configured
    if (this.analytics) {
      this.analytics.track('web_vital', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating
      });
    }
  }

  /**
   * Monitor scroll performance
   */
  monitorScrollPerformance() {
    let scrollStartTime = performance.now();
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
      if (!isScrolling) {
        scrollStartTime = performance.now();
        isScrolling = true;
      }
      
      // Debounce scroll end detection
      clearTimeout(this.scrollEndTimer);
      this.scrollEndTimer = setTimeout(() => {
        const scrollTime = performance.now() - scrollStartTime;
        this.log(`Scroll operation took ${scrollTime.toFixed(2)}ms`);
        isScrolling = false;
        
        if (scrollTime > 100) {
          this.warn(`Slow scroll performance detected: ${scrollTime.toFixed(2)}ms`);
        }
      }, 150);
    });
    
    // Monitor section changes
    document.addEventListener('section:changed', (event) => {
      const sectionChangeTime = performance.now();
      this.log(`Section changed to: ${event.detail.sectionId} at ${sectionChangeTime.toFixed(2)}ms`);
    });
  }

  /**
   * Initialize analytics (privacy-safe)
   */
  initializeAnalytics() {
    // Only initialize if user hasn't opted out
    if (this.hasAnalyticsConsent()) {
      this.setupAnalytics();
    }
    
    this.log('Analytics initialized');
  }

  /**
   * Check for analytics consent
   */
  hasAnalyticsConsent() {
    // Check localStorage for consent (implement as needed)
    return localStorage.getItem('analytics-consent') === 'true';
  }

  /**
   * Setup analytics tracking
   */
  setupAnalytics() {
    // Placeholder for analytics setup
    this.analytics = {
      track: (event, properties) => {
        if (this.debug) {
          this.log('Analytics Event:', event, properties);
        }
        // Implement actual analytics tracking here
      }
    };
    
    // Track page view
    this.analytics.track('page_view', {
      page: window.location.pathname,
      title: document.title
    });
  }

  /**
   * Utility method to dispatch custom events
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Utility method for safe element selection
   */
  $(selector, context = document) {
    return context.querySelector(selector);
  }

  /**
   * Utility method for safe element selection (multiple)
   */
  $$(selector, context = document) {
    return context.querySelectorAll(selector);
  }

  /**
   * Debounce utility
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

  /**
   * Throttle utility
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Logging utilities
   */
  log(...args) {
    if (this.debug) {
      console.log(`[MarketingSite]`, ...args);
    }
  }

  warn(...args) {
    if (this.debug) {
      console.warn(`[MarketingSite]`, ...args);
    }
  }

  error(...args) {
    console.error(`[MarketingSite]`, ...args);
  }
}

// Global utilities
window.MarketingSiteApp = MarketingSiteApp;

// Initialize the application
window.app = new MarketingSiteApp();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarketingSiteApp;
}

/* ==========================================================================
   Global Functions for Button Handlers
   ========================================================================== */

/**
 * Scroll to specific section by ID
 */
function scrollToSection(sectionId) {
  if (window.app) {
    window.app.scrollToSection(sectionId);
  } else {
    // Fallback if app not available
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Section not found: ${sectionId}`);
    }
  }
}

/**
 * Navigate to next section
 */
function nextSection() {
  if (window.app) {
    window.app.scrollToNextSection();
  } else {
    console.warn('App not available');
  }
}

/**
 * Navigate to previous section
 */
function previousSection() {
  if (window.app) {
    window.app.scrollToPreviousSection();
  } else {
    console.warn('App not available');
  }
}

/**
 * Handle download button click - shows download modal with platform options
 */
function handleDownloadClick(event) {
  // Prevent default anchor behavior for now
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  
  // Track analytics if available
  if (window.app && window.app.analytics) {
    window.app.analytics.track('download_clicked', {
      source: 'section_button',
      section: window.location.hash || '#hero'
    });
  }
  
  // Navigate to download section if not already there
  const currentSection = document.querySelector('.section:target') || document.querySelector('#hero');
  if (!currentSection || currentSection.id !== 'download') {
    scrollToSection('download');
    return;
  }
  
  // Show download options modal (for now, just scroll to download section)
  const downloadSection = document.querySelector('.download-platforms');
  if (downloadSection) {
    downloadSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Highlight download buttons briefly
    const downloadButtons = document.querySelectorAll('.download-link');
    downloadButtons.forEach(button => {
      button.style.transform = 'scale(1.02)';
      button.style.transition = 'transform 0.3s ease';
      setTimeout(() => {
        button.style.transform = '';
      }, 600);
    });
  }
  
  console.log('Download button clicked - navigated to download options');
}

/**
 * Handle donation button click with specified amount
 */
function handleDonationClick(event, amount) {
  // Prevent default behavior
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  
  // Validate amount
  if (!amount || amount < 1) {
    console.error('Invalid donation amount:', amount);
    return;
  }
  
  // Track analytics if available
  if (window.app && window.app.analytics) {
    window.app.analytics.track('donation_clicked', {
      amount: amount,
      source: 'monetization_section',
      section: window.location.hash || '#monetization'
    });
  }
  
  // Generate donation URL (GitHub Sponsors as example)
  // In production, replace with actual donation platform
  const donationUrl = generateDonationUrl(amount);
  
  // Open donation page in new tab
  window.open(donationUrl, '_blank', 'noopener,noreferrer');
  
  console.log(`Donation button clicked - Amount: $${amount}`);
}

/**
 * Handle custom donation button click
 */
function handleCustomDonationClick(event) {
  // Prevent default behavior
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  
  // Prompt user for custom amount
  const customAmount = prompt('Enter your preferred donation amount (minimum $1):', '5');
  
  if (customAmount === null) {
    // User cancelled
    return;
  }
  
  const amount = parseFloat(customAmount);
  
  // Validate custom amount
  if (isNaN(amount) || amount < 1) {
    alert('Please enter a valid amount of $1 or more.');
    return;
  }
  
  // Use the same donation handler with custom amount
  handleDonationClick(null, amount);
}

/**
 * Generate donation URL based on amount
 * @param {number} amount - Donation amount in dollars
 * @returns {string} - Donation URL
 */
function generateDonationUrl(amount) {
  // Example using GitHub Sponsors (replace with actual platform)
  const platform = 'github-sponsors';
  
  switch (platform) {
    case 'github-sponsors':
      // Replace 'your-username' with actual GitHub username
      return `https://github.com/sponsors/your-username?frequency=one-time&amount=${amount}`;
    
    case 'ko-fi':
      // Replace 'your-username' with actual Ko-fi username
      return `https://ko-fi.com/your-username?amount=${Math.ceil(amount / 3)}`;
    
    case 'buymeacoffee':
      // Replace 'your-username' with actual Buy Me a Coffee username
      return `https://www.buymeacoffee.com/your-username`;
    
    default:
      // Fallback to a placeholder
      return `https://example.com/donate?amount=${amount}`;
  }
}

/**
 * Handle newsletter form submission
 */
function handleNewsletterSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const emailInput = form.querySelector('#newsletter-email');
  const consentCheckbox = form.querySelector('#privacy-consent');
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Validate inputs
  if (!emailInput.value || !emailInput.validity.valid) {
    showNotification('Please enter a valid email address', 'error');
    emailInput.focus();
    return;
  }
  
  if (!consentCheckbox.checked) {
    showNotification('Please agree to receive updates', 'error');
    consentCheckbox.focus();
    return;
  }
  
  // Track analytics if available
  if (window.app && window.app.analytics) {
    window.app.analytics.track('newsletter_signup', {
      email_domain: emailInput.value.split('@')[1],
      section: window.location.hash || '#download'
    });
  }
  
  // Show loading state
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon animate-spin"><circle cx="12" cy="12" r="3"></circle></svg> Subscribing...';
  submitButton.disabled = true;
  
  // Simulate API call (replace with actual newsletter service)
  setTimeout(() => {
    // Reset form
    form.reset();
    
    // Restore button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    
    // Show success message
    showNotification('Successfully subscribed! Welcome to our community.', 'success');
    
    console.log('Newsletter subscription successful for:', emailInput.value);
  }, 2000);
}

/**
 * Show notification message to user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Close notification">×</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
    font-size: 14px;
  `;
  
  notification.querySelector('.notification-content').style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  `;
  
  notification.querySelector('.notification-close').style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

/**
 * Screenshot switching functionality for hero section
 */
function switchScreenshot(tabName) {
  // Remove active class from all items and buttons
  document.querySelectorAll('.screenshot-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  
  // Add active class to selected items
  document.querySelectorAll(`[data-tab="${tabName}"]`).forEach(element => {
    element.classList.add('active');
  });
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new MarketingSiteApp();
  });
} else {
  const app = new MarketingSiteApp();
}