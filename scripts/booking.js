(function () {
    'use strict';

    var dialog = document.getElementById('book-dialog');
    if (!dialog || typeof dialog.showModal !== 'function') { return; }

    document.querySelectorAll('.js-book').forEach(function (trigger) {
        trigger.addEventListener('click', function (event) {
            event.preventDefault();
            dialog.showModal();
        });
    });

    /* Close on backdrop click */
    dialog.addEventListener('click', function (event) {
        if (event.target === dialog) { dialog.close(); }
    });

    /* Close after choosing an option */
    dialog.querySelectorAll('.book-option').forEach(function (option) {
        option.addEventListener('click', function () {
            setTimeout(function () { dialog.close(); }, 150);
        });
    });
}());
