/**
 * SCROLL-DRIVEN ANIMATIONS SYSTEM
 * Advanced intersection observer and scroll progress animations
 */

class ScrollAnimationSystem {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      staggerDelay: 100,
      parallaxSpeed: 0.5,
      enableParallax: true,
      enableProgress: true,
      enableStagger: true,
      mobileOptimized: true,
      ...options
    };
    
    this.observers = new Map();
    this.parallaxElements = new Map();
    this.progressElements = new Map();
    this.isMobile = window.innerWidth <= 768;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
  }

  init() {
    if (this.reducedMotion) {
      this.disableAnimations();
      return;
    }

    this.setupIntersectionObserver();
    this.setupParallaxScrolling();
    this.setupScrollProgress();
    this.setupResizeHandler();
    this.setupPerformanceOptimizations();
  }

  /**
   * Setup intersection observer for scroll-triggered animations
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: this.options.threshold,
      rootMargin: this.options.rootMargin
    };

    // Main animation observer
    this.mainObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);

    // Stagger animation observer
    if (this.options.enableStagger) {
      this.staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStaggerContainer(entry.target);
          }
        });
      }, observerOptions);
    }

    // Initialize observers for existing elements
    this.observeElements();
  }

  /**
   * Observe elements for animations
   */
  observeElements() {
    // Observe individual animation elements
    const animationElements = document.querySelectorAll(`
      .scroll-reveal,
      .scroll-reveal-left,
      .scroll-reveal-right,
      .scroll-reveal-scale,
      .scroll-reveal-rotate,
      .image-fade-scale,
      .image-slide-up,
      .image-rotate-in,
      .text-reveal,
      .text-slide-left,
      .text-slide-right,
      .morphing-shape,
      .glitch-effect
    `);
    
    animationElements.forEach(element => {
      this.mainObserver.observe(element);
    });

    // Observe stagger containers
    if (this.options.enableStagger) {
      const staggerContainers = document.querySelectorAll('.stagger-container');
      staggerContainers.forEach(container => {
        this.staggerObserver.observe(container);
      });
    }

    // Setup parallax elements
    if (this.options.enableParallax) {
      this.setupParallaxElements();
    }

    // Setup progress elements
    if (this.options.enableProgress) {
      this.setupProgressElements();
    }
  }

  /**
   * Animate individual element
   */
  animateElement(element) {
    if (element.classList.contains('animate-in')) return;
    
    element.classList.add('animate-in');
    
    // Add glitch effect if element has data-text
    if (element.classList.contains('glitch-effect') && element.textContent) {
      element.setAttribute('data-text', element.textContent);
    }

    // Remove from observer after animation
    this.mainObserver.unobserve(element);
  }

  /**
   * Animate stagger container
   */
  animateStaggerContainer(container) {
    if (container.classList.contains('animate-in')) return;
    
    container.classList.add('animate-in');
    this.staggerObserver.unobserve(container);
  }

  /**
   * Setup parallax scrolling
   */
  setupParallaxScrolling() {
    if (!this.options.enableParallax || this.isMobile) return;

    let ticking = false;
    
    const updateParallax = () => {
      const scrollY = window.pageYOffset;
      
      this.parallaxElements.forEach((element, speed) => {
        const yPos = -(scrollY * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  /**
   * Setup parallax elements
   */
  setupParallaxElements() {
    const parallaxElements = document.querySelectorAll(`
      .parallax-slow,
      .parallax-medium,
      .parallax-fast
    `);

    parallaxElements.forEach(element => {
      let speed = 0.3; // Default speed
      
      if (element.classList.contains('parallax-slow')) {
        speed = 0.2;
      } else if (element.classList.contains('parallax-medium')) {
        speed = 0.4;
      } else if (element.classList.contains('parallax-fast')) {
        speed = 0.6;
      }

      this.parallaxElements.set(element, speed);
    });
  }

  /**
   * Setup scroll progress animations
   */
  setupScrollProgress() {
    if (!this.options.enableProgress) return;

    let ticking = false;
    
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(scrollTop / docHeight, 1);

      this.progressElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate element progress (0 to 1)
        const elementStart = elementTop - viewportHeight;
        const elementEnd = elementTop + elementHeight;
        const elementProgress = Math.max(0, Math.min(1, 
          (scrollTop - elementStart) / (elementEnd - elementStart)
        ));

        element.style.setProperty('--scroll-progress', elementProgress);
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    });
  }

  /**
   * Setup progress elements
   */
  setupProgressElements() {
    const progressElements = document.querySelectorAll(`
      .progress-scale,
      .progress-rotate,
      .progress-opacity,
      .progress-translate-x,
      .progress-translate-y,
      .scroll-progress-element
    `);

    progressElements.forEach(element => {
      this.progressElements.set(element, true);
    });
  }

  /**
   * Setup resize handler for mobile detection
   */
  setupResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // Reinitialize if mobile state changed
        if (wasMobile !== this.isMobile) {
          this.reinitialize();
        }
      }, 250);
    });
  }

  /**
   * Reinitialize system when mobile state changes
   */
  reinitialize() {
    // Clear existing observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.parallaxElements.clear();
    this.progressElements.clear();

    // Reinitialize
    this.init();
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Throttle scroll events
    let scrollTimeout;
    
    const throttledScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          this.updateScrollAnimations();
          scrollTimeout = null;
        }, 16); // ~60fps
      }
    };

    window.addEventListener('scroll', throttledScroll);

    // Preload critical animations
    this.preloadAnimations();
  }

  /**
   * Update scroll-based animations
   */
  updateScrollAnimations() {
    // This method can be extended for custom scroll-based animations
    // Currently handled by the individual animation methods
  }

  /**
   * Preload animations for better performance
   */
  preloadAnimations() {
    // Force GPU acceleration for animated elements
    const animatedElements = document.querySelectorAll(`
      .scroll-reveal,
      .scroll-reveal-left,
      .scroll-reveal-right,
      .scroll-reveal-scale,
      .scroll-reveal-rotate,
      .parallax-slow,
      .parallax-medium,
      .parallax-fast
    `);

    animatedElements.forEach(element => {
      element.classList.add('gpu-accelerated');
    });
  }

  /**
   * Disable animations for reduced motion preference
   */
  disableAnimations() {
    const animatedElements = document.querySelectorAll(`
      .scroll-reveal,
      .scroll-reveal-left,
      .scroll-reveal-right,
      .scroll-reveal-scale,
      .scroll-reveal-rotate,
      .image-fade-scale,
      .image-slide-up,
      .image-rotate-in,
      .text-reveal,
      .text-slide-left,
      .text-slide-right
    `);

    animatedElements.forEach(element => {
      element.classList.add('no-animation');
      element.classList.add('animate-in');
    });
  }

  /**
   * Add new element to animation system
   */
  addElement(element, options = {}) {
    if (this.reducedMotion) return;

    const animationType = options.type || 'reveal';
    
    switch (animationType) {
      case 'reveal':
        element.classList.add('scroll-reveal');
        this.mainObserver.observe(element);
        break;
      case 'reveal-left':
        element.classList.add('scroll-reveal-left');
        this.mainObserver.observe(element);
        break;
      case 'reveal-right':
        element.classList.add('scroll-reveal-right');
        this.mainObserver.observe(element);
        break;
      case 'scale':
        element.classList.add('scroll-reveal-scale');
        this.mainObserver.observe(element);
        break;
      case 'rotate':
        element.classList.add('scroll-reveal-rotate');
        this.mainObserver.observe(element);
        break;
      case 'parallax':
        element.classList.add(`parallax-${options.speed || 'medium'}`);
        this.setupParallaxElements();
        break;
      case 'progress':
        element.classList.add('scroll-progress-element');
        this.progressElements.set(element, true);
        break;
      case 'stagger':
        element.classList.add('stagger-container');
        this.staggerObserver.observe(element);
        break;
    }
  }

  /**
   * Remove element from animation system
   */
  removeElement(element) {
    this.mainObserver.unobserve(element);
    this.staggerObserver?.unobserve(element);
    this.parallaxElements.delete(element);
    this.progressElements.delete(element);
  }

  /**
   * Destroy animation system
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.parallaxElements.clear();
    this.progressElements.clear();
  }
}

/**
 * UTILITY FUNCTIONS
 */

// Smooth scroll to element with easing
function smoothScrollTo(element, duration = 1000, offset = 0) {
  const targetPosition = element.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

// Easing function
function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t + b;
  t -= 2;
  return c / 2 * (t * t * t + 2) + b;
}

// Scroll progress indicator
class ScrollProgressIndicator {
  constructor(options = {}) {
    this.options = {
      height: '3px',
      color: 'linear-gradient(90deg, #667eea, #764ba2)',
      position: 'top',
      zIndex: 9999,
      ...options
    };
    
    this.createIndicator();
    this.setupScrollListener();
  }

  createIndicator() {
    this.indicator = document.createElement('div');
    this.indicator.style.cssText = `
      position: fixed;
      ${this.options.position}: 0;
      left: 0;
      width: 0%;
      height: ${this.options.height};
      background: ${this.options.color};
      z-index: ${this.options.zIndex};
      transition: width 0.1s ease;
    `;
    
    document.body.appendChild(this.indicator);
  }

  setupScrollListener() {
    let ticking = false;
    
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      this.indicator.style.width = scrollPercent + '%';
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    });
  }

  destroy() {
    this.indicator?.remove();
  }
}

// Initialize animation system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main animation system
  window.scrollAnimations = new ScrollAnimationSystem({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    staggerDelay: 100,
    parallaxSpeed: 0.5,
    enableParallax: !window.matchMedia('(max-width: 768px)').matches,
    enableProgress: true,
    enableStagger: true,
    mobileOptimized: true
  });

  // Initialize scroll progress indicator
  window.scrollProgress = new ScrollProgressIndicator({
    height: '3px',
    color: 'linear-gradient(90deg, #667eea, #764ba2)',
    position: 'top',
    zIndex: 9999
  });

  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        smoothScrollTo(target, 1000, 80);
      }
    });
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ScrollAnimationSystem, ScrollProgressIndicator, smoothScrollTo };
}
