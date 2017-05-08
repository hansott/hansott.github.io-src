(function() {
    var navMenu = document.querySelector('.js-nav-menu');
    var toggle = document.querySelector('.js-nav-toggle');
    var shareButtons = document.querySelectorAll('.js-share-button');
    var activeClassName = 'is-active';
    var menuIsOpen = toggle.classList.contains(activeClassName);

    function handleToggleClick() {
        menuIsOpen = !menuIsOpen;
        if (menuIsOpen) {
            navMenu.classList.add(activeClassName);
            toggle.classList.add(activeClassName);
        } else {
            navMenu.classList.remove(activeClassName);
            toggle.classList.remove(activeClassName);
        }
    }

    function handleDocumentClick(event) {
        var clickedElement = event.target;
        if (clickedElement === toggle || toggle.contains(clickedElement)) {
            return;
        }
        if (clickedElement === navMenu || navMenu.contains(clickedElement)) {
            return;
        }
        if (menuIsOpen) {
            menuIsOpen = false;
            navMenu.classList.remove(activeClassName);
            toggle.classList.remove(activeClassName);
        }
    }

    function initMobileMenu() {
        toggle.addEventListener('click', handleToggleClick);
        document.addEventListener('click', handleDocumentClick);
    }

    function handleShareButtonClick(event) {
        event.preventDefault();
        window.open(event.currentTarget.href, 'Share', 'width=600, height=400');
    }

    function initShareButtons() {
        for (var i = 0; i < shareButtons.length; i++) {
            shareButtons[i].addEventListener('click', handleShareButtonClick);
        }
    }

    function init() {
        initMobileMenu();
        initShareButtons();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
