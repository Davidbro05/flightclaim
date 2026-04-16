(function () {
  var depInput = document.getElementById('hero-departure');
  var arrInput = document.getElementById('hero-arrival');
  var btn      = document.querySelector('.hero-check-btn');
  if (!btn) return;

  // Stores selected IATA codes (set by autocomplete)
  var depIata = null;
  var arrIata = null;

  // Extract IATA from "Name (ARN)" or plain "ARN"
  function getIata(input, stored) {
    var val = (input.value || '').trim();
    if (stored) return stored;
    var m = val.match(/\(([A-Z]{3})\)$/);
    return m ? m[1] : val.toUpperCase();
  }

  btn.addEventListener('click', function () {
    var dep = getIata(depInput, depIata);
    var arr = getIata(arrInput, arrIata);
    var url = '/anmalan';
    var params = [];
    if (dep) params.push('dep=' + encodeURIComponent(dep));
    if (arr) params.push('arr=' + encodeURIComponent(arr));
    if (params.length) url += '?' + params.join('&');
    window.location.href = url;
  });

  // ── Autocomplete ─────────────────────────────────────────────────────────
  function searchAirports(airports, query) {
    if (!query || query.length < 2) return [];
    var q = query.toLowerCase();
    return airports.filter(function (a) {
      return a[0].toLowerCase().startsWith(q) ||
             a[1].toLowerCase().includes(q);
    }).slice(0, 8);
  }

  function renderDropdown(results, dropEl, onSelect) {
    dropEl.innerHTML = '';
    if (!results.length) { dropEl.classList.remove('open'); return; }
    results.forEach(function (a) {
      var item = document.createElement('div');
      item.className = 'airport-option';
      item.innerHTML = '<span class="iata">' + a[0] + '</span> <span class="aname">' + a[1] + '</span>';
      item.addEventListener('mousedown', function (e) {
        e.preventDefault();
        onSelect(a);
      });
      dropEl.appendChild(item);
    });
    dropEl.classList.add('open');
  }

  function setupAutocomplete(inputEl, dropEl, airports, onSelect) {
    inputEl.addEventListener('input', function () {
      renderDropdown(searchAirports(airports, this.value), dropEl, function (a) {
        inputEl.value = a[1] + ' (' + a[0] + ')';
        dropEl.classList.remove('open');
        onSelect(a);
      });
    });
    inputEl.addEventListener('blur', function () {
      setTimeout(function () { dropEl.classList.remove('open'); }, 150);
    });
    inputEl.addEventListener('focus', function () {
      if (this.value.length >= 2) {
        renderDropdown(searchAirports(airports, this.value), dropEl, function (a) {
          inputEl.value = a[1] + ' (' + a[0] + ')';
          dropEl.classList.remove('open');
          onSelect(a);
        });
      }
    });
  }

  fetch('/data/airports.json')
    .then(function (r) { return r.json(); })
    .then(function (airports) {
      var depDrop = document.getElementById('hero-dep-drop');
      var arrDrop = document.getElementById('hero-arr-drop');
      if (!depDrop || !arrDrop) return;
      setupAutocomplete(depInput, depDrop, airports, function (a) { depIata = a[0]; });
      setupAutocomplete(arrInput, arrDrop, airports, function (a) { arrIata = a[0]; });
    })
    .catch(function () { /* autocomplete ej tillgänglig — knappen fungerar ändå */ });
})();
