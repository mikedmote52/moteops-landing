// Business picker enhancement. The section is native <details>/<summary> and
// fully usable without this file; this only closes the other cards when one
// opens, so the reader compares one trade at a time.
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.biz-picker .biz-card'));
  if (!cards.length) return;
  cards.forEach(function (card) {
    card.addEventListener('toggle', function () {
      if (!card.open) return;
      cards.forEach(function (other) {
        if (other !== card && other.open) other.open = false;
      });
    });
  });
})();
