(function () {
  const btn       = document.querySelector('.nav-hamburger');
  const drawer    = document.getElementById('nav-drawer');
  const mainPanel = document.getElementById('nav-panel-main');

  // ── Helpers ────────────────────────────────────────────────────────────────
  function resetPanels() {
    if (mainPanel) mainPanel.classList.remove('slide-out');
    document.querySelectorAll('.nav-panel-sub').forEach(function (p) {
      p.classList.remove('slide-in');
    });
  }

  function closeDrawer() {
    if (drawer)  { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
    if (btn)     { btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    setTimeout(resetPanels, 280);
  }

  // ── Hamburger toggle ───────────────────────────────────────────────────────
  if (btn && drawer) {
    btn.addEventListener('click', function () {
      const isOpen = drawer.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      drawer.setAttribute('aria-hidden', String(!isOpen));
      if (!isOpen) setTimeout(resetPanels, 280);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!drawer.classList.contains('open')) return;
      if (!btn.contains(e.target) && !drawer.contains(e.target)) closeDrawer();
    });
  }

  // ── Sub-panel: open ────────────────────────────────────────────────────────
  document.querySelectorAll('.nav-drawer-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const target = document.getElementById(trigger.dataset.target);
      if (!target || !mainPanel) return;
      mainPanel.classList.add('slide-out');
      target.classList.add('slide-in');
    });
  });

  // ── Sub-panel: back ────────────────────────────────────────────────────────
  document.querySelectorAll('.nav-panel-back').forEach(function (backBtn) {
    backBtn.addEventListener('click', function () {
      const sub = backBtn.closest('.nav-panel-sub');
      if (!sub || !mainPanel) return;
      sub.classList.remove('slide-in');
      mainPanel.classList.remove('slide-out');
    });
  });

  // ── Close drawer on any link click ────────────────────────────────────────
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });
  }

  // ── Desktop dropdowns (hover — only active above 768px) ───────────────────
  document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth > 768) return;
      e.preventDefault();
    });
  });
})();
