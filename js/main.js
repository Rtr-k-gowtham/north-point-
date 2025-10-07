// ===== MAIN JAVASCRIPT FILE =====
// Minimal JavaScript for mobile navigation, form handling, and smooth interactions

(function() {
    'use strict';

    // ===== HERO SLIDER FUNCTIONALITY =====
    const slider = {
        currentSlide: 0,
        slides: document.querySelectorAll('.slide'),
        indicators: document.querySelectorAll('.slider-indicator'),
        prevBtn: document.querySelector('.slider-nav__btn--prev'),
        nextBtn: document.querySelector('.slider-nav__btn--next'),
        autoPlayInterval: null,
        autoPlayDelay: 5000,

        init() {
            if (this.slides.length === 0) return;
            
            this.bindEvents();
            this.startAutoPlay();
            this.updateSlider();
        },

        bindEvents() {
            // Navigation buttons
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }

            // Indicators
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            });

            // Pause on hover
            const sliderContainer = document.querySelector('.slider-container');
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
                sliderContainer.addEventListener('mouseleave', () => this.startAutoPlay());
            }

            // Touch/swipe support
            this.addTouchSupport();
        },

        addTouchSupport() {
            let startX = 0;
            let endX = 0;
            const sliderWrapper = document.querySelector('.slider-wrapper');
            
            if (!sliderWrapper) return;

            sliderWrapper.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            sliderWrapper.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe();
            });
        },

        handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        },

        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            this.updateSlider();
            this.resetAutoPlay();
        },

        prevSlide() {
            this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
            this.updateSlider();
            this.resetAutoPlay();
        },

        goToSlide(index) {
            this.currentSlide = index;
            this.updateSlider();
            this.resetAutoPlay();
        },

        updateSlider() {
            // Update slides
            this.slides.forEach((slide, index) => {
                slide.classList.remove('slide--active', 'slide--prev');
                
                if (index === this.currentSlide) {
                    slide.classList.add('slide--active');
                } else if (index < this.currentSlide) {
                    slide.classList.add('slide--prev');
                }
            });

            // Update indicators
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('slider-indicator--active', index === this.currentSlide);
            });

            // Update ARIA attributes
            this.slides.forEach((slide, index) => {
                slide.setAttribute('aria-hidden', index !== this.currentSlide);
            });
        },

        startAutoPlay() {
            this.stopAutoPlay();
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        },

        stopAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        },

        resetAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    };

    // ===== MOBILE NAVIGATION =====
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            const isOpen = navMenu.classList.contains('show');
            navToggle.setAttribute('aria-expanded', isOpen);
            navMenu.setAttribute('aria-hidden', !isOpen);
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        }
    });

    // ===== SMOOTH SCROLLING FOR INTERNAL LINKS =====
    // Enhanced smooth scrolling with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerHeight - 20; // Extra 20px padding
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            
            // Clear previous errors
            clearFormErrors();
            
            // Validate form
            let isValid = true;
            
            // Name validation
            if (!nameInput.value.trim()) {
                showFieldError('name', 'Please enter your full name');
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showFieldError('name', 'Name must be at least 2 characters long');
                isValid = false;
            }
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showFieldError('email', 'Please enter your email address');
                isValid = false;
            } else if (!emailPattern.test(emailInput.value.trim())) {
                showFieldError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Phone validation
            const phonePattern = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneInput.value.trim()) {
                showFieldError('phone', 'Please enter your phone number');
                isValid = false;
            } else if (!phonePattern.test(phoneInput.value.trim())) {
                showFieldError('phone', 'Please enter a valid phone number');
                isValid = false;
            }
            
            // If form is valid, show success message
            if (isValid) {
                // Simulate form submission delay
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    // Show success message
                    formSuccess.classList.add('show');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formSuccess.classList.remove('show');
                    }, 5000);
                    
                    // Scroll to success message
                    formSuccess.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 1000);
            } else {
                // Focus on first field with error
                const firstError = contactForm.querySelector('.form__error:not(:empty)');
                if (firstError) {
                    const fieldId = firstError.id.replace('-error', '');
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.focus();
                    }
                }
            }
        });
    }

    // ===== FORM VALIDATION HELPERS =====
    function showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + '-error');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.setAttribute('aria-live', 'polite');
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
            inputElement.setAttribute('aria-invalid', 'true');
            inputElement.setAttribute('aria-describedby', fieldId + '-error');
        }
    }

    function clearFormErrors() {
        const errorElements = document.querySelectorAll('.form__error');
        const inputElements = document.querySelectorAll('.form__input, .form__select, .form__textarea');
        
        errorElements.forEach(error => {
            error.textContent = '';
            error.removeAttribute('aria-live');
        });
        
        inputElements.forEach(input => {
            input.classList.remove('error');
            input.setAttribute('aria-invalid', 'false');
            input.removeAttribute('aria-describedby');
        });
    }

    // ===== HEADER SCROLL EFFECT =====
    // Add subtle effect on header when scrolling
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
                header.style.backgroundColor = '#ffffff';
                header.style.backdropFilter = 'none';
            }
        }
        
        lastScrollY = currentScrollY;
    }

    // Throttled scroll event listener for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(handleScroll);
    });

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    // Add subtle animations when elements come into view
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate in
        const animateElements = document.querySelectorAll(
            '.service-card, .pillar, .process__step, .testimonial'
        );

        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    // ===== KEYBOARD NAVIGATION IMPROVEMENTS =====
    // Improve keyboard navigation for better accessibility
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            navToggle.focus();
        }
        
        // Enter key on nav toggle
        if (e.key === 'Enter' && e.target === navToggle) {
            navToggle.click();
        }
    });

    // ===== SIMPLE TESTIMONIALS AUTO-ROTATION (OPTIONAL) =====
    // Simple auto-rotation for testimonials on larger screens
    function initTestimonialRotation() {
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length > 1 && window.innerWidth >= 768) {
            let currentIndex = 0;
            
            // Don't auto-rotate on mobile or if user prefers reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
            
            setInterval(() => {
                testimonials.forEach((testimonial, index) => {
                    testimonial.style.opacity = index === currentIndex ? '1' : '0.7';
                    testimonial.style.transform = index === currentIndex ? 'scale(1.02)' : 'scale(1)';
                });
                
                currentIndex = (currentIndex + 1) % testimonials.length;
            }, 4000); // Rotate every 4 seconds
        }
    }

    // ===== LOADING OPTIMIZATION =====
    // Optimize loading of non-critical elements
    function optimizeLoading() {
        // Lazy load images that are not immediately visible
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.loading = 'lazy';
                img.src = img.dataset.src;
            });
        }
        
        // Add loading states for better UX
        const form = document.getElementById('contact-form');
        if (form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    this.classList.toggle('filled', this.value.trim() !== '');
                });
            });
        }
    }

    // ===== INITIALIZATION =====
    // Initialize all functionality when DOM is ready
    function init() {
        // Initialize hero slider
        slider.init();
        
        // Set initial ARIA attributes
        if (navToggle && navMenu) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        }
        
        // Initialize testimonial rotation
        initTestimonialRotation();
        
        // Optimize loading
        optimizeLoading();
        
        // Initial scroll handler call
        handleScroll();
        
        console.log('Northpoint Karur website initialized successfully');
    }

    // ===== EVENT LISTENERS =====
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle window resize for responsive behavior
    window.addEventListener('resize', function() {
        // Close mobile menu on resize to larger screen
        if (window.innerWidth >= 768 && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        }
    });

})();



const slides = document.querySelector('.slides');
  const images = document.querySelectorAll('.slides img');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  let index = 0;

  function showSlide(i) {
    if (i >= images.length) index = 0;
    if (i < 0) index = images.length - 1;
    slides.style.transform = `translateX(${-index * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    index++;
    showSlide(index);
  });

  prevBtn.addEventListener('click', () => {
    index--;
    showSlide(index);
  });

  // Auto-slide every 3s
  setInterval(() => {
    index++;
    showSlide(index);
  }, 3000);



   // Toggle mobile menu
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    navToggle.classList.toggle('active');
  });

  // Dropdown toggle on mobile only
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown-toggle');

    toggle.addEventListener('click', (e) => {
      // Only enable click toggle in mobile view
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  });

  // Optional: Close dropdowns when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      dropdowns.forEach((d) => d.classList.remove('active'));
    }
  });