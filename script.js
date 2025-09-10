// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Active navigation highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// CTA Button functionality
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('click', () => {
    const journeySection = document.querySelector('#journey');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = journeySection.offsetTop - navbarHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
});

// Simplified scroll animations - removed heavy intersection observers for better performance

// Statistics Counter Animation
const stats = document.querySelectorAll('.stat-card h3');
const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target') || stat.innerText.replace(/,/g, ''));
        stat.setAttribute('data-target', target);
        
        const increment = target / 200;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number based on original content
            if (target >= 1000) {
                stat.innerText = Math.floor(current).toLocaleString();
            } else if (stat.innerText.includes('.')) {
                stat.innerText = current.toFixed(1);
            } else {
                stat.innerText = Math.floor(current);
            }
        }, 10);
    });
};

// Trigger stats animation when home section is visible
const homeSection = document.querySelector('#home');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statsObserver.observe(homeSection);

// Media card click handlers
document.querySelectorAll('.media-card').forEach(card => {
    card.addEventListener('click', () => {
        // Simulate opening media in lightbox or modal
        const title = card.querySelector('h3').innerText;
        console.log(`Opening media: ${title}`);
        // You can add actual lightbox functionality here
    });
});

// News card link tracking
document.querySelectorAll('.news-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const newsTitle = link.parentElement.querySelector('h3').innerText;
        console.log(`Reading article: ${newsTitle}`);
        
        // Check if link has a valid href, if not prevent default
        if (!link.href || link.href === '#' || link.href === window.location.href + '#') {
            e.preventDefault();
            console.log('No valid link provided for:', newsTitle);
        }
        // If valid href exists, let the link work normally (opens in new tab if target="_blank")
    });
});

// Smooth parallax effect for hero section with requestAnimationFrame
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground && scrolled < window.innerHeight) {
        const rate = scrolled * -0.3;
        heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Enhanced image loading with optimization
class ImageLoader {
    constructor() {
        this.loadedImages = new Set();
        this.init();
    }
    
    init() {
        // Preload critical images
        this.preloadCriticalImages();
        
        // Enhance lazy loading for better performance
        this.enhanceLazyLoading();
        
        // Add loading indicators
        this.addLoadingIndicators();
    }
    
    preloadCriticalImages() {
        const criticalImages = [
            'data/banner.jpg',
            'data/Prathamesh Jawkar\'s archery journey A chance start, a filmy trigger and golden finish at Asian Games.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => this.loadedImages.add(src);
        });
    }
    
    enhanceLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => this.loadImage(img));
        }
    }
    
    loadImage(img) {
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = tempImg.src;
            img.classList.add('loaded');
            this.loadedImages.add(img.src);
        };
        tempImg.src = img.dataset.src || img.src;
    }
    
    addLoadingIndicators() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
                img.style.filter = 'blur(0px)';
            });
            
            img.addEventListener('error', () => {
                img.style.opacity = '0.5';
                console.warn('Failed to load image:', img.src);
            });
        });
    }
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transform = 'translateY(0)';
    
    // Initialize image loader
    new ImageLoader();
});

// Initialize page with loading state
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    document.body.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Social media links functionality with analytics tracking
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Don't prevent default - let the links work normally
        const platform = link.querySelector('i').classList[1].split('-')[1];
        const url = link.href;
        
        // Optional: Track social media clicks for analytics
        console.log(`Opening ${platform} profile:`, url);
        
        // You can add analytics tracking here if needed
        // Example: gtag('event', 'social_click', { platform: platform });
    });
});

// Form submission handler (if you add contact forms later)
const handleFormSubmission = (formData) => {
    console.log('Form submitted:', formData);
    // Add form handling logic here
};

// Add intersection observer for fade-in animations
const fadeElements = document.querySelectorAll('.stat-card, .section-title');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Touch gesture support for mobile
let startY = 0;
let endY = 0;

document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    endY = e.changedTouches[0].clientY;
    handleSwipe();
});

const handleSwipe = () => {
    const swipeThreshold = 50;
    const difference = startY - endY;
    
    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            // Swipe up - could trigger scroll to next section
            console.log('Swipe up detected');
        } else {
            // Swipe down - could trigger scroll to previous section
            console.log('Swipe down detected');
        }
    }
};

// Performance optimization: Throttle scroll events
const throttle = (func, limit) => {
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
};

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    }
    
    // Parallax effect
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    const rate = scrolled * -0.3;
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
}, 16);

// Replace scroll event listener with throttled version
window.addEventListener('scroll', throttledScrollHandler);

console.log('Sports Portfolio Website Loaded Successfully!');
