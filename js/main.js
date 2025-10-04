// Main JavaScript for Aluresoft Landing Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Material Design Components
    initializeMaterialComponents();
    
    // Set dynamic copyright year
    setDynamicCopyright();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize navbar scroll effect
    initializeNavbarScrollEffect();
});

// Initialize all Material Design components
function initializeMaterialComponents() {
    // Initialize side navigation
    const sideNavElems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sideNavElems, {
        edge: 'left',
        draggable: true
    });
    
    // Initialize dropdowns
    const dropdownElems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdownElems, {
        alignment: 'left',
        hover: true,
        coverTrigger: false,
        constrainWidth: false
    });
    
    // Initialize fixed action button
    const fabElems = document.querySelectorAll('.fixed-action-btn');
    M.FloatingActionButton.init(fabElems, {
        direction: 'top',
        hoverEnabled: false
    });
    
    // Initialize materialboxed images
    const materialboxElems = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(materialboxElems);
    
    // Initialize tooltips
    const tooltipElems = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(tooltipElems);
    
    // Initialize modals
    const modalElems = document.querySelectorAll('.modal');
    M.Modal.init(modalElems);
    
    // Initialize collapsibles
    const collapsibleElems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsibleElems);
}

// Set dynamic copyright year
function setDynamicCopyright() {
    const currentYear = new Date().getFullYear();
    const copyrightText = document.getElementById('copyright-text');
    
    if (copyrightText) {
        copyrightText.innerHTML = `© ${currentYear} Aluresoft. All rights reserved.`;
    }
    
    // Update copyright every year automatically
    const nextYear = new Date(currentYear + 1, 0, 1);
    const timeUntilNextYear = nextYear.getTime() - new Date().getTime();
    
    setTimeout(() => {
        setDynamicCopyright();
        // Set up yearly interval
        setInterval(setDynamicCopyright, 365 * 24 * 60 * 60 * 1000);
    }, timeUntilNextYear);
}

// Initialize smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Close mobile navigation if open
                const sidenavInstance = M.Sidenav.getInstance(document.querySelector('.sidenav'));
                if (sidenavInstance && sidenavInstance.isOpen) {
                    sidenavInstance.close();
                }
                
                // Calculate offset for fixed navbar
                const navHeight = document.querySelector('.navbar-fixed nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe other animated elements
    const animatedElements = document.querySelectorAll('.section-title, .section-description, .about-image');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('first_name').value,
                lastName: document.getElementById('last_name').value,
                email: document.getElementById('email').value,
                company: document.getElementById('company').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (validateContactForm(formData)) {
                submitContactForm(formData);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

// Validate contact form
function validateContactForm(data) {
    let isValid = true;
    const errors = [];
    
    // Required fields validation
    if (!data.firstName.trim()) {
        errors.push('First name is required');
        highlightField('first_name', false);
        isValid = false;
    } else {
        highlightField('first_name', true);
    }
    
    if (!data.lastName.trim()) {
        errors.push('Last name is required');
        highlightField('last_name', false);
        isValid = false;
    } else {
        highlightField('last_name', true);
    }
    
    if (!data.email.trim()) {
        errors.push('Email is required');
        highlightField('email', false);
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
        highlightField('email', false);
        isValid = false;
    } else {
        highlightField('email', true);
    }
    
    if (!data.message.trim()) {
        errors.push('Message is required');
        highlightField('message', false);
        isValid = false;
    } else {
        highlightField('message', true);
    }
    
    if (!isValid) {
        showNotification('Please fix the following errors: ' + errors.join(', '), 'error');
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    switch (field.id) {
        case 'email':
            isValid = value && isValidEmail(value);
            break;
        case 'first_name':
        case 'last_name':
        case 'message':
            isValid = value.length > 0;
            break;
        default:
            isValid = true;
    }
    
    highlightField(field.id, isValid);
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Highlight form field
function highlightField(fieldId, isValid) {
    const field = document.getElementById(fieldId);
    if (field) {
        const label = field.nextElementSibling;
        
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            if (label) label.classList.remove('invalid');
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            if (label) label.classList.add('invalid');
        }
    }
}

// Submit contact form
function submitContactForm(data) {
    const submitBtn = document.querySelector('.contact-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success simulation
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        document.querySelector('.contact-form').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Remove validation classes
        const fields = document.querySelectorAll('.contact-form input, .contact-form textarea');
        fields.forEach(field => {
            field.classList.remove('valid', 'invalid');
        });
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    const colors = {
        success: 'green',
        error: 'red',
        info: 'blue',
        warning: 'orange'
    };
    
    M.toast({
        html: message,
        classes: colors[type],
        displayLength: 4000,
        completeCallback: function() {
            // Callback after toast is dismissed
        }
    });
}

// Initialize navbar scroll effect
function initializeNavbarScrollEffect() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar-fixed nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Utility functions
const Utils = {
    // Debounce function
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Get current date formatted
    getCurrentDate: function() {
        return new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// Add CSS classes for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .service-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .service-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .navbar-fixed nav.scrolled {
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        background-color: rgba(242, 41, 82, 0.95);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);

// Performance monitoring
const performanceMonitor = {
    init: function() {
        if ('performance' in window) {
            window.addEventListener('load', this.logPageLoadTime);
        }
    },
    
    logPageLoadTime: function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // You can send this data to analytics
        if (loadTime > 3000) {
            console.warn('Page load time is slower than expected');
        }
    }
};

// Initialize performance monitoring
performanceMonitor.init();

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Utils,
        setDynamicCopyright,
        validateContactForm,
        isValidEmail
    };
}