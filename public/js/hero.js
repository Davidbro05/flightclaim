(function () {
  // Hero quick-check: pre-fill full form fields from hero inputs, then scroll to form
  var btn = document.querySelector('.hero-check-btn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var dep = (document.querySelector('#hero-departure') || {}).value || '';
    var arr = (document.querySelector('#hero-arrival') || {}).value || '';

    var depField = document.querySelector('[name="departureAirport"]');
    var arrField = document.querySelector('[name="arrivalAirport"]');

    if (depField && dep) depField.value = dep;
    if (arrField && arr) arrField.value = arr;

    var form = document.querySelector('#ansokan');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();
