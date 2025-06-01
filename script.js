// Modern JavaScript for the aesthetic personal website

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.querySelector('.nav-menu');
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const backToTop = document.getElementById('backToTop');

// Chat state
let isTyping = false;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeAnimations();
    initializeNavigation();
    initializeChat();
    initializeScrollEffects();
    addParticleEffect();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    }

    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const isDark = document.body.hasAttribute('data-theme');
    
    if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
    }
}

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    const achievements = entry.target.querySelectorAll('.achievement-item');
                    achievements.forEach((achievement, index) => {
                        setTimeout(() => {
                            achievement.style.transform = 'translateX(0)';
                            achievement.style.opacity = '1';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        if (index % 2 === 0) {
            item.classList.add('slide-in-left');
        } else {
            item.classList.add('slide-in-right');
        }
        observer.observe(item);
    });

    // Initialize achievement items with hidden state
    document.querySelectorAll('.achievement-item').forEach(item => {
        item.style.transform = 'translateX(-20px)';
        item.style.opacity = '0';
        item.style.transition = 'all 0.3s ease';
    });
}

// Navigation
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for nav height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Enhanced Chat functionality with ChatGPT-like responses
function initializeChat() {
    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isTyping) {
            sendMessage();
        }
    });

    // Add initial greeting
    setTimeout(() => {
        addMessage("👋 Hi there! I'm Kevin's AI assistant. I know everything about Kevin Li - his age, skills, current work, and achievements. What would you like to know about him?", 'bot');
    }, 500);
}

function toggleChat() {
    chatWidget.classList.toggle('active');
    
    if (chatWidget.classList.contains('active')) {
        chatInput.focus();
    }
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isTyping) return;

    addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI processing time
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateIntelligentResponse(message);
        typeMessage(response, 'bot');
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    const typingElement = document.createElement('div');
    typingElement.className = 'message bot-message typing-indicator';
    typingElement.id = 'typing-indicator';
    
    typingElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-animation">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        typingElement.remove();
    }
    isTyping = false;
}

function typeMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
        </div>
        <div class="message-content">
            <p class="typing-text"></p>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    
    const textElement = messageElement.querySelector('.typing-text');
    let i = 0;
    
    function typeChar() {
        if (i < message.length) {
            textElement.textContent += message.charAt(i);
            i++;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(typeChar, 30); // Typing speed
        }
    }
    
    typeChar();
}

function generateIntelligentResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Age-related questions
    if (lowerMessage.includes('age') || lowerMessage.includes('old') || lowerMessage.includes('born')) {
        return "Kevin was born in 2005, so he's currently around 19-20 years old. Pretty impressive what he's accomplished at such a young age, right? 🌟";
    }
    
    // Queel startup questions
    if (lowerMessage.includes('queel') || (lowerMessage.includes('startup') && (lowerMessage.includes('do') || lowerMessage.includes('what'))) || lowerMessage.includes('platform')) {
        return "Queel is Kevin's innovative job-seeking platform! 🚀\n\n**What makes it different?**\n• Instead of traditional paper resumes, candidates create **short videos**\n• It's like a combination of **TikTok and LinkedIn**\n• Helps interviewers get to know candidates better as real people, not just paperwork\n• More personal and authentic than standard job sites\n\nIt's revolutionizing how job seekers connect with employers! 🎥✨";
    }
    
    // Team management and scaling questions
    if (lowerMessage.includes('scale') || lowerMessage.includes('manage') || (lowerMessage.includes('team') && (lowerMessage.includes('20') || lowerMessage.includes('student') || lowerMessage.includes('lead')))) {
        return "Great question about Kevin's leadership approach! 👑\n\n**His secret to managing 20+ people as a student:**\n• **Time management** - Efficiently balancing studies and work\n• **Passion-driven** - He genuinely enjoys what he does\n• **Experience** - Multiple roles as CTO and Chief AI Scientist\n• **Dedication** - Willing to allocate time to master his craft\n\nAs he says: 'The key is time management and passion - I enjoy what I'm doing!' 🎯⏰";
    }
    
    // Collaboration questions
    if (lowerMessage.includes('collaborate') || lowerMessage.includes('collaboration') || (lowerMessage.includes('ai') && lowerMessage.includes('project')) || lowerMessage.includes('work together')) {
        scrollToSection('contact');
        return "Kevin would love to collaborate on AI projects! 🤝\n\n**He's always encouraged to work with fellow innovators!**\n\nI've scrolled to the contact section where you can reach out to him. Feel free to share your project ideas - he's passionate about AI and enjoys collaborating with like-minded people! 🚀💡";
    }
    
    // Internships, freelance, advisory roles
    if (lowerMessage.includes('internship') || lowerMessage.includes('freelance') || lowerMessage.includes('advisory') || lowerMessage.includes('roles') || (lowerMessage.includes('open') && (lowerMessage.includes('work') || lowerMessage.includes('hire'))) || lowerMessage.includes('opportunities')) {
        scrollToSection('contact');
        return "Kevin is absolutely open to various opportunities! 💼\n\n**He's interested in:**\n• Internships\n• Freelance work\n• Advisory roles\n• Consulting projects\n\n**He says:** 'I am more than happy to do so!'\n\nI've navigated to the contact section - reach out to discuss potential collaborations! 🌟";
    }
    
    // UK to Dubai move questions
    if (lowerMessage.includes('uk') || lowerMessage.includes('dubai') || lowerMessage.includes('move') || lowerMessage.includes('uae') || (lowerMessage.includes('why') && lowerMessage.includes('dubai'))) {
        return "Kevin's move from the UK to Dubai was strategic! 🌍\n\n**His reasoning:**\n• The UK is great, but he sees **more AI potential in Dubai and UAE**\n• UAE is heavily investing in AI and catching up with global trends\n• Dubai's increasing interest and attention in AI innovation\n• Plus, he's actually **grown up in UAE for more than 17 years** - it's like coming home!\n\nSmart move for someone in the AI field! 🇦🇪✨";
    }
    
    // Future plans and graduation questions
    if (lowerMessage.includes('plan') || lowerMessage.includes('graduation') || lowerMessage.includes('masters') || lowerMessage.includes('future') || lowerMessage.includes('after') || lowerMessage.includes('next')) {
        return "Kevin has exciting plans ahead! 🎓\n\n**Post-graduation goals:**\n• **Pursue a Master's degree** - Continuing his academic excellence\n• **Scale his startups** - Growing Queel and YouthMind\n• **Advance AI research** - Contributing to cutting-edge developments\n\nWith his track record of success, his future looks incredibly bright! 🌟📚";
    }
    
    // Booking calls and meetings
    if (lowerMessage.includes('book') || lowerMessage.includes('call') || lowerMessage.includes('calendly') || lowerMessage.includes('meeting') || lowerMessage.includes('schedule') || (lowerMessage.includes('touch') && lowerMessage.includes('quick'))) {
        scrollToSection('contact');
        return "Perfect! Kevin has multiple ways for you to get in touch quickly! 📅\n\n**Book a call directly:**\n🗓️ **Calendly:** https://calendly.com/app/personal/profile\n\n**Other contact methods:**\n📧 **Email:** liyin20200613@gmail.com\n🔗 **LinkedIn:** yin-li-2a77b8335\n\nI've scrolled to the contact section for you. Choose whatever works best! 🚀";
    }
    
    // Skills and expertise questions
    if (lowerMessage.includes('skill') || lowerMessage.includes('good at') || lowerMessage.includes('expertise') || lowerMessage.includes('talent')) {
        scrollToSection('skills');
        return "Kevin is exceptionally skilled in several areas! 🚀\n\n• **Web programming** - Full-stack development\n• **Data structures and algorithms** - Deep understanding and implementation\n• **Algorithm creation** - Developing new, innovative algorithms\n• **Optimization** - Improving efficiency while reducing cost and storage\n• **Technical leadership** - Leading and managing technical teams\n\nI've also scrolled to the skills section for you to see more details! 📋";
    }
    
    // Current work questions
    if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('currently') || lowerMessage.includes('cto')) {
        return "Kevin is currently wearing multiple hats! 👔\n\n🚀 **CTO at Queel** - Building the entire backend and AI ecosystem\n🧠 **CTO at YouthMind** - Leading a team of 15 people\n\nHe's quite flexible in his approach and excels at managing technical teams while developing cutting-edge AI solutions. His leadership style focuses on innovation and efficiency! 💡";
    }
    
    // Graduation questions
    if (lowerMessage.includes('graduate') || lowerMessage.includes('graduation') || lowerMessage.includes('finish') || lowerMessage.includes('2027')) {
        return "Kevin is set to graduate in **2027** from the University of Birmingham Dubai! 🎓 He's currently pursuing his degree while simultaneously running multiple companies as CTO. Talk about multitasking! 📚✨";
    }
    
    // Education questions
    if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('university') || lowerMessage.includes('school')) {
        scrollToSection('journey');
        return "Kevin has an impressive educational journey! 🎓\n\n**Currently:** University of Birmingham Dubai (2024-2027)\n• 🏆 1st place in IET GCC AI challenges\n• 🥇 1st place in Google AI agent hackathon\n• 📚 Highest achiever in coding modules\n\n**Previously:** Into Manchester (A*A*A*) and Al Maaref Private School (4.02/4 GPA)\n\nI've scrolled to his educational journey section for more details! 📖";
    }
    
    // Experience questions
    if (lowerMessage.includes('experience') || lowerMessage.includes('companies') || lowerMessage.includes('founded')) {
        scrollToSection('experience');
        return "Kevin has founded and co-founded **5+ companies**! 🚀 His experience includes:\n\n• **Queel** - CTO & Co-founder\n• **YouthMind** - CAIO & CTO\n• **LibaSpace** - Chief AI Engineer\n• **Dubai World Trade Centre** - Trilingual Translator\n\nHe's managed 20+ team members and achieved incredible results like 80% performance improvements! Check out the experience section I've scrolled to. 💼";
    }
    
    // Projects questions
    if (lowerMessage.includes('project') || lowerMessage.includes('built') || lowerMessage.includes('created') || lowerMessage.includes('developed')) {
        scrollToSection('projects');
        return "Kevin has worked on some amazing projects! 🛠️\n\n🚦 **AI Traffic Management** - Advanced algorithms for Dubai traffic optimization\n👁️ **Image Recognition** - 97% accuracy with multilingual capabilities\n📈 **Stock Prediction AI** - Multimodal system supporting text, images, and video\n\nEach project showcases his expertise in AI, optimization, and real-world problem solving! I've navigated to the projects section for you. 🎯";
    }
    
    // Contact questions
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('linkedin')) {
        scrollToSection('contact');
        return "You can reach Kevin through several channels! 📞\n\n📧 **Email:** liyin20200613@gmail.com\n🔗 **LinkedIn:** yin-li-2a77b8335\n🗓️ **Book a call:** https://calendly.com/app/personal/profile\n📍 **Location:** Dubai, UAE\n\nI've scrolled to the contact section for you. Feel free to reach out - he's always open to interesting opportunities and collaborations! 🤝";
    }
    
    // Achievements questions
    if (lowerMessage.includes('achievement') || lowerMessage.includes('award') || lowerMessage.includes('won') || lowerMessage.includes('competition')) {
        return "Kevin has an impressive list of achievements! 🏆\n\n• 🥇 Multiple 1st place finishes in AI challenges and hackathons\n• 🏀 Led basketball teams to championships (2x)\n• 🌟 'Student of the year' (3 times)\n• 📝 Highest EAP academic writing score ever\n• ⛓️ Co-founder of Blockchain society\n• 🤖 AI lead for CSA in Dubai\n\nHis track record shows consistent excellence across technical and leadership domains! ⭐";
    }
    
    // Programming/technical questions
    if (lowerMessage.includes('programming') || lowerMessage.includes('coding') || lowerMessage.includes('language') || lowerMessage.includes('python') || lowerMessage.includes('javascript')) {
        return "Kevin is proficient in multiple programming languages and technologies! 💻\n\n**Languages:** Python, Java, JavaScript, PHP\n**Frontend:** HTML, CSS, React, Vue.js\n**AI/ML:** Machine Learning, Deep Learning, Computer Vision, NLP\n**Management:** Data Analysis, Project Management, Team Leadership\n\nHe excels at creating efficient algorithms and optimizing system performance while minimizing costs! 🔧";
    }
    
    // Leadership questions
    if (lowerMessage.includes('leader') || lowerMessage.includes('team') || lowerMessage.includes('manage') || lowerMessage.includes('management')) {
        return "Kevin is an exceptional leader! 👑\n\n• Currently leading **15 people** at YouthMind\n• Has managed **20+ team members** across various projects\n• Co-founded **5+ companies**\n• Focuses on **innovation and efficiency**\n• Expert in **technical team leadership**\n\nHis leadership philosophy combines technical expertise with people management, creating environments where teams thrive and deliver exceptional results! 🌟";
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage === '') {
        return "Hello! 👋 I'm Kevin's AI assistant and I know everything about him! You can ask me about:\n\n• His age and background\n• Current work and companies (like Queel!)\n• Skills and expertise\n• Education and achievements\n• Projects he's built\n• Collaboration opportunities\n• How to contact him or book a call\n\nWhat would you like to know about Kevin? 🤔";
    }
    
    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're very welcome! 😊 I'm always here to help you learn more about Kevin's incredible journey and achievements. Feel free to ask me anything else about him! 🚀";
    }
    
    // Default intelligent response
    const defaultResponses = [
        "That's an interesting question about Kevin! 🤔 Let me help you with that. Kevin is a 19-20 year old AI engineer and CTO who has achieved remarkable success at a young age. You can ask me about his startups, collaborations, future plans, or how to get in touch with him!",
        "I'd love to help you learn more about Kevin! 🌟 He's currently working as CTO for multiple companies including Queel, has incredible technical skills, and is always open to collaborations. What specific information are you looking for?",
        "Great question! Kevin has quite an impressive profile - from his innovative startup Queel to his leadership roles at various companies. Feel free to ask about his work, collaboration opportunities, how to book a call with him, or any other aspect of his background! 🚀"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function scrollToSection(sectionId) {
    setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }, 1000);
}

// Scroll effects
function initializeScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Show/hide back to top button
        if (scrolled > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Parallax effect for floating shapes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });

        // Update navigation background
        const nav = document.querySelector('.nav-modern');
        if (scrolled > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            if (document.body.hasAttribute('data-theme')) {
                nav.style.background = 'rgba(15, 23, 42, 0.95)';
            }
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.8)';
            if (document.body.hasAttribute('data-theme')) {
                nav.style.background = 'rgba(15, 23, 42, 0.8)';
            }
        }
    });

    // Back to top functionality
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add particle effect
function addParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.y > canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = canvas.height;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    resizeCanvas();
    initParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// Typing effect for hero title
function initTypingEffect() {
    const titleElement = document.querySelector('.title-line');
    if (!titleElement) return;
    
    const text = titleElement.textContent;
    titleElement.textContent = '';
    titleElement.style.borderRight = '2px solid #6366f1';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(() => {
                titleElement.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    setTimeout(typeWriter, 1000);
}

// Initialize typing effect when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initTypingEffect();
            heroObserver.unobserve(entry.target);
        }
    });
});

const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Enhanced hover effects
document.querySelectorAll('.project-card, .experience-card, .skill-category').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading screen
function createLoadingScreen() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">YL</div>
            <div class="loader-progress">
                <div class="loader-bar"></div>
            </div>
            <p>Loading amazing content...</p>
        </div>
    `;
    
    const loaderStyles = `
        #loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #6366f1, #ec4899);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        .loader-content {
            text-align: center;
            color: white;
        }
        .loader-logo {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 2rem;
            animation: pulse 2s infinite;
        }
        .loader-progress {
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            margin: 0 auto 1rem;
            overflow: hidden;
        }
        .loader-bar {
            height: 100%;
            background: white;
            border-radius: 2px;
            animation: loading 2s ease-in-out;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = loaderStyles;
    document.head.appendChild(style);
    document.body.appendChild(loader);
    
    // Remove loader after 2 seconds
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
            style.remove();
        }, 500);
    }, 2000);
}

// Initialize loading screen
createLoadingScreen();
