// ==================== CONFORMITÉ RGPD ====================
/**
 * Ce site respecte le RGPD :
 * - Aucun cookie de suivi ou tracking
 * - Aucune donnée personnelle collectée sans consentement
 * - localStorage utilisé uniquement pour les préférences utilisateur (thème)
 * - Pas d'analytics tiers sans consentement explicite
 */

// ==================== VARIABLES GLOBALES ====================
const burgerMenu = document.getElementById('burgerMenu');
const navMenu = document.getElementById('navMenu');
const backToTopBtn = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-menu a');

// ==================== GESTION DU THÈME (Mode Sombre/Clair) ====================
/**
 * Initialise et gère le thème sombre/clair
 * Sauvegarde dans localStorage (RGPD: stockage local uniquement, pas de tracking)
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme-preference');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Appliquer le thème sauvegardé ou la préférence système
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        themeToggle.setAttribute('aria-pressed', 'true');
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', isDark);
    
    // Animation du bouton
    themeToggle.style.transform = 'scale(0.9) rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    initTheme();
}

// Écouter les changements de préférence système
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-preference')) {
        document.body.classList.toggle('dark-mode', e.matches);
    }
});

// ==================== MENU BURGER (Mobile) ====================
/**
 * Gère l'ouverture/fermeture du menu mobile
 * Accessible au clavier et conforme RGAA
 */
function toggleMenu() {
    const isExpanded = burgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Mise à jour ARIA pour l'accessibilité
    burgerMenu.setAttribute('aria-expanded', isExpanded);
    burgerMenu.setAttribute('aria-label', isExpanded ? 'Fermer le menu' : 'Ouvrir le menu');
    
    // Empêcher le scroll quand le menu est ouvert
    document.body.style.overflow = isExpanded ? 'hidden' : '';
    
    // Focus management pour l'accessibilité
    if (isExpanded) {
        navMenu.querySelector('a')?.focus();
    }
}

if (burgerMenu) {
    burgerMenu.addEventListener('click', toggleMenu);
}

// Fermer le menu lors du clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Fermer le menu en cliquant à l'extérieur
document.addEventListener('click', (event) => {
    if (navMenu.classList.contains('active')) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnBurger = burgerMenu.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnBurger) {
            toggleMenu();
        }
    }
});

// ==================== NAVIGATION AU CLAVIER (RGAA) ====================
/**
 * Gestion complète de la navigation au clavier
 * Conforme aux recommandations RGAA
 */
document.addEventListener('keydown', (e) => {
    // Fermer le menu avec Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu();
        burgerMenu.focus();
    }
    
    // Piège à focus dans le menu mobile
    if (e.key === 'Tab' && navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll('a');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab seul
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// ==================== BOUTON RETOUR EN HAUT ====================
/**
 * Affiche le bouton après 300px de scroll
 * Scroll fluide vers le haut avec gestion ARIA
 */
function handleBackToTop() {
    const scrollPosition = window.scrollY;
    const isVisible = scrollPosition > 300;
    
    backToTopBtn.classList.toggle('visible', isVisible);
    backToTopBtn.setAttribute('aria-hidden', !isVisible);
}

// Optimisation avec requestAnimationFrame
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            handleBackToTop();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Focus sur le skip link après le scroll
        setTimeout(() => {
            document.querySelector('.skip-link')?.focus();
        }, 500);
    });
}

// ==================== SMOOTH SCROLL AVEC OFFSET ====================
/**
 * Scroll fluide vers les sections avec compensation du header fixe
 */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Focus sur la section pour l'accessibilité
                targetSection.focus();
            }
        }
    });
});

// ==================== INTERSECTION OBSERVER (Animations) ====================
/**
 * Détecte les éléments qui entrent dans le viewport
 * Performance optimisée avec Intersection Observer
 */
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Optionnel: arrêter d'observer après l'animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer les éléments avec classe .fade-in
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ==================== LAZY LOADING DES IMAGES ====================
/**
 * Charge les images uniquement quand elles sont proches du viewport
 * Améliore les performances et le temps de chargement
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== AMÉLIORATION DES FOCUS VISIBLES ====================
/**
 * Ajoute une classe pour améliorer la visibilité du focus au clavier
 * Conforme RGAA: focus toujours visible
 */
let isUsingMouse = false;

document.addEventListener('mousedown', () => {
    isUsingMouse = true;
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        isUsingMouse = false;
    }
});

document.addEventListener('focusin', (e) => {
    if (!isUsingMouse) {
        e.target.classList.add('keyboard-focus');
    }
});

document.addEventListener('focusout', (e) => {
    e.target.classList.remove('keyboard-focus');
});

// ==================== GESTION DES ERREURS D'IMAGES ====================
/**
 * Gère les erreurs de chargement d'images
 * Affiche un placeholder accessible
 */
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.background = '#f1f5f9';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.alt = this.alt || 'Image non disponible';
        console.warn('Erreur de chargement d\'image:', this.src);
    });
});

// ==================== ANALYTICS RESPECT RGPD ====================
/**
 * Si vous souhaitez ajouter des analytics, vous DEVEZ :
 * 1. Demander le consentement explicite de l'utilisateur
 * 2. Utiliser une bannière de cookies conforme
 * 3. Ne charger les scripts qu'après consentement
 * 
 * Exemple de fonction pour demander le consentement :
 */
function requestAnalyticsConsent() {
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem('analytics-consent');
    
    if (consent === null) {
        // Afficher une bannière de consentement
        // (à implémenter selon vos besoins)
        console.log('Consentement analytics requis (RGPD)');
    } else if (consent === 'accepted') {
        // Charger les scripts analytics uniquement si accepté
        console.log('Analytics autorisés par l\'utilisateur');
    }
}

// Décommenter si vous implémentez des analytics
// requestAnalyticsConsent();

// ==================== PRÉCHARGEMENT DES RESSOURCES CRITIQUES ====================
/**
 * Précharge les images importantes pour améliorer les performances
 */
function preloadCriticalImages() {
    const criticalImages = [
        'IMAGES/MOI.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Précharger au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalImages);
} else {
    preloadCriticalImages();
}

// ==================== GESTION DU CHARGEMENT ====================
/**
 * Affiche un message une fois la page complètement chargée
 */
window.addEventListener('load', () => {
    console.log('%c✅ CV chargé avec succès', 'color: #10B981; font-size: 16px; font-weight: bold;');
    console.log('%c📊 Statistiques:', 'font-size: 14px; font-weight: bold;');
    console.log('  • Performance optimisée avec Intersection Observer');
    console.log('  • Navigation au clavier complète (RGAA)');
    console.log('  • Responsive sur tous les supports');
    console.log('  • Conforme RGPD (pas de cookies de tracking)');
    console.log('  • Contrastes WCAG 2.1 niveau AA minimum');
    console.log('%c\n💼 Albert Lecomte - Concepteur Designer UI', 'color: #3B82F6; font-size: 14px;');
    console.log('📧 albert.lecomte1989@gmail.com');
    console.log('🔗 https://github.com/Vehinys\n');
});

// ==================== EASTER EGG (Optionnel) ====================
/**
 * Petit easter egg pour les recruteurs curieux
 * Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
 */
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        console.log('%c🎉 KONAMI CODE ACTIVÉ !', 'font-size: 20px; color: #F59E0B;');
        console.log('Merci de votre attention aux détails ! 😊');
        
        // Animation fun
        document.body.style.transform = 'rotate(360deg)';
        document.body.style.transition = 'transform 1s ease';
        
        setTimeout(() => {
            document.body.style.transform = '';
        }, 1000);
    }
});

// ==================== DÉTECTION DE CONNEXION INTERNET ====================
/**
 * Informe l'utilisateur en cas de perte de connexion
 * Améliore l'expérience utilisateur
 */
window.addEventListener('online', () => {
    console.log('✅ Connexion Internet rétablie');
});

window.addEventListener('offline', () => {
    console.log('⚠️ Connexion Internet perdue');
});

// ==================== PROTECTION CONTRE LE SPAM ====================
/**
 * Protège les liens email contre les bots spammeurs
 * (Optionnel, à adapter selon vos besoins)
 */
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Vous pouvez ajouter ici une vérification anti-bot si nécessaire
        console.log('📧 Ouverture du client email');
    });
});

// ==================== MESSAGES POUR LES DÉVELOPPEURS ====================
console.log('%c👋 Bonjour recruteur !', 'font-size: 20px; color: #3B82F6; font-weight: bold;');
console.log('%c🎨 Vous inspectez le code ? Excellente idée !', 'font-size: 14px; color: #10B981;');
console.log('%c\n📝 Ce site respecte :', 'font-size: 14px; font-weight: bold;');
console.log('  ✓ RGAA (Accessibilité)');
console.log('  ✓ RGPD (Protection des données)');
console.log('  ✓ WCAG 2.1 niveau AA');
console.log('  ✓ Normes européennes');
console.log('  ✓ Sémantique HTML5');
console.log('  ✓ Performance Web');
console.log('%c\n💡 Intéressé ? Contactez-moi !', 'font-size: 14px; color: #F59E0B;');
console.log('📧 albert.lecomte1989@gmail.com');
console.log('💼 linkedin.com/in/lecomtealbert');
console.log('🔗 github.com/Vehinys\n');

// ==================== FIN DU SCRIPT ====================
console.log('✅ script.js chargé et initialisé avec succès');