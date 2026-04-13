(function () {
  // Hero quick-check: navigate to /anmalan with optional pre-filled query params
  var btn = document.querySelector('.hero-check-btn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var dep = ((document.querySelector('#hero-departure') || {}).value || '').trim();
    var arr = ((document.querySelector('#hero-arrival') || {}).value || '').trim();

    var url = '/anmalan';
    var params = [];
    if (dep) params.push('dep=' + encodeURIComponent(dep));
    if (arr) params.push('arr=' + encodeURIComponent(arr));
    if (params.length) url += '?' + params.join('&');

    window.location.href = url;
  });
})();
