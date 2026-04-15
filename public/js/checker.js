(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────────
  var airports = [];
  var from = null;
  var to   = null;
  var currentStep = 1;

  // ── Haversine distance (km) ────────────────────────────────────────────────
  function deg2rad(d) { return d * Math.PI / 180; }
  function calcDistance(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  // ── EU261 beräkning ────────────────────────────────────────────────────────
  function calcEU261(distKm, issueType, delayBracket, noticeBracket) {
    var base = distKm < 1500 ? 250 : distKm <= 3500 ? 400 : 600;

    if (issueType === 'delay') {
      // delayBracket: 'under3' | '3to4' | 'over4'
      if (delayBracket === 'under3') {
        return { eligible: false, amount: 0, reason: 'Förseningen var under 3 timmar — tyvärr ger det ingen rätt till kompensation.' };
      }
      if (delayBracket === '3to4' && distKm > 3500) {
        return { eligible: false, amount: 0, reason: 'För flygsträckor över 3 500 km krävs minst 4 timmars försening för ersättning.' };
      }
      return { eligible: true, amount: base };
    }

    if (issueType === 'cancelled') {
      // noticeBracket: 'over14' | '7to14' | 'under7'
      if (noticeBracket === 'over14') {
        return { eligible: false, amount: 0, reason: 'Fick du besked mer än 14 dagar i förväg ger det ingen kompensationsrätt — men du har rätt till återbetalning.' };
      }
      if (noticeBracket === '7to14') {
        return { eligible: true, amount: Math.round(base * 0.5), partial: true };
      }
      return { eligible: true, amount: base };
    }

    if (issueType === 'denied') {
      return { eligible: true, amount: base };
    }

    return { eligible: false, amount: 0 };
  }

  // ── Autocomplete ───────────────────────────────────────────────────────────
  function searchAirports(query) {
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

  function setupAutocomplete(inputEl, dropEl, onSelect) {
    inputEl.addEventListener('input', function () {
      var results = searchAirports(this.value);
      renderDropdown(results, dropEl, function (a) {
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
        var results = searchAirports(this.value);
        renderDropdown(results, dropEl, function (a) {
          inputEl.value = a[1] + ' (' + a[0] + ')';
          dropEl.classList.remove('open');
          onSelect(a);
        });
      }
    });
  }

  // ── Steg-navigering ────────────────────────────────────────────────────────
  function showStep(n) {
    document.querySelectorAll('.checker-step').forEach(function (el) {
      el.classList.remove('active');
    });
    var target = document.querySelector('.checker-step[data-step="' + n + '"]');
    if (target) { target.classList.add('active'); }
    document.querySelectorAll('.step-dot').forEach(function (dot) {
      var s = parseInt(dot.dataset.step);
      dot.classList.toggle('done',    s < n);
      dot.classList.toggle('current', s === n);
    });
    currentStep = n;
  }

  function getSelected(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }

  // ── Visa resultat ──────────────────────────────────────────────────────────
  function showResult() {
    var issue       = getSelected('issue');
    var delay       = getSelected('delay');
    var notice      = getSelected('notice');
    var distKm      = from && to ? Math.round(calcDistance(from[2], from[3], to[2], to[3])) : 0;
    var result      = calcEU261(distKm, issue, delay, notice);

    var box = document.getElementById('result-box');
    var anmalanUrl = '/anmalan';
    if (from && to) {
      anmalanUrl += '?dep=' + encodeURIComponent(from[0]) + '&arr=' + encodeURIComponent(to[0]);
    }

    if (result.eligible) {
      var label = distKm < 1500 ? 'Under 1 500 km' : distKm <= 3500 ? '1 500–3 500 km' : 'Över 3 500 km';
      box.innerHTML =
        '<div class="result-eligible">' +
          '<div class="result-icon">✓</div>' +
          '<h2>Du kan ha rätt till ' + (result.partial ? 'upp till ' : '') + '<strong>' + result.amount + ' €</strong> per person</h2>' +
          '<p class="result-sub">Flygsträcka: ca ' + distKm.toLocaleString('sv-SE') + ' km (' + label + ')' +
          (result.partial ? '<br>Reducerad ersättning — besked 7–14 dagar i förväg.' : '') + '</p>' +
          '<p class="result-disclaimer">Observera att force majeure och andra undantag kan påverka rätten till ersättning. Vi granskar varje ärende individuellt.</p>' +
          '<a href="' + anmalanUrl + '" class="btn-cta result-cta">Ansök om ersättning — kostnadsfritt →</a>' +
          '<p class="result-fine">Vi tar bara betalt om du vinner. Ingen risk.</p>' +
        '</div>';
    } else {
      box.innerHTML =
        '<div class="result-not-eligible">' +
          '<div class="result-icon result-icon--no">✗</div>' +
          '<h2>Tyvärr verkar du inte ha rätt till kompensation</h2>' +
          '<p class="result-sub">' + (result.reason || '') + '</p>' +
          '<p class="result-disclaimer">Är du osäker? Kontakta oss så tittar vi på ditt ärende utan kostnad.</p>' +
          '<a href="/kontakt" class="btn-secondary">Kontakta oss</a>' +
        '</div>';
    }

    showStep(4);
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    var fromInput = document.getElementById('dep-input');
    var fromDrop  = document.getElementById('dep-drop');
    var toInput   = document.getElementById('arr-input');
    var toDrop    = document.getElementById('arr-drop');
    if (!fromInput) return;

    setupAutocomplete(fromInput, fromDrop, function (a) { from = a; updateStep1Btn(); });
    setupAutocomplete(toInput,  toDrop,   function (a) { to   = a; updateStep1Btn(); });

    function updateStep1Btn() {
      var btn = document.getElementById('step1-next');
      if (btn) btn.disabled = !(from && to && from[0] !== to[0]);
    }

    document.getElementById('step1-next').addEventListener('click', function () {
      if (!from || !to) return;
      showStep(2);
    });

    // Steg 2 — välj typ av problem
    document.querySelectorAll('.issue-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var val = this.dataset.value;
        document.querySelectorAll('.issue-card').forEach(function (c) { c.classList.remove('selected'); });
        this.classList.add('selected');
        document.getElementById('issue-' + val).checked = true;

        // Visa rätt steg 3
        setTimeout(function () {
          if (val === 'delay') {
            showStep(3);
            document.getElementById('step3-delay').style.display = '';
            document.getElementById('step3-cancelled').style.display = 'none';
            document.getElementById('step3-denied').style.display = 'none';
          } else if (val === 'cancelled') {
            showStep(3);
            document.getElementById('step3-delay').style.display = 'none';
            document.getElementById('step3-cancelled').style.display = '';
            document.getElementById('step3-denied').style.display = 'none';
          } else {
            // Nekad ombordstigning → direkt till resultat
            showResult();
          }
        }, 200);
      });
    });

    // Steg 3 — delay-alternativ
    document.querySelectorAll('.delay-card').forEach(function (card) {
      card.addEventListener('click', function () {
        document.querySelectorAll('.delay-card').forEach(function (c) { c.classList.remove('selected'); });
        this.classList.add('selected');
        document.getElementById('delay-' + this.dataset.value).checked = true;
        setTimeout(showResult, 200);
      });
    });

    // Steg 3 — notice-alternativ
    document.querySelectorAll('.notice-card').forEach(function (card) {
      card.addEventListener('click', function () {
        document.querySelectorAll('.notice-card').forEach(function (c) { c.classList.remove('selected'); });
        this.classList.add('selected');
        document.getElementById('notice-' + this.dataset.value).checked = true;
        setTimeout(showResult, 200);
      });
    });

    // Tillbaka-knappar
    document.querySelectorAll('[data-back]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showStep(parseInt(this.dataset.back));
      });
    });

    showStep(1);
  }

  // Ladda airports.json och starta
  fetch('/data/airports.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      airports = data;
      init();
    })
    .catch(function () {
      // Fallback: visa ändå formuläret, autocomplete fungerar bara inte
      init();
    });
})();
