if (!Shopify.designMode) {
  const heightWatchers = {};
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const newHeight = entry.contentRect.height;
      var regex = /group-(.+?)-group/;
      const matches = entry.target.className.match(regex);
      if (matches) {
        const group = matches[1];
        if (!heightWatchers[group]) {
          heightWatchers[group] = {};
        }
        heightWatchers[group][entry.target.id] = newHeight;
        const sum = Object.values(heightWatchers[group]).reduce(
          (a, b) => a + b,
          0
        );
        document.documentElement.style.setProperty(
          `--${group}-height`,
          `${sum}px`
        );
      }
    });
  });

  const heightElements = document.querySelectorAll(
    '.shopify-section-group-header-group, .shopify-section-group-hero-group'
  );
  heightElements.forEach((element) => {
    resizeObserver.observe(element);
  });
} else {
  /**
   * ResizeObserver doesn’t work inside Theme Editor
   */
  const calculateHeaderGroupHeights = () => {
    const headerGroupHeights = [];

    document
      .querySelectorAll('.shopify-section-group-header-group')
      .forEach((headerGroupSectionEl) => {
        headerGroupHeights.push(
          headerGroupSectionEl.getBoundingClientRect().height
        );
      });

    document.documentElement.style.setProperty(
      '--header-height',
      `${headerGroupHeights.reduce((subtotal, a) => subtotal + a, 0)}px`
    );
  };

  const calculateHeroGroupHeights = () => {
    const heroGroupHeights = [];

    document
      .querySelectorAll('.shopify-section-group-hero-group')
      .forEach((heroGroupSectionEl) => {
        heroGroupHeights.push(
          heroGroupSectionEl.getBoundingClientRect().height
        );
      });

    document.documentElement.style.setProperty(
      '--hero-height',
      `${heroGroupHeights.reduce((subtotal, a) => subtotal + a, 0)}px`
    );
  };

  calculateHeaderGroupHeights();

  const debouncedCalculateHeaderGroupHeights = debounce(
    calculateHeaderGroupHeights,
    150
  );

  calculateHeroGroupHeights();

  const debouncedCalculateHeroGroupHeights = debounce(
    calculateHeroGroupHeights,
    150
  );

  window.addEventListener('resize', debouncedCalculateHeaderGroupHeights);
  window.addEventListener('resize', debouncedCalculateHeroGroupHeights);

  document.body.addEventListener('shopify:section:select', (e) => {
    if (
      !e.target.matches(
        '.shopify-section-group-header-group, .shopify-section-group-hero-group'
      )
    )
      return;

    window.dispatchEvent(new Event('resize'));
  });

  document.body.addEventListener('shopify:section:load', (e) => {
    if (
      !e.target.matches(
        '.shopify-section-group-header-group, .shopify-section-group-hero-group'
      )
    )
      return;

    window.dispatchEvent(new Event('resize'));
  });

  document.body.addEventListener('shopify:section:unload', (e) => {
    if (
      !e.target.matches(
        '.shopify-section-group-header-group, .shopify-section-group-hero-group'
      )
    )
      return;

    window.dispatchEvent(new Event('resize'));
  });
}
