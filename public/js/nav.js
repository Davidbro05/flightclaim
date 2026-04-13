(function () {
  // ── Hamburger menu toggle ──────────────────────────────────────────────────
  const btn  = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-menu');

  if (btn && menu) {
    btn.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        closeAllDropdowns();
      }
    });

    // Close menu when a regular link (not dropdown trigger) is clicked
    menu.querySelectorAll('a').forEach(function (link) {
      if (link.closest('.has-dropdown') && link.parentElement.classList.contains('has-dropdown')) return;
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Dropdown toggles (mobile only) ────────────────────────────────────────
  function closeAllDropdowns(except) {
    document.querySelectorAll('.has-dropdown.open').forEach(function (el) {
      if (el !== except) {
        el.classList.remove('open');
        const trigger = el.querySelector('[aria-expanded]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      // Only intercept on mobile
      if (window.innerWidth > 768) return;
      e.preventDefault();
      const parent = link.closest('.has-dropdown');
      const isOpen = parent.classList.toggle('open');
      link.setAttribute('aria-expanded', isOpen);
      if (isOpen) closeAllDropdowns(parent);
    });
  });
})();
