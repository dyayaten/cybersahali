// Create page transition overlay
const body = document.querySelector('body');
const transitionOverlay = document.createElement('div');
transitionOverlay.className = 'page-transition-overlay';
body.appendChild(transitionOverlay);

// Sparks Animation System
document.addEventListener('DOMContentLoaded', () => {
    const sparksContainer = document.getElementById('sparksContainer');
    const hero = document.querySelector('.hero');

    if (!sparksContainer) return;

    // Configuration - optimized for performance with fewer sparks
    const config = {
        sparkCount: 6,         // Significantly reduced number of sparks to be less distracting
        particleCount: 30,     // Reduced number of background particles
        sparkColors: ['', 'white', 'red'], // CSS classes for different colored sparks
        minSparkDuration: 5,   // Increased minimum animation duration for slower, less distracting movement
        maxSparkDuration: 8,   // Increased maximum animation duration
        minParticleDuration: 15, // Minimum particle float duration
        maxParticleDuration: 30, // Maximum particle float duration
        charChangeInterval: 300, // How often to change characters (milliseconds)
        brandChars: ['c','y','b','e','r','s','a','h','l','i'], // Brand characters to display
        useHardwareAcceleration: true, // Enable hardware acceleration
        throttleMouseEvents: true, // Throttle mouse events for better performance
        throttleDelay: 50      // Milliseconds to throttle mouse events
    };

    // Track mouse position for interactive sparks
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseSpeed = 0;
    let mouseAngle = 0;
    let isMouseMoving = false;
    let mouseTimeout;

    // Create initial sparks
    createSparks();
    createBackgroundParticles();

    // Create a special container for mouse-following sparks
    const mouseFollowContainer = document.createElement('div');
    mouseFollowContainer.className = 'mouse-follow-container';
    mouseFollowContainer.style.position = 'absolute';
    mouseFollowContainer.style.top = '0';
    mouseFollowContainer.style.left = '0';
    mouseFollowContainer.style.width = '100%';
    mouseFollowContainer.style.height = '100%';
    mouseFollowContainer.style.pointerEvents = 'none';
    mouseFollowContainer.style.zIndex = '5';
    sparksContainer.appendChild(mouseFollowContainer);

    // Throttle function to limit the frequency of event handling
    function throttle(callback, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return callback(...args);
        };
    }

    // Optimized mouse tracking with throttling
    const handleMouseMove = throttle((e) => {
        // Calculate mouse speed and angle
        const newMouseX = e.clientX;
        const newMouseY = e.clientY;

        // Calculate speed (distance between current and last position)
        const dx = newMouseX - lastMouseX;
        const dy = newMouseY - lastMouseY;
        mouseSpeed = Math.sqrt(dx * dx + dy * dy);

        // Calculate angle
        mouseAngle = Math.atan2(dy, dx) * 180 / Math.PI;

        // Update positions
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        mouseX = newMouseX;
        mouseY = newMouseY;

        // Set flag that mouse is moving
        isMouseMoving = true;
        clearTimeout(mouseTimeout);

        // Create sparks based on mouse speed - significantly reduced for less distraction
        if (mouseSpeed > 12) { // Increased threshold to reduce spark creation
            // Create at most 1 spark and only for faster movements
            if (Math.random() > 0.5) { // Only 50% chance to create a spark
                createSparkAtPosition(mouseX, mouseY, mouseSpeed, mouseAngle);
            }
        }

        // Reset moving flag after a short delay
        mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    }, config.throttleDelay);

    // Add mouse tracking with throttling
    hero.addEventListener('mousemove', handleMouseMove);

    // Add minimal special effect for mouse entering the hero section
    hero.addEventListener('mouseenter', (e) => {
        // Create just a few sparks when entering
        for (let i = 0; i < 3; i++) { // Reduced from 8 to only 3
            setTimeout(() => {
                createSparkAtPosition(e.clientX, e.clientY, 20, Math.random() * 360);
            }, i * 100); // Increased delay between sparks
        }
    });

    // Create initial sparks - reduced for less distraction
    function createSparks() {
        // Create fewer initial sparks
        for (let i = 0; i < config.sparkCount; i++) {
            createSpark();
        }

        // Continue creating sparks periodically but much less frequently
        setInterval(() => {
            // Only create a new spark if we have fewer than the configured amount
            // and with only a 30% chance each time
            if (sparksContainer.children.length < config.sparkCount && Math.random() > 0.7) {
                createSpark();
            }
        }, 1200); // Increased from 400ms to 1200ms
    }

    // Create a single spark with shining effect - optimized for performance
    function createSpark() {
        const spark = document.createElement('div');
        spark.className = 'spark';

        // Simplified color distribution - fewer red sparks (most expensive)
        const colorRandom = Math.random();
        let colorClass = '';

        if (colorRandom < 0.6) {
            // 60% chance of default (most efficient)
            colorClass = '';
        } else if (colorRandom < 0.9) {
            // 30% chance of white
            colorClass = 'white';
        } else {
            // 10% chance of red (most resource-intensive)
            colorClass = 'red';
        }

        if (colorClass) {
            spark.classList.add(colorClass);
        }

        // Set random rotation for the shine effect
        const rotation = Math.random() * 360;
        spark.style.setProperty('--rotation', `${rotation}deg`);

        // Simplified positioning - fewer calculations
        const columns = 8; // Reduced from 10
        const rows = 4;    // Reduced from 6
        const column = Math.floor(Math.random() * columns);

        // Add slight randomness to grid positions
        const x = (column / columns * 100) + (Math.random() * 5 - 2.5);

        // Make sparks rise from bottom with varying starting positions
        const startY = Math.random() * 15 + 5; // 5-20% from bottom (reduced range)
        spark.style.left = `${x}%`;
        spark.style.bottom = `${startY}%`;

        // Simplified size calculation
        const size = colorClass === 'red' ? 5 : 4;
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;

        // More consistent animation duration with less randomness
        const duration = config.minSparkDuration + Math.random() * 1.5; // Reduced range
        spark.style.animationDuration = `${duration}s`;

        // Add hardware acceleration for all elements if enabled
        if (config.useHardwareAcceleration) {
            spark.style.willChange = 'transform, opacity';
        }

        // Simplified 3D effect
        const depth = colorClass === 'red' ? 30 : (colorClass === 'white' ? 20 : 10);
        spark.style.transform = `translateZ(${depth}px)`;

        // Add to container
        sparksContainer.appendChild(spark);

        // Rotate the shine effect less frequently
        let rotateInterval;
        if (colorClass !== '') { // Only rotate non-default sparks
            const rotateSpeed = 500; // Fixed speed instead of random
            rotateInterval = setInterval(() => {
                if (spark.parentNode === sparksContainer) {
                    const newRotation = parseInt(spark.style.getPropertyValue('--rotation') || '0') + 45;
                    spark.style.setProperty('--rotation', `${newRotation}deg`);
                } else {
                    clearInterval(rotateInterval);
                }
            }, rotateSpeed);
        }

        // Add pulsing effect only for red sparks and at a lower frequency
        let pulseInterval;
        if (colorClass === 'red') {
            let pulseScale = 1;
            let growing = false;
            pulseInterval = setInterval(() => {
                if (spark.parentNode === sparksContainer) {
                    if (growing) {
                        pulseScale += 0.05;
                        if (pulseScale >= 1.2) growing = false;
                    } else {
                        pulseScale -= 0.05;
                        if (pulseScale <= 0.8) growing = true;
                    }
                    spark.style.transform = `translateZ(${depth}px) scale(${pulseScale})`;
                } else {
                    clearInterval(pulseInterval);
                }
            }, 150); // Reduced frequency from 100ms to 150ms
        }

        // Remove after animation completes
        setTimeout(() => {
            if (spark.parentNode === sparksContainer) {
                if (rotateInterval) clearInterval(rotateInterval);
                if (pulseInterval) clearInterval(pulseInterval);
                sparksContainer.removeChild(spark);
            }
        }, duration * 1000);
    }

    // Get a brand character from our array
    function getRandomChar() {
        return config.brandChars[Math.floor(Math.random() * config.brandChars.length)];
    }

    // Create a spark at a specific position (for mouse interaction) with motion blur
    function createSparkAtPosition(x, y, speed = 10, angle = 0) {
        const spark = document.createElement('div');
        spark.className = 'spark';

        // Use color distribution based on speed and position
        let colorClass = '';
        const colorRandom = Math.random();

        if (speed > 20) {
            // Fast movements get more red sparks
            if (colorRandom < 0.4) colorClass = 'red';
            else if (colorRandom < 0.7) colorClass = 'white';
        } else if (speed > 10) {
            // Medium speed gets mixed colors
            if (colorRandom < 0.2) colorClass = 'red';
            else if (colorRandom < 0.6) colorClass = 'white';
        } else {
            // Slow movements get more white/default
            if (colorRandom < 0.1) colorClass = 'red';
            else if (colorRandom < 0.5) colorClass = 'white';
        }

        if (colorClass) {
            spark.classList.add(colorClass);
        }

        // Add dynamic motion blur based on speed
        const blurAmount = Math.min(speed / 10, 3); // Cap at 3px blur
        spark.style.filter = `blur(${blurAmount}px)`;

        // Add motion trail effect for higher speeds
        if (speed > 15) {
            spark.style.boxShadow = `0 0 8px 2px rgba(255, 255, 255, 0.7),
                                    ${Math.cos(angle * Math.PI / 180) * -blurAmount * 2}px
                                    ${Math.sin(angle * Math.PI / 180) * -blurAmount * 2}px
                                    ${blurAmount * 3}px rgba(255, 255, 255, 0.3)`;
        }

        // Set rotation based on mouse movement angle with slight randomness
        const rotationVariance = Math.random() * 20 - 10; // ±10 degrees
        spark.style.setProperty('--rotation', `${angle + rotationVariance}deg`);

        // Calculate position relative to container
        const rect = sparksContainer.getBoundingClientRect();
        const relX = ((x - rect.left) / rect.width) * 100;
        const relY = ((y - rect.top) / rect.height) * 100;

        // Position the spark
        spark.style.position = 'absolute';
        spark.style.left = `${relX}%`;
        spark.style.top = `${relY}%`;

        // Size based on speed and color for more dynamic effect
        const colorSizeBonus = colorClass === 'red' ? 1 : (colorClass === 'white' ? 0.5 : 0);
        const size = 4 + Math.min(speed / 5, 4) + colorSizeBonus;
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;

        // Adjust glow intensity based on speed and color
        const glowIntensity = Math.min(speed / 10, 2) * (colorClass === 'red' ? 1.2 : 1);

        if (colorClass === 'red') {
            spark.style.boxShadow = `0 0 ${10 + glowIntensity * 5}px ${2 + glowIntensity}px rgba(255, 0, 0, 0.8),
                                     0 0 ${20 + glowIntensity * 10}px ${6 + glowIntensity * 2}px rgba(255, 0, 0, 0.4)`;
        } else {
            spark.style.boxShadow = `0 0 ${10 + glowIntensity * 5}px ${2 + glowIntensity}px rgba(255, 255, 255, 0.8),
                                     0 0 ${20 + glowIntensity * 10}px ${6 + glowIntensity * 2}px rgba(255, 255, 255, 0.4)`;
        }

        // Duration based on speed - faster for higher speeds
        const duration = speed > 20 ? 1.2 : (speed > 10 ? 1.5 : 1.8);

        // Use transition for smooth movement
        spark.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1), opacity ${duration}s ease-out`;
        spark.style.opacity = '1';

        // Add to mouseFollowContainer for better performance
        mouseFollowContainer.appendChild(spark);

        // Apply movement in the direction of mouse travel
        setTimeout(() => {
            if (spark.parentNode === mouseFollowContainer) {
                // Calculate distance based on speed with more variation for faster movements
                const distanceVariance = speed > 15 ? (Math.random() * 20 - 10) : 0; // ±10px for fast movements
                const distance = 30 + speed + distanceVariance;
                const radians = angle * Math.PI / 180;
                const endX = Math.cos(radians) * distance;
                const endY = Math.sin(radians) * distance;

                // Apply transform with translation
                spark.style.transform = `translate(${endX}px, ${endY}px)`;
                spark.style.opacity = '0';
            }
        }, 10);

        // Create trail sparks for faster movements
        if (speed > 10) {
            // More trails for faster movements
            const trailCount = Math.min(Math.floor(speed / 8) + 1, 5);

            for (let i = 0; i < trailCount; i++) {
                setTimeout(() => {
                    const trailSpark = document.createElement('div');
                    trailSpark.className = 'spark';

                    // Trail color distribution
                    if (i === 0 && colorClass === 'red') {
                        // First trail of red spark is also red
                        trailSpark.classList.add('red');
                    } else if (i % 3 === 0) {
                        trailSpark.classList.add('white');
                    } else if (i % 3 === 1 && speed > 15) {
                        // Add some red trails for fast movements
                        trailSpark.classList.add('red');
                    }

                    // Slightly different rotation for variety
                    const trailRotation = angle + (i * 20) + (Math.random() * 10 - 5);
                    trailSpark.style.setProperty('--rotation', `${trailRotation}deg`);

                    // Position with offset based on trail index
                    const offsetDistance = (i + 1) * 5;
                    const radians = angle * Math.PI / 180;
                    const offsetX = relX - Math.cos(radians) * offsetDistance;
                    const offsetY = relY - Math.sin(radians) * offsetDistance;

                    trailSpark.style.position = 'absolute';
                    trailSpark.style.left = `${offsetX}%`;
                    trailSpark.style.top = `${offsetY}%`;

                    // Smaller size for trail sparks
                    const trailSize = size * (0.9 - i * 0.15);
                    trailSpark.style.width = `${trailSize}px`;
                    trailSpark.style.height = `${trailSize}px`;

                    // Less intense glow for trail
                    const trailGlowIntensity = glowIntensity * (0.8 - i * 0.15);

                    if (trailSpark.classList.contains('red')) {
                        trailSpark.style.boxShadow = `0 0 ${8 + trailGlowIntensity * 3}px ${1 + trailGlowIntensity * 0.5}px rgba(255, 0, 0, 0.6),
                                                     0 0 ${15 + trailGlowIntensity * 5}px ${3 + trailGlowIntensity}px rgba(255, 0, 0, 0.3)`;
                    } else {
                        trailSpark.style.boxShadow = `0 0 ${8 + trailGlowIntensity * 3}px ${1 + trailGlowIntensity * 0.5}px rgba(255, 255, 255, 0.6),
                                                     0 0 ${15 + trailGlowIntensity * 5}px ${3 + trailGlowIntensity}px rgba(255, 255, 255, 0.3)`;
                    }

                    trailSpark.style.opacity = '0.8';
                    trailSpark.style.transition = `transform ${duration * 0.8}s cubic-bezier(0.25, 0.1, 0.25, 1), opacity ${duration * 0.8}s ease-out`;

                    mouseFollowContainer.appendChild(trailSpark);

                    // Apply movement with slight variation
                    setTimeout(() => {
                        if (trailSpark.parentNode === mouseFollowContainer) {
                            const trailAngleVariance = Math.random() * 20 - 10; // ±10 degrees
                            const trailRadians = (angle + (i * 15) + trailAngleVariance) * Math.PI / 180;
                            const trailDistance = distance * (0.7 - i * 0.1);
                            const trailEndX = Math.cos(trailRadians) * trailDistance;
                            const trailEndY = Math.sin(trailRadians) * trailDistance;

                            trailSpark.style.transform = `translate(${trailEndX}px, ${trailEndY}px)`;
                            trailSpark.style.opacity = '0';
                        }
                    }, 10);

                    // Remove trail spark
                    setTimeout(() => {
                        if (trailSpark.parentNode === mouseFollowContainer) {
                            mouseFollowContainer.removeChild(trailSpark);
                        }
                    }, duration * 800);
                }, i * 40); // Slightly faster trail creation
            }
        }

        // Remove spark after animation completes
        setTimeout(() => {
            if (spark.parentNode === mouseFollowContainer) {
                mouseFollowContainer.removeChild(spark);
            }
        }, duration * 1000);
    }

    // Create background floating particles for depth - optimized for performance
    function createBackgroundParticles() {
        // Create a document fragment to batch DOM operations
        const fragment = document.createDocumentFragment();

        // Add custom CSS for different animation paths only once
        if (!document.getElementById('particle-animations')) {
            const style = document.createElement('style');
            style.id = 'particle-animations';
            style.textContent = `
                @keyframes float-particle-left {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-20px) translateX(15px); }
                    50% { transform: translateY(-10px) translateX(25px); }
                    75% { transform: translateY(15px) translateX(5px); }
                }

                @keyframes float-particle-right {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-15px) translateX(-20px); }
                    50% { transform: translateY(-5px) translateX(-10px); }
                    75% { transform: translateY(10px) translateX(-15px); }
                }

                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .red-particle {
                    background-color: rgba(255, 0, 0, 0.8);
                }
            `;
            document.head.appendChild(style);
        }

        // Create particles with simplified properties
        for (let i = 0; i < config.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Simplified positioning with grid pattern
            const columns = 10; // Reduced from 20
            const rows = 8;     // Reduced from 10
            const column = Math.floor(Math.random() * columns);
            const row = Math.floor(Math.random() * rows);

            // Add less randomness to grid positions
            const x = (column / columns * 100) + (Math.random() * 6 - 3);
            const y = (row / rows * 100) + (Math.random() * 6 - 3);

            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;

            // Simplified size calculation
            const depthFactor = Math.random();
            const size = 0.5 + depthFactor * 1;  // Reduced max size
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random opacity based on size/depth
            particle.style.opacity = 0.1 + depthFactor * 0.2;  // Reduced max opacity

            // Fewer red particles (5% instead of 15%)
            if (Math.random() > 0.95) {
                particle.classList.add('red-particle');
                particle.style.boxShadow = `0 0 3px 1px rgba(255, 0, 0, 0.3)`;
            } else {
                particle.style.boxShadow = `0 0 3px 1px rgba(255, 255, 255, 0.3)`;
            }

            // Simplified animation duration calculation
            const duration = config.minParticleDuration + Math.random() * 10;  // Reduced range
            const delay = Math.random() * 10;  // Reduced max delay

            // Simplified animation paths - only 2 types
            let animationName = (x < 50) ? 'float-particle-left' : 'float-particle-right';
            particle.style.animation = `${animationName} ${duration}s ease-in-out ${delay}s infinite`;

            // Add hardware acceleration if enabled
            if (config.useHardwareAcceleration) {
                particle.style.willChange = 'transform';
            }

            // Fewer particles with additional animations
            if (Math.random() > 0.9 && i % 3 === 0) {  // Only 10% of particles, and only every 3rd one
                const rotateAnimation = `rotate ${15}s linear infinite`;
                particle.style.animation += `, ${rotateAnimation}`;
            }

            // Add to fragment instead of directly to DOM
            fragment.appendChild(particle);
        }

        // Add all particles to DOM at once
        sparksContainer.appendChild(fragment);
    }
});

// Add CSS for the overlay
const style = document.createElement('style');
style.textContent = `
    .page-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        z-index: 9999;
        transform: scaleY(0);
        transform-origin: top;
        transition: transform 0.5s ease;
        pointer-events: none;
    }

    .page-transition-overlay.active {
        transform: scaleY(1);
    }

    .page-transition-overlay::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(255, 0, 0, 0.3) 0%, transparent 70%);
    }

    .section-transition {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }

    .section-transition.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Add section transition class to all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-transition');
});

// Smooth scrolling for navigation links with page transition effect
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Activate transition overlay
            transitionOverlay.classList.add('active');

            // After a short delay, scroll to the target and hide overlay
            setTimeout(() => {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed navbar
                    behavior: 'auto' // Use auto for instant jump during transition
                });

                // Hide overlay after scrolling
                setTimeout(() => {
                    transitionOverlay.classList.remove('active');
                }, 300);
            }, 500);
        }
    });
});

// Check for form submission success
document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameters for success messages
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('contact_success') && urlParams.get('contact_success') === 'true') {
        alert('Thank you for your message! We will get back to you soon.');
        // Remove the parameter from URL to prevent showing the message again on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }

    if (urlParams.has('issue_success') && urlParams.get('issue_success') === 'true') {
        // Show success modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
            // Get the reference number from localStorage or generate a new one
            let referenceNumber = localStorage.getItem('lastReferenceNumber');
            if (!referenceNumber) {
                referenceNumber = `ISSUE-${Date.now().toString().substring(7)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            }

            document.getElementById('referenceNumber').textContent = referenceNumber;

            // Clear the reference number from localStorage
            localStorage.removeItem('lastReferenceNumber');

            successModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        // Remove the parameter from URL to prevent showing the message again on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
});

// Testimonial slider functionality
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const testimonialSlider = document.querySelector('.testimonial-slider');

// Auto-scroll testimonials every 5 seconds
if (testimonials.length > 1) {
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonialSlider.scrollTo({
            left: testimonials[currentTestimonial].offsetLeft,
            behavior: 'smooth'
        });
    }, 5000);
}

// Animate elements when they come into view
const animateOnScroll = () => {
    // Animate section transitions
    document.querySelectorAll('.section-transition').forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const screenPosition = window.innerHeight * 0.8;

        if (sectionTop < screenPosition) {
            section.classList.add('visible');
        }
    });

    // Animate individual elements with more detailed effects
    const elements = document.querySelectorAll('.service-card, .about-text, .team-image, .testimonial, .contact-form, .contact-info');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight * 0.85;

        if (elementPosition < screenPosition) {
            element.classList.add('animated');
        }
    });

    // Animate section headers with glitch effect
    document.querySelectorAll('.section-header h2').forEach(header => {
        const headerPosition = header.getBoundingClientRect().top;
        const screenPosition = window.innerHeight * 0.9;

        if (headerPosition < screenPosition && !header.classList.contains('glitch-active')) {
            header.classList.add('glitch-active');

            // Create glitch animation
            setTimeout(() => {
                const glitchEffect = () => {
                    header.style.textShadow = `-2px 0 var(--primary-color), 2px 0 var(--accent-color)`;
                    header.style.transform = `translateX(${Math.random() * 4 - 2}px)`;

                    setTimeout(() => {
                        header.style.textShadow = `2px 0 var(--primary-color), -2px 0 var(--accent-color)`;
                        header.style.transform = `translateX(${Math.random() * 4 - 2}px)`;

                        setTimeout(() => {
                            header.style.textShadow = `0 0 10px rgba(255, 0, 0, 0.7)`;
                            header.style.transform = 'translateX(0)';
                        }, 100);
                    }, 100);
                };

                glitchEffect();

                // Repeat glitch effect occasionally
                setInterval(() => {
                    if (Math.random() > 0.7) {
                        glitchEffect();
                    }
                }, 3000);
            }, 500);
        }
    });
};

// Set initial styles for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for element animations
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .service-card, .about-text, .team-image, .testimonial, .contact-form, .contact-info {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .service-card.animated, .about-text.animated, .team-image.animated,
        .testimonial.animated, .contact-form.animated, .contact-info.animated {
            opacity: 1;
            transform: translateY(0);
        }

        .service-card {
            transition-delay: calc(var(--card-index, 0) * 0.1s);
        }

        /* 3D Techno Elements Styles */
        .techno-element {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(255, 0, 0, 0.3);
            transform-style: preserve-3d;
            transition: transform 0.5s ease, border-color 0.5s ease;
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.1);
        }

        .techno-cube {
            width: 60px;
            height: 60px;
            transform: translateZ(30px) rotateX(45deg) rotateY(45deg);
        }

        .techno-pyramid {
            width: 0;
            height: 0;
            border-left: 40px solid transparent;
            border-right: 40px solid transparent;
            border-bottom: 70px solid rgba(0, 0, 0, 0.7);
            background-color: transparent;
            transform: translateZ(20px) rotateX(15deg);
        }

        .techno-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            transform: translateZ(10px) rotateX(65deg);
        }

        .techno-ring {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 8px solid rgba(255, 0, 0, 0.2);
            background-color: transparent;
            transform: translateZ(5px) rotateX(75deg);
        }

        .techno-line {
            width: 2px;
            height: 120px;
            background: linear-gradient(to bottom, rgba(255, 0, 0, 0.5), transparent);
            transform: translateZ(15px) rotateX(90deg);
        }

        .techno-grid {
            width: 150px;
            height: 150px;
            background-color: transparent;
            background-image:
                linear-gradient(rgba(255, 0, 0, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 0, 0, 0.2) 1px, transparent 1px);
            background-size: 15px 15px;
            transform: translateZ(0) rotateX(60deg);
        }

        .techno-text {
            color: rgba(255, 0, 0, 0.7);
            font-family: 'Courier New', monospace;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            transform: translateZ(25px);
            white-space: nowrap;
        }
    `;
    document.head.appendChild(animationStyles);

    // Set delay for service cards
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    // Create 3D techno elements for the about section
    createTechno3DElements();

    // Trigger initial animation check
    setTimeout(animateOnScroll, 300);
});

// Create 3D techno elements for the about section
function createTechno3DElements() {
    const container = document.getElementById('techno3d');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Create various 3D elements
    const elements = [
        { type: 'cube', x: '20%', y: '30%', delay: 0 },
        { type: 'pyramid', x: '70%', y: '20%', delay: 0.2 },
        { type: 'circle', x: '50%', y: '60%', delay: 0.4 },
        { type: 'ring', x: '30%', y: '70%', delay: 0.6 },
        { type: 'line', x: '80%', y: '40%', delay: 0.8 },
        { type: 'grid', x: '10%', y: '10%', delay: 1 },
        { type: 'text', x: '40%', y: '40%', text: 'cyber', delay: 1.2 },
        { type: 'text', x: '60%', y: '80%', text: 'sahali', delay: 1.4 }
    ];

    elements.forEach(el => {
        const element = document.createElement('div');
        element.className = `techno-element techno-${el.type}`;

        // Set position
        element.style.left = el.x;
        element.style.top = el.y;

        // Set animation delay
        element.style.transitionDelay = `${el.delay}s`;

        // Add text content for text elements
        if (el.type === 'text') {
            element.textContent = el.text;
        }

        // Add animation
        element.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
        element.style.animationDelay = `${Math.random() * 2}s`;

        // Add to container
        container.appendChild(element);
    });

    // Add mouse interaction
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate relative position (0 to 1)
        const relX = mouseX / rect.width;
        const relY = mouseY / rect.height;

        // Apply 3D rotation based on mouse position
        container.style.transform = `rotateY(${(relX - 0.5) * 20}deg) rotateX(${(relY - 0.5) * -10}deg)`;

        // Update elements based on mouse position
        document.querySelectorAll('.techno-element').forEach(el => {
            const depth = parseFloat(getComputedStyle(el).transform.split(',')[14] || 0);
            const moveX = (relX - 0.5) * depth * 0.5;
            const moveY = (relY - 0.5) * depth * 0.5;

            el.style.transform = el.style.transform.replace(/translateX\([^)]*\)/, '');
            el.style.transform = el.style.transform.replace(/translateY\([^)]*\)/, '');
            el.style.transform += ` translateX(${moveX}px) translateY(${moveY}px)`;

            // Change border color based on proximity to mouse
            const elRect = el.getBoundingClientRect();
            const elCenterX = elRect.left + elRect.width / 2;
            const elCenterY = elRect.top + elRect.height / 2;
            const distance = Math.sqrt(Math.pow(e.clientX - elCenterX, 2) + Math.pow(e.clientY - elCenterY, 2));

            if (distance < 100) {
                el.style.borderColor = 'rgba(255, 0, 0, 0.8)';
            } else {
                el.style.borderColor = 'rgba(255, 0, 0, 0.3)';
            }
        });
    });

    // Reset on mouse leave
    container.addEventListener('mouseleave', () => {
        container.style.transform = 'rotateY(0deg) rotateX(0deg)';

        document.querySelectorAll('.techno-element').forEach(el => {
            el.style.borderColor = 'rgba(255, 0, 0, 0.3)';
        });
    });
}

// Handle mouse movement for sparks
function handleMouseMove(e) {
    // Track mouse position for interactive sparks
    const newMouseX = e.clientX;
    const newMouseY = e.clientY;

    // Calculate speed (distance between current and last position)
    const dx = newMouseX - lastMouseX;
    const dy = newMouseY - lastMouseY;
    mouseSpeed = Math.sqrt(dx * dx + dy * dy);

    // Calculate angle
    mouseAngle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Update positions
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    mouseX = newMouseX;
    mouseY = newMouseY;

    // Set flag that mouse is moving
    isMouseMoving = true;
    clearTimeout(mouseTimeout);

    // Create sparks based on mouse speed
    if (mouseSpeed > 5) {
        // Fewer sparks for cleaner appearance
        const sparkCount = Math.min(Math.floor(mouseSpeed / 12) + 1, 3);
        for (let i = 0; i < sparkCount; i++) {
            createSparkAtPosition(mouseX, mouseY, mouseSpeed, mouseAngle);
        }
    }

    // Reset moving flag after a short delay
    mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
}

// Initialize and animate the cyber threat map and sparks
document.addEventListener('DOMContentLoaded', () => {
    initCyberThreatMap();

    // Make sure the sparks container is created and initialized
    const sparksContainer = document.getElementById('sparksContainer');
    if (sparksContainer) {
        // Create mouseFollowContainer if it doesn't exist
        if (!document.querySelector('.mouse-follow-container')) {
            const mouseFollowContainer = document.createElement('div');
            mouseFollowContainer.className = 'mouse-follow-container';
            sparksContainer.appendChild(mouseFollowContainer);
        }

        // Initialize sparks
        createSparks();
        createBackgroundParticles();

        // Add mouse tracking for interactive sparks
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mousemove', handleMouseMove);
        }
    }
});

function initCyberThreatMap() {
    const mapContainer = document.getElementById('cyberThreatMap');
    if (!mapContainer) return;

    const attackPointsContainer = mapContainer.querySelector('.attack-points');
    const attackLinesContainer = mapContainer.querySelector('.attack-lines');
    const activeThreatCount = document.getElementById('activeThreatCount');
    const blockedAttackCount = document.getElementById('blockedAttackCount');
    const threatLevel = document.getElementById('threatLevel');
    const mapTimestamp = document.getElementById('mapTimestamp');

    // Map coordinates for major cities/regions
    const locations = [
        { name: 'New York', x: 23, y: 35, importance: 5 },
        { name: 'Los Angeles', x: 16, y: 40, importance: 4 },
        { name: 'Chicago', x: 22, y: 33, importance: 3 },
        { name: 'Toronto', x: 24, y: 31, importance: 3 },
        { name: 'Mexico City', x: 20, y: 48, importance: 3 },
        { name: 'Sao Paulo', x: 31, y: 65, importance: 4 },
        { name: 'Buenos Aires', x: 29, y: 70, importance: 3 },
        { name: 'London', x: 47, y: 28, importance: 5 },
        { name: 'Paris', x: 48, y: 30, importance: 4 },
        { name: 'Berlin', x: 50, y: 27, importance: 4 },
        { name: 'Rome', x: 51, y: 33, importance: 3 },
        { name: 'Moscow', x: 57, y: 24, importance: 5 },
        { name: 'Cairo', x: 55, y: 42, importance: 3 },
        { name: 'Lagos', x: 47, y: 52, importance: 3 },
        { name: 'Johannesburg', x: 53, y: 65, importance: 3 },
        { name: 'Dubai', x: 61, y: 43, importance: 4 },
        { name: 'Mumbai', x: 65, y: 47, importance: 4 },
        { name: 'Delhi', x: 67, y: 42, importance: 4 },
        { name: 'Beijing', x: 78, y: 33, importance: 5 },
        { name: 'Shanghai', x: 80, y: 38, importance: 5 },
        { name: 'Tokyo', x: 86, y: 35, importance: 5 },
        { name: 'Seoul', x: 82, y: 33, importance: 4 },
        { name: 'Singapore', x: 74, y: 55, importance: 4 },
        { name: 'Jakarta', x: 75, y: 58, importance: 3 },
        { name: 'Sydney', x: 87, y: 68, importance: 4 }
    ];

    // Initialize counters
    let threats = 0;
    let blocked = 0;
    let totalAttacks = 0;
    let threatLevels = ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL'];
    let currentThreatLevel = 0;

    // Update timestamp
    function updateTimestamp() {
        const now = new Date();
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        mapTimestamp.textContent = `LIVE: ${hours}:${minutes}:${seconds} UTC`;
    }

    // Create permanent city markers
    function createCityMarkers() {
        locations.forEach(location => {
            const cityMarker = document.createElement('div');
            cityMarker.className = 'attack-point';
            cityMarker.style.left = `${location.x}%`;
            cityMarker.style.top = `${location.y}%`;
            cityMarker.style.width = `${3 + location.importance}px`;
            cityMarker.style.height = `${3 + location.importance}px`;
            cityMarker.style.backgroundColor = 'rgba(30, 120, 180, 0.7)';
            cityMarker.style.boxShadow = '0 0 5px rgba(30, 120, 180, 0.6)';
            cityMarker.style.opacity = '0.7';

            // Add tooltip with city name
            const tooltip = document.createElement('div');
            tooltip.className = 'city-tooltip';
            tooltip.textContent = location.name;
            tooltip.style.position = 'absolute';
            tooltip.style.top = '-20px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '2px 5px';
            tooltip.style.borderRadius = '3px';
            tooltip.style.fontSize = '10px';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.2s ease';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = '10';

            cityMarker.appendChild(tooltip);

            // Show tooltip on hover
            cityMarker.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
            });

            cityMarker.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });

            attackPointsContainer.appendChild(cityMarker);
        });
    }

    // Create an attack point
    function createAttackPoint() {
        // Select random source and target locations with weighted probability based on importance
        const sourceIndex = getWeightedRandomIndex();
        let targetIndex;
        do {
            targetIndex = getWeightedRandomIndex();
        } while (targetIndex === sourceIndex);

        const source = locations[sourceIndex];
        const target = locations[targetIndex];

        // Create source point
        const sourcePoint = document.createElement('div');
        sourcePoint.className = 'attack-point';
        sourcePoint.style.left = `${source.x}%`;
        sourcePoint.style.top = `${source.y}%`;
        sourcePoint.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
        attackPointsContainer.appendChild(sourcePoint);

        // Create attack line
        const line = document.createElement('div');
        line.className = 'attack-line';

        // Calculate line properties
        const sourceX = source.x / 100 * attackLinesContainer.offsetWidth;
        const sourceY = source.y / 100 * attackLinesContainer.offsetHeight;
        const targetX = target.x / 100 * attackLinesContainer.offsetWidth;
        const targetY = target.y / 100 * attackLinesContainer.offsetHeight;

        // Calculate distance and angle
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        // Set line properties
        line.style.width = `${distance}px`;
        line.style.left = `${sourceX}px`;
        line.style.top = `${sourceY}px`;
        line.style.transform = `rotate(${angle}deg)`;

        // Add line with animation
        line.style.opacity = '0';
        attackLinesContainer.appendChild(line);

        // Animate line
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transition = 'opacity 0.3s ease-in';

            // Update threat count
            threats++;
            totalAttacks++;
            activeThreatCount.textContent = threats;

            // Update threat level based on total attacks
            updateThreatLevel();

            // Create target point after delay
            setTimeout(() => {
                const targetPoint = document.createElement('div');
                targetPoint.className = 'attack-point';
                targetPoint.style.left = `${target.x}%`;
                targetPoint.style.top = `${target.y}%`;
                targetPoint.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
                attackPointsContainer.appendChild(targetPoint);

                // Add impact effect
                const impact = document.createElement('div');
                impact.className = 'attack-impact';
                impact.style.position = 'absolute';
                impact.style.left = `${target.x}%`;
                impact.style.top = `${target.y}%`;
                impact.style.width = '30px';
                impact.style.height = '30px';
                impact.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                impact.style.borderRadius = '50%';
                impact.style.transform = 'translate(-50%, -50%) scale(0)';
                impact.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
                impact.style.opacity = '1';
                impact.style.zIndex = '4';
                attackPointsContainer.appendChild(impact);

                // Animate impact
                setTimeout(() => {
                    impact.style.transform = 'translate(-50%, -50%) scale(3)';
                    impact.style.opacity = '0';

                    // Remove impact after animation
                    setTimeout(() => {
                        if (impact.parentNode === attackPointsContainer) {
                            attackPointsContainer.removeChild(impact);
                        }
                    }, 500);
                }, 10);

                // Update blocked count
                setTimeout(() => {
                    blocked++;
                    blockedAttackCount.textContent = blocked;

                    // Remove elements after animation
                    setTimeout(() => {
                        if (sourcePoint.parentNode === attackPointsContainer) {
                            attackPointsContainer.removeChild(sourcePoint);
                        }
                        if (targetPoint.parentNode === attackPointsContainer) {
                            attackPointsContainer.removeChild(targetPoint);
                        }
                        if (line.parentNode === attackLinesContainer) {
                            attackLinesContainer.removeChild(line);
                        }

                        // Decrease threat count
                        threats--;
                        activeThreatCount.textContent = threats;
                    }, 2000);
                }, 500);
            }, distance / 2); // Time based on distance
        }, 100);
    }

    // Get weighted random index based on city importance
    function getWeightedRandomIndex() {
        const totalWeight = locations.reduce((sum, location) => sum + location.importance, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < locations.length; i++) {
            random -= locations[i].importance;
            if (random <= 0) {
                return i;
            }
        }

        return 0; // Fallback
    }

    // Update threat level based on total attacks
    function updateThreatLevel() {
        const newLevel = Math.min(Math.floor(totalAttacks / 10), threatLevels.length - 1);

        if (newLevel !== currentThreatLevel) {
            currentThreatLevel = newLevel;
            threatLevel.textContent = threatLevels[currentThreatLevel];

            // Change color based on threat level
            if (currentThreatLevel <= 1) {
                threatLevel.style.color = 'rgba(255, 255, 255, 0.9)';
            } else if (currentThreatLevel === 2) {
                threatLevel.style.color = 'rgba(255, 255, 0, 0.9)';
            } else {
                threatLevel.style.color = 'rgba(255, 0, 0, 0.9)';
            }

            // Add flash effect on change
            threatLevel.style.transition = 'none';
            threatLevel.style.textShadow = '0 0 10px currentColor';

            setTimeout(() => {
                threatLevel.style.transition = 'text-shadow 1s ease-out';
                threatLevel.style.textShadow = '0 0 5px rgba(30, 120, 180, 0.5)';
            }, 10);
        }
    }

    // Initialize map
    updateTimestamp();
    setInterval(updateTimestamp, 1000);

    // Create city markers
    createCityMarkers();

    // Create initial attack points
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createAttackPoint();
        }, i * 800);
    }

    // Continuously create new attack points with varying frequency
    let attackInterval = 2000;

    function scheduleNextAttack() {
        const variance = Math.random() * 1000 - 500; // +/- 500ms variance
        const nextAttackTime = attackInterval + variance;

        setTimeout(() => {
            if (Math.random() > 0.2) { // 80% chance of attack
                createAttackPoint();
            }

            // Occasionally create multiple attacks at once
            if (Math.random() > 0.9) {
                setTimeout(() => createAttackPoint(), 200);
                setTimeout(() => createAttackPoint(), 400);
            }

            scheduleNextAttack();
        }, nextAttackTime);
    }

    scheduleNextAttack();

    // Add mouse interaction with optimized effects - using throttling for performance
    const handleMapMouseMove = throttle((e) => {
        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate relative position (0 to 1)
        const relX = mouseX / rect.width;
        const relY = mouseY / rect.height;

        // Simplified parallax effect on the world map - fewer transformations
        const worldMap = mapContainer.querySelector('.world-map');
        if (worldMap) {
            // Use hardware acceleration
            if (config.useHardwareAcceleration && !worldMap.style.willChange) {
                worldMap.style.willChange = 'transform';
            }

            // Simplified transform with fewer operations
            worldMap.style.transform = `translate(-50%, -50%) translateX(${(relX - 0.5) * -15}px) translateY(${(relY - 0.5) * -15}px)`;
        }

        // Simplified effect on grid - no scaling (which is expensive)
        const mapGrid = mapContainer.querySelector('.map-grid');
        if (mapGrid) {
            mapGrid.style.backgroundPosition = `${(relX - 0.5) * -5}px ${(relY - 0.5) * -5}px`;
        }

        // Add effect to pulse circles if they exist - less frequent updates
        const pulseCircles = mapContainer.querySelector('.pulse-circles');
        if (pulseCircles) {
            pulseCircles.style.transform = `translateX(${(relX - 0.5) * -8}px) translateY(${(relY - 0.5) * -8}px)`;
        }

        // Create pulse circle at cursor position very rarely
        if (Math.random() > 0.995) { // Only 0.5% chance
            createPulseCircle(relX * 100, relY * 100);
        }
    }, 50); // 50ms throttle for smoother performance

    mapContainer.addEventListener('mousemove', handleMapMouseMove);

    // Function to create pulse circles at cursor position - optimized with motion blur
    function createPulseCircle(x, y) {
        const pulseCircles = mapContainer.querySelector('.pulse-circles');
        if (!pulseCircles) return;

        // Limit the number of pulse circles to prevent lag
        if (pulseCircles.children.length > 5) {
            // If we already have 5 circles, remove the oldest one
            pulseCircles.removeChild(pulseCircles.firstChild);
        }

        const circle = document.createElement('div');
        circle.className = 'pulse-circle';
        circle.style.position = 'absolute';
        circle.style.left = `${x}%`;
        circle.style.top = `${y}%`;
        circle.style.width = '2px';
        circle.style.height = '2px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Always white for better performance
        circle.style.transform = 'translate(-50%, -50%) scale(1)';
        circle.style.opacity = '0.7';

        // Use CSS animation instead of JS-driven transitions for better performance
        circle.style.animation = 'pulse-out 1.5s ease-out forwards';

        // Add animation keyframes with motion blur if they don't exist
        if (!document.getElementById('pulse-animations')) {
            const style = document.createElement('style');
            style.id = 'pulse-animations';
            style.textContent = `
                @keyframes pulse-out {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.7;
                        filter: blur(0px);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(8);
                        opacity: 0.5;
                        filter: blur(1px); /* Add blur during fast expansion */
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(15);
                        opacity: 0;
                        filter: blur(0.5px); /* Reduce blur as it fades out */
                    }
                }
            `;
            document.head.appendChild(style);
        }

        pulseCircles.appendChild(circle);

        // Remove after animation completes
        setTimeout(() => {
            if (circle.parentNode === pulseCircles) {
                pulseCircles.removeChild(circle);
            }
        }, 1500); // Match the animation duration
    }

    // Add click interaction to create attack from clicked point
    mapContainer.addEventListener('click', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width) * 100;
        const clickY = ((e.clientY - rect.top) / rect.height) * 100;

        // Find closest city to click
        let closestCity = locations[0];
        let closestDistance = Number.MAX_VALUE;

        locations.forEach(city => {
            const dx = city.x - clickX;
            const dy = city.y - clickY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestCity = city;
            }
        });

        // Create custom attack from closest city
        const sourcePoint = document.createElement('div');
        sourcePoint.className = 'attack-point';
        sourcePoint.style.left = `${closestCity.x}%`;
        sourcePoint.style.top = `${closestCity.y}%`;
        sourcePoint.style.backgroundColor = 'rgba(255, 255, 0, 0.9)'; // Yellow for user-generated attacks
        sourcePoint.style.boxShadow = '0 0 8px rgba(255, 255, 0, 0.8)';
        attackPointsContainer.appendChild(sourcePoint);

        // Find random target
        let targetIndex;
        do {
            targetIndex = Math.floor(Math.random() * locations.length);
        } while (locations[targetIndex].name === closestCity.name);

        const target = locations[targetIndex];

        // Create attack line
        const line = document.createElement('div');
        line.className = 'attack-line';
        line.style.background = 'linear-gradient(90deg, rgba(255, 255, 0, 0.9), rgba(255, 255, 0, 0))';
        line.style.boxShadow = '0 0 5px rgba(255, 255, 0, 0.5)';

        // Calculate line properties
        const sourceX = closestCity.x / 100 * attackLinesContainer.offsetWidth;
        const sourceY = closestCity.y / 100 * attackLinesContainer.offsetHeight;
        const targetX = target.x / 100 * attackLinesContainer.offsetWidth;
        const targetY = target.y / 100 * attackLinesContainer.offsetHeight;

        // Calculate distance and angle
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        // Set line properties
        line.style.width = `${distance}px`;
        line.style.left = `${sourceX}px`;
        line.style.top = `${sourceY}px`;
        line.style.transform = `rotate(${angle}deg)`;

        // Add line with animation
        line.style.opacity = '0';
        attackLinesContainer.appendChild(line);

        // Animate line
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transition = 'opacity 0.3s ease-in';

            // Create target point after delay
            setTimeout(() => {
                const targetPoint = document.createElement('div');
                targetPoint.className = 'attack-point';
                targetPoint.style.left = `${target.x}%`;
                targetPoint.style.top = `${target.y}%`;
                targetPoint.style.backgroundColor = 'rgba(255, 255, 0, 0.9)';
                targetPoint.style.boxShadow = '0 0 8px rgba(255, 255, 0, 0.8)';
                attackPointsContainer.appendChild(targetPoint);

                // Remove elements after animation
                setTimeout(() => {
                    if (sourcePoint.parentNode === attackPointsContainer) {
                        attackPointsContainer.removeChild(sourcePoint);
                    }
                    if (targetPoint.parentNode === attackPointsContainer) {
                        attackPointsContainer.removeChild(targetPoint);
                    }
                    if (line.parentNode === attackLinesContainer) {
                        attackLinesContainer.removeChild(line);
                    }
                }, 3000);
            }, distance / 2);
        }, 100);
    });
}

// Listen for scroll events to trigger animations
window.addEventListener('scroll', animateOnScroll);

// Service Issue Reporting System
document.addEventListener('DOMContentLoaded', () => {
    // Get all modals and buttons
    const reportButtons = document.querySelectorAll('.btn-report');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const successModal = document.getElementById('successModal');
    const closeSuccessButton = document.querySelector('.close-success');

    // Open modal when report button is clicked
    reportButtons.forEach(button => {
        button.addEventListener('click', () => {
            const service = button.getAttribute('data-service');
            const modal = document.getElementById(`${service}Modal`);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    // Close modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            }
        });
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            }
        });
    });

    // Close success modal
    if (closeSuccessButton) {
        closeSuccessButton.addEventListener('click', () => {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }

    // Handle form submissions - now using Formspree
    const issueForms = document.querySelectorAll('.issue-form');
    issueForms.forEach(form => {
        // We're now using Formspree's direct form submission
        // No need to prevent default or handle submission manually

        // Just add a reference number generator for the success modal
        form.addEventListener('submit', () => {
            // Generate a reference number to display in the success modal
            // This will be shown when the user returns from Formspree
            const service = form.getAttribute('data-service');
            const prefix = service.substring(0, 3).toUpperCase();
            const timestamp = Date.now().toString().substring(7);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

            // Store the reference number in localStorage to retrieve after redirect
            localStorage.setItem('lastReferenceNumber', `${prefix}-${timestamp}-${random}`);

            // Close the current modal after a short delay
            setTimeout(() => {
                const currentModal = form.closest('.modal');
                if (currentModal) {
                    currentModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }, 500);
        });
    });
});

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= (sectionTop - 100)) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});
// Appointment Booking System - Day Selection
document.addEventListener('DOMContentLoaded', function() {
    const monthSelect = document.getElementById('appointmentMonth');
    const daySelect = document.getElementById('appointmentDay');
    
    if (monthSelect && daySelect) {
        // Update days when month changes
        monthSelect.addEventListener('change', updateDays);
        
        // Initial days population
        updateDays();
    }
    
    // Check for appointment success message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('appointment_success') && urlParams.get('appointment_success') === 'true') {
        alert('Thank you for booking your appointment! We will contact you shortly to confirm the details.');
        // Remove the parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
    
    // Function to update days based on selected month
    function updateDays() {
        if (!monthSelect || !daySelect) return;
        
        const month = monthSelect.value;
        
        // Clear existing options
        daySelect.innerHTML = '<option value="" disabled selected>Select Day</option>';
        
        if (!month) return;
        
        // Get number of days in the selected month
        let daysInMonth;
        const currentYear = new Date().getFullYear();
        
        if (month === 'February') {
            // Check for leap year
            daysInMonth = ((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0) ? 29 : 28;
        } else if (['April', 'June', 'September', 'November'].includes(month)) {
            daysInMonth = 30;
        } else {
            daysInMonth = 31;
        }
        
        // Add day options
        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            daySelect.appendChild(option);
        }
    }
});