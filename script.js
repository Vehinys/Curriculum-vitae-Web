/**
 * BURGER MENU - Gestion du menu responsive
 * Fichier: burger-menu.js
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  // Sélection des éléments
  const burgerBtn = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('nav ul');
  const navLinks = document.querySelectorAll('nav ul li a');
  const body = document.body;

  // Vérifier que les éléments existent
  if (!burgerBtn || !navMenu) {
    console.warn('Éléments du menu burger non trouvés');
    return;
  }

  /**
   * Toggle le menu burger
   */
  const toggleMenu = () => {
    burgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Empêcher le scroll quand le menu est ouvert
    if (navMenu.classList.contains('active')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  };

  /**
   * Fermer le menu
   */
  const closeMenu = () => {
    burgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
    body.style.overflow = '';
  };

  // Event listener sur le bouton burger
  burgerBtn.addEventListener('click', toggleMenu);

  // Fermer le menu quand on clique sur un lien
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Fermer le menu si on clique en dehors
  document.addEventListener('click', (e) => {
    const isClickInsideNav = navMenu.contains(e.target);
    const isClickOnBurger = burgerBtn.contains(e.target);
    
    if (!isClickInsideNav && !isClickOnBurger && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Fermer le menu avec la touche Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Fermer le menu si on redimensionne vers desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
});