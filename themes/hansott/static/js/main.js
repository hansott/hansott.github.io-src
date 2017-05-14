(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var navMenu = document.querySelector('.js-nav-menu');
        var toggle = document.querySelector('.js-nav-toggle');
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
            var shareButtons = document.getElementsByClassName('js-share-button');
            for (var i = 0; i < shareButtons.length; i++) {
                shareButtons[i].addEventListener('click', handleShareButtonClick);
            }
        }

        function handleLinkAnchorClick(event) {
            var heading = event.currentTarget.parentNode;
            window.location.hash = heading.id;
        }

        function handleLinkMouseEnter(event) {
            var heading = event.currentTarget;
            var anchor = heading.querySelector('.anchor');
            if (anchor) {
                return;
            }
            var link = document.createElement('a');
            link.classList.add('anchor');
            var icon = document.createElement('i');
            icon.classList.add('fa');
            icon.classList.add('fa-link');
            link.appendChild(icon);
            heading.appendChild(link);
            link.addEventListener('click', handleLinkAnchorClick);
        }

        function handleLinkMouseLeave(event) {
            var heading = event.currentTarget;
            var anchor = heading.querySelector('.anchor');
            if (anchor) {
                heading.removeChild(anchor);
            }
        }

        function initLinkAnchor() {
            var contents = document.getElementsByClassName('content');
            for (var i = 0; i < contents.length; i++) {
                var content = contents[i];
                var headings = content.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
                for (var h = 0; h < headings.length; h++) {
                    var heading = headings[h];
                    heading.addEventListener('mouseenter', handleLinkMouseEnter);
                    heading.addEventListener('mouseleave', handleLinkMouseLeave);
                }
            }
        }

        initMobileMenu();
        initShareButtons();
        initLinkAnchor();
    });
})();
