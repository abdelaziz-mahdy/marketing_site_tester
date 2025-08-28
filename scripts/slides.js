/* ==========================================================================
   Wireless Testing Toolkit Marketing Site - Slide Management
   ========================================================================== */

/**
 * Slide Manager - Handles slide navigation, transitions, and state management
 */
class SlideManager {
  constructor() {
    // Configuration
    this.config = {
      totalSlides: 6,
      animationDuration: 600,
      autoplay: false,
      autoplayInterval: 8000,
      swipeThreshold: 50,
      keyboardEnabled: true,
      touchEnabled: true
    };

    // State
    this.currentSlide = 1;
    this.isTransitioning = false;
    this.autoplayTimer = null;
    this.touchStartX = 0;
    this.touchEndX = 0;

    // Elements
    this.slidesContainer = null;
    this.slides = [];
    this.indicators = [];
    this.navButtons = {};
    this.progressBar = null;

    // Initialize
    this.init();
  }

  /**
   * Initialize the slide manager
   */
  init() {
    try {
      this.initializeElements();
      this.initializeEventListeners();
      this.updateUI();
      this.log('SlideManager initialized successfully');
    } catch (error) {
      this.error('Failed to initialize SlideManager:', error);
    }
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    // Main containers
    this.slidesContainer = document.getElementById('slidesContainer');
    if (!this.slidesContainer) {
      throw new Error('Slides container not found');
    }

    // Get all slides
    this.slides = Array.from(this.slidesContainer.querySelectorAll('.slide'));
    if (this.slides.length !== this.config.totalSlides) {
      this.warn(`Expected ${this.config.totalSlides} slides, found ${this.slides.length}`);
    }

    // Navigation buttons
    this.navButtons.prev = document.querySelector('.slide-nav-prev');
    this.navButtons.next = document.querySelector('.slide-nav-next');

    // Indicators
    this.indicators = Array.from(document.querySelectorAll('.slide-indicator'));

    // Progress bar
    this.progressBar = document.querySelector('.slide-progress-bar');

    // Validate critical elements
    if (!this.navButtons.prev || !this.navButtons.next) {
      throw new Error('Navigation buttons not found');
    }
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Navigation buttons
    this.navButtons.prev.addEventListener('click', () => this.previousSlide());
    this.navButtons.next.addEventListener('click', () => this.nextSlide());

    // Indicator buttons
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index + 1));
    });

    // Touch/swipe support
    if (this.config.touchEnabled) {
      this.initializeTouchHandlers();
    }

    // Window resize
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    // Visibility change (pause autoplay when not visible)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoplay();
      } else if (this.config.autoplay) {
        this.startAutoplay();
      }
    });
  }

  /**
   * Initialize touch/swipe handlers
   */
  initializeTouchHandlers() {
    this.slidesContainer.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.slidesContainer.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  /**
   * Handle swipe gestures
   */
  handleSwipe() {
    const diff = this.touchEndX - this.touchStartX;
    
    if (Math.abs(diff) > this.config.swipeThreshold) {
      if (diff > 0) {
        // Swipe right (previous slide)
        this.previousSlide();
      } else {
        // Swipe left (next slide)
        this.nextSlide();
      }
    }
  }

  /**
   * Navigate to next slide
   */
  nextSlide() {
    if (this.currentSlide < this.config.totalSlides) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  /**
   * Navigate to previous slide
   */
  previousSlide() {
    if (this.currentSlide > 1) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  /**
   * Navigate to specific slide
   */
  goToSlide(slideNumber) {
    // Validate slide number
    if (slideNumber < 1 || slideNumber > this.config.totalSlides) {
      this.warn(`Invalid slide number: ${slideNumber}`);
      return;
    }

    // Prevent multiple transitions
    if (this.isTransitioning) {
      return;
    }

    // Don't transition to current slide
    if (slideNumber === this.currentSlide) {
      return;
    }

    this.log(`Transitioning from slide ${this.currentSlide} to slide ${slideNumber}`);

    // Start transition
    this.isTransitioning = true;
    
    // Dispatch event
    this.dispatchEvent('slide:changing', {
      from: this.currentSlide,
      to: slideNumber
    });

    // Perform transition
    this.performTransition(this.currentSlide, slideNumber)
      .then(() => {
        // Update state
        this.currentSlide = slideNumber;
        
        // Update UI
        this.updateUI();
        
        // End transition
        this.isTransitioning = false;
        
        // Dispatch event
        this.dispatchEvent('slide:changed', {
          slideNumber: this.currentSlide,
          totalSlides: this.config.totalSlides,
          title: this.getSlideTitle(this.currentSlide)
        });

        this.log(`Transition to slide ${slideNumber} completed`);
      })
      .catch((error) => {
        this.error('Slide transition failed:', error);
        this.isTransitioning = false;
      });
  }

  /**
   * Perform slide transition animation
   */
  performTransition(fromSlide, toSlide) {
    return new Promise((resolve, reject) => {
      try {
        const currentSlideEl = this.slides[fromSlide - 1];
        const nextSlideEl = this.slides[toSlide - 1];

        if (!currentSlideEl || !nextSlideEl) {
          reject(new Error('Slide elements not found'));
          return;
        }

        // Prepare next slide
        nextSlideEl.style.transform = toSlide > fromSlide ? 'translateX(100%)' : 'translateX(-100%)';
        nextSlideEl.style.opacity = '0';
        nextSlideEl.classList.remove('active');
        nextSlideEl.setAttribute('aria-hidden', 'false');

        // Animate out current slide
        currentSlideEl.style.transform = toSlide > fromSlide ? 'translateX(-100%)' : 'translateX(100%)';
        currentSlideEl.style.opacity = '0';

        // Animate in next slide
        requestAnimationFrame(() => {
          nextSlideEl.style.transition = `all ${this.config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          nextSlideEl.style.transform = 'translateX(0)';
          nextSlideEl.style.opacity = '1';
        });

        // Complete transition
        setTimeout(() => {
          // Clean up current slide
          currentSlideEl.classList.remove('active');
          currentSlideEl.setAttribute('aria-hidden', 'true');
          currentSlideEl.style.transform = '';
          currentSlideEl.style.opacity = '';
          currentSlideEl.style.transition = '';

          // Activate next slide
          nextSlideEl.classList.add('active');
          nextSlideEl.style.transform = '';
          nextSlideEl.style.opacity = '';
          nextSlideEl.style.transition = '';

          resolve();
        }, this.config.animationDuration);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Update UI elements
   */
  updateUI() {
    this.updateNavigationButtons();
    this.updateIndicators();
    this.updateProgressBar();
    this.updateAccessibility();
  }

  /**
   * Update navigation button states
   */
  updateNavigationButtons() {
    // Previous button
    if (this.currentSlide <= 1) {
      this.navButtons.prev.disabled = true;
      this.navButtons.prev.setAttribute('aria-disabled', 'true');
    } else {
      this.navButtons.prev.disabled = false;
      this.navButtons.prev.setAttribute('aria-disabled', 'false');
    }

    // Next button
    if (this.currentSlide >= this.config.totalSlides) {
      this.navButtons.next.disabled = true;
      this.navButtons.next.setAttribute('aria-disabled', 'true');
    } else {
      this.navButtons.next.disabled = false;
      this.navButtons.next.setAttribute('aria-disabled', 'false');
    }
  }

  /**
   * Update slide indicators
   */
  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      const slideNumber = index + 1;
      const isActive = slideNumber === this.currentSlide;
      
      indicator.classList.toggle('active', isActive);
      indicator.setAttribute('aria-selected', isActive.toString());
      indicator.setAttribute('aria-label', `Go to slide ${slideNumber}${isActive ? ' (current)' : ''}`);
    });
  }

  /**
   * Update progress bar
   */
  updateProgressBar() {
    if (this.progressBar) {
      const progress = (this.currentSlide / this.config.totalSlides) * 100;
      this.progressBar.style.width = `${progress}%`;
      
      // Update progress bar ARIA
      const progressContainer = this.progressBar.parentElement;
      if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', this.currentSlide.toString());
      }
    }
  }

  /**
   * Update accessibility attributes
   */
  updateAccessibility() {
    this.slides.forEach((slide, index) => {
      const slideNumber = index + 1;
      const isActive = slideNumber === this.currentSlide;
      
      slide.setAttribute('aria-hidden', (!isActive).toString());
      
      if (isActive) {
        // Focus management for active slide
        const focusableElement = slide.querySelector('h1, h2, .btn-primary, [tabindex="0"]');
        if (focusableElement && document.activeElement === document.body) {
          focusableElement.focus({ preventScroll: true });
        }
      }
    });
  }

  /**
   * Start autoplay
   */
  startAutoplay() {
    if (!this.config.autoplay) return;
    
    this.pauseAutoplay(); // Clear any existing timer
    
    this.autoplayTimer = setInterval(() => {
      if (this.currentSlide < this.config.totalSlides) {
        this.nextSlide();
      } else {
        // Loop back to first slide or stop
        this.goToSlide(1);
      }
    }, this.config.autoplayInterval);
    
    this.log('Autoplay started');
  }

  /**
   * Pause autoplay
   */
  pauseAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
      this.log('Autoplay paused');
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Recalculate layouts if needed
    this.log('Window resized, updating slide layouts');
    
    // Force reflow to fix any layout issues
    this.slides.forEach(slide => {
      slide.style.transform = '';
      slide.offsetHeight; // Trigger reflow
    });
  }

  /**
   * Get slide title for accessibility
   */
  getSlideTitle(slideNumber) {
    const slide = this.slides[slideNumber - 1];
    if (slide) {
      const titleElement = slide.querySelector('h1, h2, .display, [data-slide-title]');
      if (titleElement) {
        return titleElement.textContent.trim();
      }
    }
    return `Slide ${slideNumber}`;
  }

  /**
   * Dispatch custom event
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
   * Debounce utility
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Logging utilities
   */
  log(...args) {
    if (window.app && window.app.debug) {
      console.log('[SlideManager]', ...args);
    }
  }

  warn(...args) {
    if (window.app && window.app.debug) {
      console.warn('[SlideManager]', ...args);
    }
  }

  error(...args) {
    console.error('[SlideManager]', ...args);
  }
}

// Export for global usage
window.SlideManager = SlideManager;