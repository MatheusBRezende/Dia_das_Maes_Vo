document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const entrance = document.getElementById('entrance');
    const mural = document.getElementById('mural');
    const continueButton = document.getElementById('continue-button');
    const backButton = document.getElementById('back-button');
    const photoItems = document.querySelectorAll('.photo-item');
    const messageCard = document.querySelector('.message-card');
    const musicControl = document.querySelector('.music-control');
    const backgroundMusic = document.getElementById('background-music');
    
    // Music state
    let musicEnabled = false;
    let musicInitialized = false;
    
    // Create hearts immediately
    createFloatingHearts();
    
    // Preload images
    preloadImages();
    
    // Continue button click event
    continueButton.addEventListener('click', function() {
        entrance.classList.add('hidden');
        mural.classList.remove('hidden');
        
        // Animate photo items as they come into view
        setTimeout(() => {
            animateOnScroll();
            window.addEventListener('scroll', animateOnScroll);
        }, 500);
    });

    setTimeout(() => {
        continueButton.classList.add('visible');
    }, 3000);
    
    // Back button click event
    backButton.addEventListener('click', function() {
        mural.classList.add('hidden');
        entrance.classList.remove('hidden');
        window.history.pushState(null, null, window.location.pathname);
    });
    
    // Music control click event
    musicControl.addEventListener('click', function() {
        if (!musicInitialized) {
            backgroundMusic.volume = 0.5;
            musicInitialized = true;
        }
        
        musicEnabled = !musicEnabled;
        
        if (musicEnabled) {
            backgroundMusic.play().then(() => {
                updateMusicUI();
            }).catch(e => {
                musicControl.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Toque 2x</span>';
                musicControl.addEventListener('click', enableMusicAfterInteraction, { once: true });
            });
        } else {
            backgroundMusic.pause();
            updateMusicUI();
        }
    });
    
    function enableMusicAfterInteraction() {
        backgroundMusic.play();
        musicEnabled = true;
        updateMusicUI();
    }
    
    function updateMusicUI() {
        musicControl.innerHTML = musicEnabled 
            ? '<i class="fas fa-music"></i><span>Música ON</span>' 
            : '<i class="fas fa-music"></i><span>Música OFF</span>';
    }
    
    // Floating hearts creation
    function createFloatingHearts() {
        const heartsContainer = document.querySelector('.floating-hearts');
        const heartCount = 55;
        
        heartsContainer.innerHTML = '';
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z"></path></svg>';
            
            const size = Math.random() * 30 + 20;
            const posX = Math.random() * 100;
            const delay = Math.random() * 1;
            const duration = Math.random() * 15 + 10;
            const opacity = Math.random() * 0.5 + 0.3;
            
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.left = `${posX}%`;
            heart.style.bottom = `-${size}px`;
            heart.style.animationDelay = `${delay}s`;
            heart.style.animationDuration = `${duration}s`;
            heart.style.opacity = opacity;
            
            const animationType = Math.random() > 0.5 ? 'float' : 'floatReverse';
            heart.style.animationName = animationType;
            
            heartsContainer.appendChild(heart);
        }
    }
    
    // Scroll animation function
    function animateOnScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        photoItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 150);
            }
        });
        
        if (messageCard.getBoundingClientRect().top < triggerBottom) {
            messageCard.classList.add('visible');
        }
    }
    
    // Preload images
    function preloadImages() {
        document.querySelectorAll('img').forEach(img => {
            if (img.complete) markAsLoaded(img);
            else img.addEventListener('load', () => markAsLoaded(img));
        });
    }
    
    function markAsLoaded(img) {
        const container = img.closest('.photo-container');
        if (container) container.classList.add('loaded');
    }
    
    // Initialize scroll animation
    setTimeout(() => {
        animateOnScroll();
        window.addEventListener('scroll', animateOnScroll);
    }, 500);
    
    // Prevent context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Ensure fonts are loaded
    document.fonts.ready.then(() => {
        document.querySelector('.entrance-message').style.visibility = 'visible';
    });
});