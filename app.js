// Lyceum Law Chambers - JavaScript Functionality

// EmailJS Configuration
const EMAILJS_CONFIG = {
    publicKey: 'N0Zw19M_fhv4Lmbkp',
    serviceId: 'service_8eb5du5',
    templateId: 'template_fcvyyha'
};

// Theme Configuration
const THEMES = {
    'classic-dark': {
        name: 'Classic Dark',
        primary: '#1a1a2e',
        secondary: '#16213e',
        accent: '#0f4c75',
        text: '#ffffff'
    },
    'corporate-blue': {
        name: 'Corporate Blue',
        primary: '#2c5aa0',
        secondary: '#1e3a8a',
        accent: '#3b82f6',
        text: '#ffffff'
    },
    'elegant-gold': {
        name: 'Elegant Gold',
        primary: '#d4af37',
        secondary: '#b8860b',
        accent: '#daa520',
        text: '#1a1a1a'
    },
    'modern-grey': {
        name: 'Modern Grey',
        primary: '#4a5568',
        secondary: '#2d3748',
        accent: '#718096',
        text: '#ffffff'
    },
    'legal-green': {
        name: 'Legal Green',
        primary: '#065f46',
        secondary: '#047857',
        accent: '#10b981',
        text: '#ffffff'
    }
};

let emailjsInitialized = false;

// Initialize EmailJS
function initializeEmailJS() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            emailjsInitialized = true;
            console.log('EmailJS initialized successfully');
        } else {
            console.error('EmailJS library not loaded');
        }
    } catch (error) {
        console.error('EmailJS initialization failed:', error);
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lyceum Law Chambers website loaded');
    
    // Wait for EmailJS to be available
    setTimeout(() => {
        initializeEmailJS();
    }, 1000);
    
    // Initialize theme system
    initializeThemes();
    
    // Initialize form handling
    initializeFormHandling();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
    
    // Setup global functions
    setupGlobalFunctions();
});

// Setup global functions
function setupGlobalFunctions() {
    // Make functions available globally
    window.toggleThemePanel = toggleThemePanel;
    window.openAdminModal = openAdminModal;
    window.makeCall = makeCall;
    window.sendEmail = sendEmail;
    window.scrollToTop = scrollToTop;
}

// Theme Management
function initializeThemes() {
    const savedTheme = localStorage.getItem('lyceum-theme') || 'corporate-blue';
    applyTheme(savedTheme);
    updateThemeButtons(savedTheme);
    
    // Add theme button event listeners
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const theme = this.dataset.theme;
            applyTheme(theme);
            updateThemeButtons(theme);
            localStorage.setItem('lyceum-theme', theme);
            
            // Close theme panel after selection
            setTimeout(() => {
                const panel = document.getElementById('themePanel');
                if (panel) {
                    panel.classList.remove('active');
                }
            }, 500);
        });
    });
}

function applyTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--text-color', theme.text);
    
    // Update body class for theme-specific styles
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeName}`);
    
    console.log(`Applied theme: ${theme.name}`);
}

function updateThemeButtons(activeTheme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === activeTheme) {
            btn.classList.add('active');
        }
    });
}

function toggleThemePanel() {
    const panel = document.getElementById('themePanel');
    if (panel) {
        panel.classList.toggle('active');
        console.log('Theme panel toggled');
    } else {
        console.error('Theme panel not found');
    }
}

// Form Handling
function initializeFormHandling() {
    const form = document.getElementById('serviceRequestForm');
    if (!form) {
        console.error('Service request form not found');
        return;
    }
    
    form.addEventListener('submit', handleFormSubmission);
    console.log('Form handler initialized');
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('formMessage');
    
    // Collect form data
    const formData = {
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        matterType: form.matterType.value,
        problemDescription: form.problemDescription.value.trim()
    };
    
    console.log('Form data collected:', formData);
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.matterType || !formData.problemDescription) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    if (!isValidEmail(formData.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Check if EmailJS is initialized
        if (!emailjsInitialized) {
            console.log('EmailJS not ready, attempting to initialize...');
            initializeEmailJS();
            
            if (!emailjsInitialized) {
                throw new Error('EmailJS not available');
            }
        }
        
        // Prepare email template params
        const templateParams = {
            from_name: formData.fullName,
            from_email: formData.email,
            phone: formData.phone || 'Not provided',
            matter_type: getMatterTypeLabel(formData.matterType),
            message: formData.problemDescription,
            to_email: 'advocateyashkumar01@gmail.com'
        };
        
        console.log('Sending email with params:', templateParams);
        
        // Send email via EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );
        
        console.log('Email sent successfully:', response);
        
        // Show success message
        showMessage('Thank you for your inquiry! We will get back to you within 24-48 hours.', 'success');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Show error message with fallback
        showMessage(`Sorry, there was an error sending your message. Please contact us directly at advocateyashkumar01@gmail.com or call +91 7550534867.`, 'error');
        
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

function getMatterTypeLabel(value) {
    const labels = {
        'taxation': 'Taxation & Compliance',
        'adr': 'Alternative Dispute Resolution',
        'corporate': 'Corporate & Business Law',
        'civil': 'Civil & Property',
        'matrimonial': 'Matrimonial & Family',
        'ipr': 'Intellectual Property',
        'other': 'Other'
    };
    return labels[value] || value;
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (!messageDiv) return;
    
    messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        ${message}
    `;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth Scrolling Navigation
function initializeSmoothScrolling() {
    // Handle navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                console.log(`Scrolling to section: ${targetId}`);
            } else {
                console.error(`Target section not found: ${targetId}`);
            }
        });
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', updateActiveNavigation);
    console.log('Smooth scrolling initialized');
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Animation Observers
function initializeAnimations() {
    // Intersection Observer for animations
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
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .service-card, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// Admin Modal
function openAdminModal() {
    console.log('Opening admin modal');
    const modalElement = document.getElementById('adminModal');
    if (modalElement) {
        // Check if Bootstrap modal is available
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } else {
            // Fallback: show modal manually
            modalElement.style.display = 'block';
            modalElement.classList.add('show');
            document.body.classList.add('modal-open');
            
            // Add backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
            
            // Close modal handler
            const closeModal = () => {
                modalElement.style.display = 'none';
                modalElement.classList.remove('show');
                document.body.classList.remove('modal-open');
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            };
            
            // Add close event listeners
            modalElement.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
                btn.addEventListener('click', closeModal);
            });
            
            backdrop.addEventListener('click', closeModal);
        }
    } else {
        console.error('Admin modal element not found');
    }
}

// Utility Functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Contact Methods
function makeCall() {
    window.open('tel:7550534867', '_self');
}

function sendEmail() {
    window.open('mailto:advocateyashkumar01@gmail.com', '_blank');
}

// Close theme panel when clicking outside
document.addEventListener('click', function(e) {
    const themePanel = document.getElementById('themePanel');
    const themeToggle = document.querySelector('.theme-toggle-btn');
    
    if (themePanel && themePanel.classList.contains('active') && 
        !themePanel.contains(e.target) && 
        !themeToggle.contains(e.target)) {
        themePanel.classList.remove('active');
    }
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .feature-card,
    .service-card,
    .contact-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Error handling for missing elements
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
}

// Performance optimization - lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
    initializeLazyLoading();
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

console.log('Lyceum Law Chambers JavaScript loaded successfully');

// Export functions for potential external use
window.LyceumLaw = {
    openAdminModal,
    toggleThemePanel,
    makeCall,
    sendEmail,
    scrollToTop
};