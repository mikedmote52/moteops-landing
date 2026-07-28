// Approve / edit / skip demo on the per-trade pages. The page reads fine
// without this file; the buttons then do nothing and the copy above the
// demo says it is an illustration.
(function () {
  var frame = document.querySelector('[data-try-frame]');
  if (!frame) return;
  var quote = frame.querySelector('blockquote');
  var editor = frame.querySelector('textarea');
  var status = frame.querySelector('[data-try-status]');
  var acted = false;
  frame.addEventListener('click', function (event) {
    var button = event.target.closest('[data-try-act]');
    if (!button) return;
    var act = button.getAttribute('data-try-act');
    if (act === 'edit') {
      editor.value = editor.value || quote.textContent.trim();
      editor.classList.add('is-editing');
      editor.focus();
      status.textContent = 'Your words, your call. Edit it, then approve or skip.';
      return;
    }
    if (acted) return;
    acted = true;
    if (act === 'approve') {
      status.textContent = 'Approved. Only now would it actually send. Nothing here ever sends itself.';
    } else {
      status.textContent = 'Skipped. It quietly goes away, and nothing was sent.';
    }
  });
})();
