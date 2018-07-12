/* eslint-disable */
(function() {
  var button = document.getElementById('simpleButton');
  button.addEventListener('click', function() {
    var information = document.getElementById('information');

    if (!this.counter) {
      this.counter = 0;
    }

    console.log('New event');
    information.textContent = 'it works! ' + ++this.counter;
  });
})();
/* eslint-enable */
