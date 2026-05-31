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

// Particle Animation - Optimized for Mobile
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const isMobile = window.innerWidth <= 768;
const particleCount = isMobile ? 25 : 50; // Reduced for mobile performance

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
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

// Cursor Animation
const cursor = document.querySelector('.cursor');
const cursorTrail = document.querySelector('.cursor-trail');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.x - 10 + 'px';
    cursor.style.top = e.y - 10 + 'px';
    cursor.classList.add('active');
});

document.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar Link Active State
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
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
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.expertise-card, .project-card, .stat-box, .skill-category').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add Animation Keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(40px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Contact Form with API
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const formData = {
                name: this.querySelector('input[placeholder="Your Name"]').value,
                email: this.querySelector('input[placeholder="Your Email"]').value,
                subject: this.querySelector('input[placeholder="Subject"]').value,
                message: this.querySelector('textarea').value
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                alert('Thank you! I will get back to you soon.');
                this.reset();
            } else {
                alert('Error: ' + (data.error || 'Failed to send message'));
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Load projects dynamically
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        console.log('Projects loaded:', projects.length);
    } catch (error) {
        console.log('Using static projects. API unavailable:', error.message);
    }
}

// Load stats on page load
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        console.log('Portfolio stats:', stats);
    } catch (error) {
        console.log('Stats API unavailable:', error.message);
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    loadProjects();
    loadStats();
});

// Mobile Menu Toggle - Enhanced
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

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
    navMenu.querySelectorAll('a').forEach(link => {
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

// Window Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Add word animation delays
document.querySelectorAll('.title-word').forEach((word, index) => {
    word.style.setProperty('--index', index);
});

// Project filtering
function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}

// Search functionality
function searchProjects(query) {
    const projectCards = document.querySelectorAll('.project-card');
    const lowerQuery = query.toLowerCase();
    projectCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent || '';
        const description = card.querySelector('p')?.textContent || '';
        const text = (title + ' ' + description).toLowerCase();
        
        if (text.includes(lowerQuery)) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}

// Performance monitoring
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time: ' + pageLoadTime + 'ms');
    });
}

// Service Worker registration (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('SW registration failed:', err));
    });
}


// Sticky CTA Toggle
const stickyCtaToggle = document.getElementById('stickyCtaToggle');
const stickyCtaMenu = document.getElementById('stickyCtaMenu');

if (stickyCtaToggle && stickyCtaMenu) {
    stickyCtaToggle.addEventListener('click', () => {
        stickyCtaMenu.classList.toggle('active');
        stickyCtaToggle.style.transform = stickyCtaMenu.classList.contains('active') 
            ? 'rotate(45deg)' 
            : 'rotate(0deg)';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!stickyCtaToggle.contains(e.target) && !stickyCtaMenu.contains(e.target)) {
            stickyCtaMenu.classList.remove('active');
            stickyCtaToggle.style.transform = 'rotate(0deg)';
        }
    });

    // Close menu when clicking a CTA item
    const ctaItems = stickyCtaMenu.querySelectorAll('.sticky-cta-item');
    ctaItems.forEach(item => {
        item.addEventListener('click', () => {
            stickyCtaMenu.classList.remove('active');
            stickyCtaToggle.style.transform = 'rotate(0deg)';
        });
    });
}

console.log('Portfolio loaded successfully with sticky CTAs');

// GitHub Contribution Graph Generator
function generateContributionGraph() {
    const graph = document.getElementById('contributionGraph');
    if (!graph) return;
    
    const weeks = 53;
    const daysPerWeek = 7;
    
    for (let week = 0; week < weeks; week++) {
        for (let day = 0; day < daysPerWeek; day++) {
            const cell = document.createElement('div');
            cell.className = 'contribution-day';
            
            // Random contribution level (0-4)
            const level = Math.floor(Math.random() * 5);
            if (level > 0) {
                cell.classList.add(`level-${level}`);
            }
            
            // Add tooltip
            const contributions = level * Math.floor(Math.random() * 10 + 1);
            cell.title = `${contributions} contributions`;
            
            graph.appendChild(cell);
        }
    }
}

// Animate GitHub Stats Counter
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

// Initialize GitHub Dashboard
document.addEventListener('DOMContentLoaded', () => {
    generateContributionGraph();
    animateStats();
});

