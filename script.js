document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader Logic ---
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.loader-bar .progress');
    let width = 0;

    const interval = setInterval(() => {
        width += Math.random() * 40;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('fade-out');
                startTypewriter();
            }, 300);
        }
        progressBar.style.width = width + '%';
    }, 80);

    // --- Magnetic Button Effect ---
    const magneticBtns = document.querySelectorAll('.btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });
        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- Advanced Magic Cursor Trail ---
    const magicCanvas = document.createElement('canvas');
    const magicCtx = magicCanvas.getContext('2d');
    magicCanvas.style.position = 'fixed';
    magicCanvas.style.top = '0';
    magicCanvas.style.left = '0';
    magicCanvas.style.width = '100%';
    magicCanvas.style.height = '100%';
    magicCanvas.style.pointerEvents = 'none';
    magicCanvas.style.zIndex = '9998';
    document.body.appendChild(magicCanvas);

    let particles = [];
    let hue = 0;

    function resizeMagic() {
        magicCanvas.width = window.innerWidth;
        magicCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeMagic);
    resizeMagic();

    class MagicParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 2;
            this.speedX = (Math.random() - 0.5) * 4;
            this.speedY = (Math.random() - 0.5) * 4;
            this.color = color;
            this.opacity = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.decay;
            this.size *= 0.95;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            magicCtx.save();
            magicCtx.translate(this.x, this.y);
            magicCtx.rotate(this.rotation * Math.PI / 180);
            magicCtx.globalAlpha = Math.max(0, this.opacity);
            magicCtx.globalCompositeOperation = 'lighter'; // This creates the "deep" bloom/neon effect

            // Primary Glow
            const gradient = magicCtx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');

            magicCtx.fillStyle = gradient;
            magicCtx.beginPath();
            magicCtx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
            magicCtx.fill();

            // Core Flare
            magicCtx.fillStyle = '#fff';
            magicCtx.beginPath();
            magicCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            magicCtx.fill();

            magicCtx.restore();
        }
    }

    const animateMagic = () => {
        magicCtx.clearRect(0, 0, magicCanvas.width, magicCanvas.height);
        hue += 2; // Cycle through colors over time

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].opacity <= 0 || particles[i].size <= 0.5) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateMagic);
    };
    animateMagic();

    // Mouse Hook for Magic Particles
    window.addEventListener('mousemove', (e) => {
        const color = `hsla(${hue}, 100%, 60%, 0.8)`;
        // Create multiple particles for a "deeper" trail
        for (let i = 0; i < 3; i++) {
            particles.push(new MagicParticle(e.clientX, e.clientY, color));
        }
    });

    // Custom Cursor Dot Interaction

    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        if (cursorDot && cursorOutline) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Global mouse tracking for background grid
            document.documentElement.style.setProperty('--mouse-x', `${posX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${posY}px`);

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        }
    });

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .logo');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.background = 'rgba(99, 102, 241, 0.1)';
            cursorOutline.style.border = 'none';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.background = 'transparent';
            cursorOutline.style.border = '2px solid var(--accent-color)';
        });
    });

    // --- Scroll Revel Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal, .reveal-text');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's the stats section, trigger counter
                if (entry.target.classList.contains('about-text')) {
                    startCounters();
                }

                // If it's skills section, animate bars
                if (entry.target.classList.contains('skill-category')) {
                    const bars = entry.target.querySelectorAll('.bar');
                    bars.forEach(bar => bar.classList.add('animate'));
                }
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Stats Counter ---
    let counted = false;
    function startCounters() {
        if (counted) return;
        const numbers = document.querySelectorAll('.number');
        numbers.forEach(num => {
            const target = +num.getAttribute('data-target');
            const increment = target / 100;
            let current = 0;

            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    num.innerText = Math.ceil(current);
                    setTimeout(updateCount, 20);
                } else {
                    num.innerText = target + (target === 8 ? '+' : '');
                }
            };
            updateCount();
        });
        counted = true;
    }

    // --- Scroll Progress & Active Link ---
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Typewriter Effect ---
    function startTypewriter() {
        const typewriter = document.querySelector('.typewriter');
        if (!typewriter) return;

        const words = JSON.parse(typewriter.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex % words.length];
            if (isDeleting) {
                typewriter.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriter.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex++;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- 3D Tilt & Glow Effect ---
    const cards = document.querySelectorAll('.project-card, .service-card, .about-text, .skill-category, .contact-info, .contact-form');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const centerX = width / 2;
            const centerY = height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;

            // Set CSS variables for spotlight effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // --- Form Submission (Simulation) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Message Sent!';
            btn.style.background = '#22c55e';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = 'var(--accent-color)';
                btn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }

    // --- Particle Background ---
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const bgContainer = document.getElementById('particles-js');
    if (bgContainer) {
        bgContainer.appendChild(canvas);
        let particles = [];
        const particleCount = 100;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // --- AI Chatbot Logic ---
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    chatbotToggle.addEventListener('click', () => {
        chatWindow.classList.add('active');
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleChat = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        // Simulate AI Response
        setTimeout(() => {
            let response = "That's interesting! I'm an AI assistant. You can contact Vivek at hello@viivek.in for more specific details!";
            if (text.toLowerCase().includes('hi') || text.toLowerCase().includes('hello')) {
                response = "Hi there! I'm V-Bot. How can I help you today?";
            } else if (text.toLowerCase().includes('experience')) {
                response = "Vivek has over 8 years of experience in web development and 2 years in graphic design.";
            } else if (text.toLowerCase().includes('skills')) {
                response = "Vivek is an expert in the MERN stack (MongoDB, Express, React, Node.js), Python, and Adobe suite.";
            }
            addMessage(response, 'bot');
        }, 1000);
    };

    sendMessage.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // --- Robot Active Animation Logic ---
    const robot = document.querySelector('.robot-3d');
    let scrollTimeout;

    if (robot) {
        // Initial state
        robot.classList.add('waving');

        window.addEventListener('scroll', () => {
            // When scrolling, start walking and stop waving
            robot.classList.add('walking');
            robot.classList.remove('waving');

            // Clear the timeout to detect when scroll stops
            clearTimeout(scrollTimeout);

            // Set timeout to detect scroll stop
            scrollTimeout = setTimeout(() => {
                robot.classList.remove('walking');
                robot.classList.add('waving');
            }, 150); // Small delay to feel natural
        });
    }

    // Initial check for elements in view
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal-text').forEach(el => el.classList.add('active'));
    }, 100);
});
