(function () {
  // Save affiliate code from URL to cookie
  var urlParams = new URLSearchParams(window.location.search);
  var ref = urlParams.get('ref');
  if (ref) {
    document.cookie = 'affiliate_code=' + encodeURIComponent(ref) + '; max-age=2592000; path=/';
  }

  // Terms modal
  var modal = document.getElementById('termsModal');
  var links = document.querySelectorAll('#showTermsLink, #showTermsLinkInline');
  var closeBtn = document.querySelector('.close');

  if (modal && closeBtn) {
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    });
    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    window.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Show/hide rebooked extra fields
  var issueSelect = document.getElementById('issueSelect');
  var rebookedFields = document.getElementById('rebooked-fields');
  var originalRouteInput = document.getElementById('originalRoute');
  var newRouteInput = document.getElementById('newRoute');
  var changeNoticeSelect = document.getElementById('changeNotice');

  function toggleRebookedFields() {
    var isRebooked = issueSelect && issueSelect.value === 'rebooked';
    if (rebookedFields) rebookedFields.style.display = isRebooked ? 'block' : 'none';
    if (originalRouteInput) originalRouteInput.required = isRebooked;
    if (newRouteInput) newRouteInput.required = isRebooked;
    if (changeNoticeSelect) changeNoticeSelect.required = isRebooked;
  }

  if (issueSelect) {
    issueSelect.addEventListener('change', toggleRebookedFields);
    toggleRebookedFields();
  }

  // Signature Pad
  var canvas = document.getElementById('signature-pad');
  if (canvas) {
    var container = canvas.parentElement;

    function resizeCanvas() {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      if (window.signaturePad) {
        var data = window.signaturePad.toData();
        window.signaturePad.clear();
        window.signaturePad.fromData(data);
      }
    }

    window.signaturePad = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255,255,255)',
      penColor: 'rgb(0,0,0)',
      minWidth: 0.5,
      maxWidth: 2.5,
      throttle: 0,
      dotSize: 1,
      velocityFilterWeight: 0.7,
    });

    document.getElementById('clear-signature').addEventListener('click', function () {
      window.signaturePad.clear();
    });

    var form = document.getElementById('claimForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        if (window.signaturePad.isEmpty()) {
          alert('Du måste rita din signatur för att slutföra ansökan.');
          e.preventDefault();
          return;
        }
        document.getElementById('signature-input').value = window.signaturePad.toDataURL();
      });
    }

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    });
    setTimeout(resizeCanvas, 10);
  }

  // ── Generisk autocomplete-hjälp ─────────────────────────────────────────
  function renderDropdown(results, dropEl, labelFn, onSelect) {
    dropEl.innerHTML = '';
    if (!results.length) { dropEl.classList.remove('open'); return; }
    results.forEach(function (a) {
      var item = document.createElement('div');
      item.className = 'airport-option';
      item.innerHTML = labelFn(a);
      item.addEventListener('mousedown', function (e) {
        e.preventDefault();
        onSelect(a);
      });
      dropEl.appendChild(item);
    });
    dropEl.classList.add('open');
  }

  function setupAutocomplete(inputEl, dropEl, searchFn, labelFn, valueFn) {
    function doSearch() {
      renderDropdown(searchFn(inputEl.value), dropEl, labelFn, function (a) {
        inputEl.value = valueFn(a);
        dropEl.classList.remove('open');
      });
    }
    inputEl.addEventListener('input', doSearch);
    inputEl.addEventListener('focus', function () { if (this.value.length >= 2) doSearch(); });
    inputEl.addEventListener('blur',  function () { setTimeout(function () { dropEl.classList.remove('open'); }, 150); });
  }

  // ── Flygplats-autocomplete ───────────────────────────────────────────────
  var depInput  = document.getElementById('form-dep-input');
  var depDrop   = document.getElementById('form-dep-drop');
  var arrInput  = document.getElementById('form-arr-input');
  var arrDrop   = document.getElementById('form-arr-drop');

  if (depInput && arrInput) {
    fetch('/data/airports.json')
      .then(function (r) { return r.json(); })
      .then(function (airports) {
        function searchAirports(query) {
          if (!query || query.length < 2) return [];
          var q = query.toLowerCase();
          return airports.filter(function (a) {
            return a[0].toLowerCase().startsWith(q) || a[1].toLowerCase().includes(q);
          }).slice(0, 8);
        }
        var airportLabel = function (a) { return '<span class="iata">' + a[0] + '</span> <span class="aname">' + a[1] + '</span>'; };
        var airportValue = function (a) { return a[1] + ' (' + a[0] + ')'; };
        setupAutocomplete(depInput, depDrop, searchAirports, airportLabel, airportValue);
        setupAutocomplete(arrInput, arrDrop, searchAirports, airportLabel, airportValue);
      })
      .catch(function () {});
  }

  // ── Flygbolag-autocomplete ───────────────────────────────────────────────
  var airlineInput = document.getElementById('form-airline-input');
  var airlineDrop  = document.getElementById('form-airline-drop');

  if (airlineInput) {
    fetch('/data/airlines.json')
      .then(function (r) { return r.json(); })
      .then(function (airlines) {
        function searchAirlines(query) {
          if (!query || query.length < 2) return [];
          var q = query.toLowerCase();
          return airlines.filter(function (a) {
            return a[0].toLowerCase().startsWith(q) || a[1].toLowerCase().includes(q);
          }).slice(0, 8);
        }
        var airlineLabel = function (a) { return '<span class="iata">' + a[0] + '</span> <span class="aname">' + a[1] + '</span>'; };
        var airlineValue = function (a) { return a[1]; };
        setupAutocomplete(airlineInput, airlineDrop, searchAirlines, airlineLabel, airlineValue);
      })
      .catch(function () {});
  }
})();
