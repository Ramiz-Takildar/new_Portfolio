// ============================================
// MOBILE-OPTIMIZED JAVASCRIPT
// Enhanced for better mobile performance and UX
// ============================================

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark-mode';
html.classList.add(savedTheme);

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    const isDarkMode = html.classList.contains('dark-mode');
    
    if (isDarkMode) {
        html.classList.remove('dark-mode');
        html.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    } else {
        html.classList.remove('light-mode');
        html.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    }
});

// ============================================
// IMPROVED MOBILE NAVIGATION
// ============================================

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navMenu) {
    // Toggle menu
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// OPTIMIZED PARTICLE ANIMATION
// Reduced particles on mobile for better performance
// ============================================

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const isMobile = window.innerWidth <= 768;
const particleCount = isMobile ? 25 : 50; // Reduced for mobile

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

let animationId;
let isTabActive = true;

function animateParticles() {
    if (!isTabActive) return; // Pause when tab is inactive
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    animationId = requestAnimationFrame(animateParticles);
}

animateParticles();

// Pause animation when tab is not visible (battery saving)
document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive) {
        animateParticles();
    } else {
        cancelAnimationFrame(animationId);
    }
});

// ============================================
// CURSOR ANIMATION (Desktop only)
// ============================================

if (!isMobile) {
    const cursor = document.querySelector('.cursor');
    
    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = e.x - 10 + 'px';
            cursor.style.top = e.y - 10 + 'px';
            cursor.classList.add('active');
        }
    });

    document.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.classList.remove('active');
        }
    });
}

// ============================================
// SMOOTH SCROLL WITH OFFSET FOR FIXED NAVBAR
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// NAVBAR ACTIVE STATE & SCROLL BEHAVIOR
// ============================================

const sections = document.querySelectorAll('section');
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    // Active section highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Hide/show navbar on scroll (mobile only)
    if (isMobile) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
});

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.expertise-card, .project-card, .stat-box, .skill-category, .tool-card, .about-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ============================================
// LAZY LOADING IMAGES
// ============================================

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Disable button and show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const formData = {
                name: this.querySelector('input[placeholder="Your Name"]').value,
                email: this.querySelector('input[placeholder="Your Email"]').value,
                subject: this.querySelector('input[placeholder="Subject"]').value,
                message: this.querySelector('textarea').value
            };

            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            this.reset();
            
        } catch (error) {
            showNotification('Error sending message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        left: 20px;
        max-width: 400px;
        margin: 0 auto;
        padding: 16px 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #43e97b, #38f9d7)' : 'linear-gradient(135deg, #f5576c, #f093fb)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInDown 0.3s ease;
        font-weight: 600;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-100%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-100%);
        }
    }
`;
document.head.appendChild(notificationStyles);

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, 250);
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('📊 Page load time:', pageLoadTime + 'ms');
            
            // Log to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    name: 'load',
                    value: pageLoadTime,
                    event_category: 'Performance'
                });
            }
        }, 0);
    });
}

// ============================================
// SERVICE WORKER REGISTRATION (PWA)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker registered'))
            .catch(err => console.log('❌ SW registration failed:', err));
    });
}

// ============================================
// TOUCH FEEDBACK FOR MOBILE
// ============================================

if (isMobile) {
    document.querySelectorAll('.btn, .tool-item, .project-card, .contact-card, .skill-tag').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        el.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// ============================================
// PREVENT ZOOM ON INPUT FOCUS (iOS)
// ============================================

if (isMobile) {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Ensure font-size is at least 16px to prevent zoom
        if (window.getComputedStyle(input).fontSize < '16px') {
            input.style.fontSize = '16px';
        }
    });
}

// ============================================
// ANALYTICS TRACKING (Optional)
// ============================================

function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track CTA clicks
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('CTA', 'click', this.textContent.trim());
    });
});

// Track social link clicks
document.querySelectorAll('.social-sidebar a, .footer-socials a, .mobile-social-fab a').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('Social', 'click', this.getAttribute('href'));
    });
});

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

window.addEventListener('load', () => {
    console.log('🚀 Portfolio loaded successfully');
    
    // Remove loading class if exists
    document.body.classList.remove('loading');
    
    // Trigger initial animations
    document.querySelectorAll('.hero-text').forEach(el => {
        el.style.opacity = '1';
    });
});

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (e) => {
    console.error('❌ Error:', e.message);
    // Log to error tracking service if available
});

// ============================================
// CONSOLE BRANDING
// ============================================

console.log('%c👋 Welcome to my Portfolio!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%c🚀 Built with modern web technologies', 'color: #f093fb; font-size: 14px;');
console.log('%c💼 Looking for opportunities? Let\'s connect!', 'color: #43e97b; font-size: 14px;');
