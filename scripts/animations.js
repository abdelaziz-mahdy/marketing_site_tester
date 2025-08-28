/* ==========================================================================
   Wireless Testing Toolkit Marketing Site - Animation Utilities
   ========================================================================== */

/**
 * Animation Manager - Handles animations, transitions, and visual effects
 */
class AnimationManager {
  constructor() {
    this.config = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      defaultDuration: 300,
      defaultEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      intersectionThreshold: 0.1
    };

    this.activeAnimations = new Set();
    this.observedElements = new WeakMap();
    this.intersectionObserver = null;

    this.init();
  }

  /**
   * Initialize animation manager
   */
  init() {
    this.setupIntersectionObserver();
    this.setupReducedMotionListener();
    this.setupScrollAnimations();
    this.setupMonetizationAnimations();
    this.log('AnimationManager initialized');
  }

  /**
   * Setup intersection observer for scroll-triggered animations
   */
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          threshold: this.config.intersectionThreshold,
          rootMargin: '0px 0px -50px 0px'
        }
      );
    }
  }

  /**
   * Setup reduced motion preference listener
   */
  setupReducedMotionListener() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener((e) => {
      this.config.reducedMotion = e.matches;
      this.log('Reduced motion preference changed:', e.matches);
      
      if (e.matches) {
        this.disableAllAnimations();
      }
    });
  }

  /**
   * Setup scroll-based animations
   */
  setupScrollAnimations() {
    // Observe elements for scroll animations
    this.observeElements([
      '.feature-card',
      '.roadmap-item',
      '.use-case',
      '.card',
      '.support-feature',
      '.popup-mockup',
      '.donation-cta'
    ]);
  }

  /**
   * Setup monetization-specific animations
   */
  setupMonetizationAnimations() {
    // Add click animations for donation buttons
    document.addEventListener('click', (event) => {
      if (event.target.matches('.btn-donate, .btn-donate-custom')) {
        this.bounce(event.target, 0.05);
      }
      
      if (event.target.matches('.popup-close')) {
        this.scaleIn(event.target.closest('.popup-mockup'), 200);
      }
    });
  }

  /**
   * Observe elements for animation triggers
   */
  observeElements(selectors) {
    if (!this.intersectionObserver) return;

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.intersectionObserver.observe(element);
        this.observedElements.set(element, {
          selector,
          hasAnimated: false
        });
      });
    });
  }

  /**
   * Handle intersection observer callbacks
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      const element = entry.target;
      const data = this.observedElements.get(element);

      if (!data || data.hasAnimated) return;

      if (entry.isIntersecting) {
        this.animateElement(element, data.selector);
        data.hasAnimated = true;
      }
    });
  }

  /**
   * Animate element based on its type
   */
  animateElement(element, selector) {
    if (this.config.reducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    switch (selector) {
      case '.feature-card':
        this.animateFeatureCard(element);
        break;
      case '.roadmap-item':
        this.animateRoadmapItem(element);
        break;
      case '.use-case':
        this.animateUseCase(element);
        break;
      case '.card':
        this.animateCard(element);
        break;
      case '.support-feature':
        this.animateSupportFeature(element);
        break;
      case '.popup-mockup':
        this.animatePopupMockup(element);
        break;
      case '.donation-cta':
        this.animateDonationCTA(element);
        break;
      default:
        this.fadeIn(element);
    }
  }

  /**
   * Animate feature cards
   */
  animateFeatureCard(element) {
    const animation = element.animate([
      {
        opacity: 0,
        transform: 'translateY(30px) scale(0.95)'
      },
      {
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      }
    ], {
      duration: this.config.defaultDuration + 200,
      easing: this.config.defaultEasing,
      fill: 'forwards'
    });

    this.trackAnimation(animation);
  }

  /**
   * Animate roadmap items
   */
  animateRoadmapItem(element) {
    const index = Array.from(element.parentElement.children).indexOf(element);
    const delay = index * 150; // Stagger animation
    
    // Different animation based on screen size
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    let initialTransform, finalTransform;
    
    if (isDesktop) {
      // Desktop: animate up from below
      initialTransform = 'translateY(40px) scale(0.9)';
      finalTransform = 'translateY(0) scale(1)';
    } else {
      // Mobile: alternate left/right
      const isEven = index % 2 === 1;
      const translateX = isEven ? '30px' : '-30px';
      initialTransform = `translateX(${translateX}) translateY(20px)`;
      finalTransform = 'translateX(0) translateY(0)';
    }

    setTimeout(() => {
      const animation = element.animate([
        {
          opacity: 0,
          transform: initialTransform
        },
        {
          opacity: 1,
          transform: finalTransform
        }
      ], {
        duration: this.config.defaultDuration + 200,
        easing: this.config.defaultEasing,
        fill: 'forwards'
      });

      this.trackAnimation(animation);
      
      // Add animate-in class for CSS animations
      element.classList.add('animate-in');
    }, delay);
  }

  /**
   * Animate use case cards
   */
  animateUseCase(element) {
    const animation = element.animate([
      {
        opacity: 0,
        transform: 'translateX(-20px)'
      },
      {
        opacity: 1,
        transform: 'translateX(0)'
      }
    ], {
      duration: this.config.defaultDuration,
      easing: this.config.defaultEasing,
      fill: 'forwards'
    });

    this.trackAnimation(animation);
  }

  /**
   * Animate generic cards
   */
  animateCard(element) {
    const animation = element.animate([
      {
        opacity: 0,
        transform: 'translateY(20px)'
      },
      {
        opacity: 1,
        transform: 'translateY(0)'
      }
    ], {
      duration: this.config.defaultDuration,
      easing: this.config.defaultEasing,
      fill: 'forwards'
    });

    this.trackAnimation(animation);
  }

  /**
   * Animate support features
   */
  animateSupportFeature(element) {
    const index = Array.from(element.parentElement.children).indexOf(element);
    const delay = index * 100;

    setTimeout(() => {
      const animation = element.animate([
        {
          opacity: 0,
          transform: 'translateX(-30px)'
        },
        {
          opacity: 1,
          transform: 'translateX(0)'
        }
      ], {
        duration: this.config.defaultDuration + 100,
        easing: this.config.defaultEasing,
        fill: 'forwards'
      });

      this.trackAnimation(animation);
    }, delay);
  }

  /**
   * Animate popup mockup with floating effect
   */
  animatePopupMockup(element) {
    const animation = element.animate([
      {
        opacity: 0,
        transform: 'scale(0.8) translateY(20px)'
      },
      {
        opacity: 1,
        transform: 'scale(1) translateY(0)'
      }
    ], {
      duration: this.config.defaultDuration + 200,
      easing: this.config.defaultEasing,
      fill: 'forwards'
    });

    this.trackAnimation(animation);
  }

  /**
   * Animate donation CTA section
   */
  animateDonationCTA(element) {
    // First animate the container
    const containerAnimation = element.animate([
      {
        opacity: 0,
        transform: 'translateY(30px)'
      },
      {
        opacity: 1,
        transform: 'translateY(0)'
      }
    ], {
      duration: this.config.defaultDuration,
      easing: this.config.defaultEasing,
      fill: 'forwards'
    });

    this.trackAnimation(containerAnimation);

    // Then stagger animate the buttons
    const buttons = element.querySelectorAll('.btn-donate, .btn-donate-custom');
    setTimeout(() => {
      this.staggeredAnimation(
        Array.from(buttons),
        (btn) => this.scaleIn(btn, 200),
        50
      );
    }, 300);
  }

  /**
   * Simple fade in animation
   */
  fadeIn(element, duration = this.config.defaultDuration) {
    if (this.config.reducedMotion) {
      element.style.opacity = '1';
      return Promise.resolve();
    }

    const animation = element.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration,
      easing: this.config.defaultEasing,
      fill: 'forwards'
    });

    this.trackAnimation(animation);
    return animation.finished;
  }

  /**
   * Slide in from left animation
   */
  slideInLeft(element, duration = this.config.defaultDuration) {
    if (this.config.reducedMotion) {
      element.style.transform = 'none';
      element.style.opacity = '1';
      return Promise.resolve();
    }

    const animation = element.animate([
      {
        opacity: 0,
        transform: 'translateX(-30px)'
      },
      {
        opacity: 1,
        transform: 'translateX(0)'
      }
    ], {
      duration,
      easing: this.config.defaultEasing,
      fill: 'forwards'
    });

    this.trackAnimation(animation);
    return animation.finished;
  }

  /**
   * Slide in from right animation
   */
  slideInRight(element, duration = this.config.defaultDuration) {
    if (this.config.reducedMotion) {
      element.style.transform = 'none';
      element.style.opacity = '1';
      return Promise.resolve();
    }

    const animation = element.animate([
      {
        opacity: 0,
        transform: 'translateX(30px)'
      },
      {
        opacity: 1,
        transform: 'translateX(0)'
      }
    ], {
      duration,
      easing: this.config.defaultEasing,
      fill: 'forwards'
    });

    this.trackAnimation(animation);
    return animation.finished;
  }

  /**
   * Scale in animation
   */
  scaleIn(element, duration = this.config.defaultDuration) {
    if (this.config.reducedMotion) {
      element.style.transform = 'none';
      element.style.opacity = '1';
      return Promise.resolve();
    }

    const animation = element.animate([
      {
        opacity: 0,
        transform: 'scale(0.8)'
      },
      {
        opacity: 1,
        transform: 'scale(1)'
      }
    ], {
      duration,
      easing: this.config.defaultEasing,
      fill: 'forwards'
    });

    this.trackAnimation(animation);
    return animation.finished;
  }

  /**
   * Bounce animation for buttons
   */
  bounce(element, intensity = 0.1) {
    if (this.config.reducedMotion) {
      return Promise.resolve();
    }

    const animation = element.animate([
      { transform: 'scale(1)' },
      { transform: `scale(${1 + intensity})` },
      { transform: 'scale(1)' }
    ], {
      duration: 200,
      easing: 'ease-out'
    });

    this.trackAnimation(animation);
    return animation.finished;
  }

  /**
   * Shake animation for error states
   */
  shake(element) {
    if (this.config.reducedMotion) {
      return Promise.resolve();
    }

    const animation = element.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' }
    ], {
      duration: 400,
      easing: 'ease-out'
    });

    this.trackAnimation(animation);
    return animation.finished;
  }

  /**
   * Pulse animation for loading states
   */
  pulse(element) {
    if (this.config.reducedMotion) {
      return Promise.resolve();
    }

    const animation = element.animate([
      { opacity: 1 },
      { opacity: 0.5 },
      { opacity: 1 }
    ], {
      duration: 1000,
      easing: 'ease-in-out',
      iterations: Infinity
    });

    this.trackAnimation(animation);
    return animation;
  }

  /**
   * Staggered animation for multiple elements
   */
  staggeredAnimation(elements, animationFn, delay = 100) {
    const animations = [];
    
    elements.forEach((element, index) => {
      setTimeout(() => {
        const animation = animationFn(element);
        animations.push(animation);
      }, index * delay);
    });

    return Promise.all(animations);
  }

  /**
   * Parallax effect for elements
   */
  setupParallax(element, speed = 0.5) {
    if (this.config.reducedMotion) return;

    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rect = element.getBoundingClientRect();
      const yPos = -(scrolled * speed);
      
      element.style.transform = `translateY(${yPos}px)`;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  /**
   * Track active animations
   */
  trackAnimation(animation) {
    this.activeAnimations.add(animation);
    
    animation.finished.then(() => {
      this.activeAnimations.delete(animation);
    }).catch(() => {
      this.activeAnimations.delete(animation);
    });
  }

  /**
   * Disable all animations (for reduced motion)
   */
  disableAllAnimations() {
    this.activeAnimations.forEach(animation => {
      animation.cancel();
    });
    this.activeAnimations.clear();
    
    // Add CSS to disable animations
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
    
    this.log('All animations disabled for reduced motion preference');
  }

  /**
   * Create entrance animation sequence
   */
  createEntranceSequence(elements) {
    if (this.config.reducedMotion) {
      elements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
      });
      return Promise.resolve();
    }

    const sequence = elements.map((element, index) => {
      return new Promise(resolve => {
        setTimeout(() => {
          this.fadeIn(element).then(resolve);
        }, index * 100);
      });
    });

    return Promise.all(sequence);
  }

  /**
   * Create morphing transition between elements
   */
  morphTransition(fromElement, toElement, duration = 500) {
    if (this.config.reducedMotion) {
      fromElement.style.display = 'none';
      toElement.style.display = 'block';
      return Promise.resolve();
    }

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    // Calculate transform values
    const scaleX = fromRect.width / toRect.width;
    const scaleY = fromRect.height / toRect.height;
    const translateX = fromRect.left - toRect.left;
    const translateY = fromRect.top - toRect.top;

    // Prepare target element
    toElement.style.transformOrigin = 'top left';
    toElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
    toElement.style.opacity = '0';
    toElement.style.display = 'block';

    // Animate
    const animation = toElement.animate([
      {
        transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
        opacity: 0
      },
      {
        transform: 'translate(0, 0) scale(1, 1)',
        opacity: 1
      }
    ], {
      duration,
      easing: this.config.defaultEasing,
      fill: 'forwards'
    });

    // Hide original element
    fromElement.style.display = 'none';

    this.trackAnimation(animation);
    return animation.finished;
  }

  /**
   * Utility: Check if element is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Logging utilities
   */
  log(...args) {
    if (window.app && window.app.debug) {
      console.log('[AnimationManager]', ...args);
    }
  }

  warn(...args) {
    if (window.app && window.app.debug) {
      console.warn('[AnimationManager]', ...args);
    }
  }

  error(...args) {
    console.error('[AnimationManager]', ...args);
  }
}

// Create global instance
window.animationManager = new AnimationManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationManager;
}