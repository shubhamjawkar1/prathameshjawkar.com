// Optimized Script - Critical functionality first, lazy load the rest
(function() {
    'use strict';

    // Performance monitoring
    const perf = {
        start: performance.now(),
        mark: (name) => performance.mark(name),
        measure: (name, start) => performance.measure(name, start)
    };

    // Critical DOM elements cache
    const DOM = {
        hamburger: null,
        navMenu: null,
        navbar: null,
        heroBackground: null,
        init() {
            this.hamburger = document.getElementById('hamburger');
            this.navMenu = document.getElementById('nav-menu');
            this.navbar = document.querySelector('.navbar');
            this.heroBackground = document.querySelector('.hero-background');
        }
    };

    // Essential functions only - loaded immediately
    const Core = {
        // Mobile navigation - critical for UX
        initNavigation() {
            if (!DOM.hamburger || !DOM.navMenu) return;

            DOM.hamburger.addEventListener('click', () => {
                DOM.hamburger.classList.toggle('active');
                DOM.navMenu.classList.toggle('active');
            });

            // Close on link click
            document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
                link.addEventListener('click', () => {
                    DOM.hamburger.classList.remove('active');
                    DOM.navMenu.classList.remove('active');
                });
            });

            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    DOM.hamburger.classList.remove('active');
                    DOM.navMenu.classList.remove('active');
                }
            });
        },

        // Smooth scrolling - critical for navigation
        initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const navbarHeight = DOM.navbar?.offsetHeight || 70;
                        const targetPosition = targetSection.offsetTop - navbarHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        // Critical CSS loading optimization
        loadCriticalStyles() {
            const criticalCSS = document.querySelector('link[href="critical.css"]');
            if (criticalCSS) {
                criticalCSS.onload = () => {
                    // Load non-critical CSS after critical CSS
                    this.loadNonCriticalStyles();
                };
            } else {
                this.loadNonCriticalStyles();
            }
        },

        loadNonCriticalStyles() {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'styles.css';
            link.media = 'all';
            document.head.appendChild(link);
        },

        // Initialize core functionality
        init() {
            perf.mark('core-start');
            DOM.init();
            this.initNavigation();
            this.initSmoothScroll();
            this.loadCriticalStyles();
            perf.mark('core-end');
            perf.measure('core-init', 'core-start', 'core-end');

            // Load enhanced features after core is ready
            this.loadEnhancedFeatures();
        },

        // Lazy load non-critical features
        loadEnhancedFeatures() {
            // Use requestIdleCallback for non-critical features
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => this.initEnhancedFeatures());
            } else {
                setTimeout(() => this.initEnhancedFeatures(), 100);
            }
        },

        initEnhancedFeatures() {
            // Parallax effect
            this.initParallax();
            
            // Scroll optimizations
            this.initScrollOptimizations();
            
            // Image optimizations
            this.initImageOptimizations();
            
            // Load matches functionality if needed
            if (document.getElementById('matches-grid')) {
                this.loadMatchesModule();
            }
        },

        // Optimized parallax with RAF
        initParallax() {
            if (!DOM.heroBackground) return;
            
            let ticking = false;
            
            const updateParallax = () => {
                const scrolled = window.pageYOffset;
                if (scrolled < window.innerHeight) {
                    const rate = scrolled * -0.2; // Reduced for better performance
                    DOM.heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
                }
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            }, { passive: true });
        },

        // Throttled scroll optimizations
        initScrollOptimizations() {
            let scrollTimer = null;
            
            const handleScroll = () => {
                // Navbar background change
                if (DOM.navbar) {
                    const opacity = window.scrollY > 100 ? 0.98 : 0.95;
                    DOM.navbar.style.background = `rgba(0, 0, 0, ${opacity})`;
                }
            };

            window.addEventListener('scroll', () => {
                if (scrollTimer) return;
                scrollTimer = setTimeout(() => {
                    handleScroll();
                    scrollTimer = null;
                }, 16); // ~60fps
            }, { passive: true });
        },

        // Optimized image loading
        initImageOptimizations() {
            // Enhanced lazy loading with intersection observer
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            this.loadImage(img);
                            imageObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                });

                document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                    imageObserver.observe(img);
                });
            }

            // Add loading states
            document.querySelectorAll('img').forEach(img => {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    img.style.opacity = '1';
                });
                
                img.addEventListener('error', () => {
                    img.style.opacity = '0.5';
                    // Fallback image
                    if (img.src !== 'data/banner.jpg') {
                        img.src = 'data/banner.jpg';
                    }
                });
            });
        },

        loadImage(img) {
            const src = img.dataset.src || img.src;
            if (src) {
                img.src = src;
                img.classList.add('loading');
            }
        },

        // Load matches module dynamically
        async loadMatchesModule() {
            try {
                // Dynamic import for matches functionality
                const matchesResponse = await fetch('data/matches.json');
                const matchesData = await matchesResponse.json();
                
                // Initialize matches with loaded data
                this.initMatches(matchesData);
            } catch (error) {
                console.warn('Failed to load matches:', error);
            }
        },

        // Simplified matches initialization
        initMatches(matchesData) {
            const matchesGrid = document.getElementById('matches-grid');
            const filterButtons = document.querySelectorAll('.filter-btn');
            let currentFilter = 'all';

            const renderMatches = (filter = 'all') => {
                const filtered = filter === 'all' 
                    ? matchesData 
                    : matchesData.filter(match => match.category === filter);

                matchesGrid.innerHTML = filtered.map(match => 
                    this.createMatchCard(match)
                ).join('');

                // Add event listeners to new cards
                this.addMatchEventListeners();
            };

            const createMatchCard = (match) => {
                const thumbnail = this.getYouTubeThumbnail(match.link);
                return `
                    <div class="match-card show" data-category="${match.category}">
                        <div class="match-video">
                            <img src="${thumbnail}" 
                                 alt="${match.headline}" 
                                 class="match-thumbnail"
                                 loading="lazy"
                                 onerror="this.src='data/banner.jpg'">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="match-content">
                            <div class="match-meta">
                                <span class="match-category">${match.category}</span>
                                <span class="match-year">${match.year}</span>
                            </div>
                            <h3 class="match-title">${match.headline}</h3>
                            <p class="match-description">${match.description}</p>
                            <a href="${match.link}" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               class="watch-button">
                                <i class="fas fa-play"></i>
                                Watch Match
                            </a>
                        </div>
                    </div>
                `;
            };

            // Filter functionality
            filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const filter = e.target.getAttribute('data-filter');
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    renderMatches(filter);
                });
            });

            // Initial render
            renderMatches();
        },

        createMatchCard(match) {
            const thumbnail = this.getYouTubeThumbnail(match.link);
            return `
                <div class="match-card show" data-category="${match.category}">
                    <div class="match-video">
                        <img src="${thumbnail}" 
                             alt="${match.headline}" 
                             class="match-thumbnail"
                             loading="lazy"
                             onerror="this.src='data/banner.jpg'">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="match-content">
                        <div class="match-meta">
                            <span class="match-category">${match.category}</span>
                            <span class="match-year">${match.year}</span>
                        </div>
                        <h3 class="match-title">${match.headline}</h3>
                        <p class="match-description">${match.description}</p>
                        <a href="${match.link}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="watch-button">
                            <i class="fas fa-play"></i>
                            Watch Match
                        </a>
                    </div>
                </div>
            `;
        },

        addMatchEventListeners() {
            document.querySelectorAll('.match-card').forEach(card => {
                const watchButton = card.querySelector('.watch-button');
                const playButton = card.querySelector('.play-button');
                const matchLink = watchButton.getAttribute('href');
                
                if (playButton) {
                    playButton.addEventListener('click', () => {
                        window.open(matchLink, '_blank', 'noopener,noreferrer');
                    });
                }
                
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.watch-button') && !e.target.closest('.play-button')) {
                        window.open(matchLink, '_blank', 'noopener,noreferrer');
                    }
                });
            });
        },

        getYouTubeThumbnail(videoUrl) {
            if (videoUrl.includes('youtube.com/watch?v=')) {
                const videoId = videoUrl.split('v=')[1].split('&')[0];
                return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            } else if (videoUrl.includes('youtu.be/')) {
                const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
                return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            } else if (videoUrl.includes('youtube.com/shorts/')) {
                const videoId = videoUrl.split('shorts/')[1];
                return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
            return 'data/banner.jpg';
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Core.init());
    } else {
        Core.init();
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }

    // Performance monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.now() - perf.start;
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Report Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with Web Vitals library if added
        }
    });

})();
