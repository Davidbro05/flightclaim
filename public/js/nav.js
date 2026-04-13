(function () {
  // Hamburger menu toggle
  const btn = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-menu');

  if (btn && menu) {
    btn.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
