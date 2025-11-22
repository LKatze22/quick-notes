// Quick Notes Navigation Bar JS (matching To-do list)

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu .close-btn');

  if (menuToggle && mobileMenu && closeBtn) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    closeBtn.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
    // Optional: close menu on link click (for SPA feel)
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Theme toggle (if present)
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('light-theme');
      // Save preference if desired
      if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('qn_theme', 'light');
      } else {
        localStorage.setItem('qn_theme', 'dark');
      }
    });
    // On load, set theme
    if (localStorage.getItem('qn_theme') === 'light') {
      document.body.classList.add('light-theme');
    }
  }
});
