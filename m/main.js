(function() {
  function safeDomUpdate(callback) {
    requestAnimationFrame(callback);
  }

  function initColorScheme() {
    const preferenceKey = 'color-scheme-preference';
    const toggleButton = document.getElementById('theme-toggle');

    if (!toggleButton) {
      return;
    }

    function enableLightMode() {
      document.documentElement.className = 'light-mode';
      localStorage.setItem(preferenceKey, 'light');
    }

    function enableDarkMode() {
      document.documentElement.className = 'dark-mode';
      localStorage.setItem(preferenceKey, 'dark');
    }

    toggleButton.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark-mode');
      if (isDark) {
        enableLightMode();
      } else {
        enableDarkMode();
      }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(preferenceKey)) {
        e.matches ? enableDarkMode() : enableLightMode();
      }
    });
  }

  function initMobileMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const appHeader = document.querySelector('.app-header');
    const menuList = document.querySelector('.menu ul');

    if (!menuToggle || !appHeader || !menuList) {
      console.warn('Mobile menu elements for dynamic height animation not found. Skipping initialization.');
      return;
    }

    menuToggle.addEventListener('click', () => {
      const isMenuOpen = appHeader.classList.contains('menu-active');
      if (isMenuOpen) {
        menuList.style.height = '0px';
      } else {
        const menuHeight = menuList.scrollHeight;
        menuList.style.height = menuHeight + 'px';
      }
      appHeader.classList.toggle('menu-active');
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        menuList.style.height = '';
        appHeader.classList.remove('menu-active');
      }
    });
  }

  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    const scrollThreshold = 200;

    let isVisible = false;

    function onScroll() {
      const shouldBeVisible = window.scrollY > scrollThreshold;
      if (shouldBeVisible !== isVisible) {
        isVisible = shouldBeVisible;
        safeDomUpdate(() => {
          backToTopBtn.classList.toggle('visible', isVisible);
        });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  function initTocToggle() {
    const tocDetails = document.getElementById('toc-details');
    if (!tocDetails) {
      return;
    }

    const breakpoint = 1024;

    function updateTocState() {
      if (window.innerWidth >= breakpoint) {
        tocDetails.setAttribute('open', '');
        tocDetails.classList.add('expand');
      } else {
        tocDetails.removeAttribute('open');
        tocDetails.classList.remove('expand');
      }
    }

    updateTocState();
    window.addEventListener('resize', updateTocState);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initColorScheme();
    initMobileMenuToggle();
    initTocToggle();
    initBackToTop();
  });

})();
