class StickyNavigation {
  constructor() {
    this.currentId = null;
    this.currentTab = null;
    this.$tabContainer = $('.et-hero-tabs-container');
    this.$tabs = $('.et-hero-tab');
    this.$slider = $('.et-hero-tab-slider');
    this.tabContainerHeight = this.$tabContainer.outerHeight() || 70;
    this.placeholder = $('<div class="et-hero-tabs-placeholder"></div>');

    // Event bindings
    const self = this;
    this.$tabs.on('click', function(e) { self.onTabClick(e, $(this)); });
    $(window).on('scroll', () => this.onScroll());
    $(window).on('resize', () => this.onResize());

    // Initialize slider and current tab
    this.findCurrentTabSelector();
    this.setSliderCss();

    // Parallax background effect
    $(window).on('scroll', function() {
      const scrollTop = $(window).scrollTop();
      $('.et-hero-tabs').css('background-position', 'center ' + (scrollTop * 0.5) + 'px');
    });
  }

  // Scroll smoothly to the section
  onTabClick(event, $element) {
    event.preventDefault();
    const target = $($element.attr('href'));
    if (!target.length) return;

    const scrollTop = target.offset().top - this.tabContainerHeight + 1;
    $('html, body').animate({ scrollTop: scrollTop }, 600);
  }

  // On window scroll
  onScroll() {
    this.checkTabContainerPosition();
    this.findCurrentTabSelector();
  }

  // On window resize
  onResize() {
    this.tabContainerHeight = this.$tabContainer.outerHeight();
    this.setSliderCss();
  }

  // Stick menu to top when scrolling past hero
  checkTabContainerPosition() {
    const $hero = $('.et-hero-tabs');
    const offset = $hero.offset().top + $hero.outerHeight() - this.tabContainerHeight;

    if ($(window).scrollTop() > offset) {
      if (!this.$tabContainer.hasClass('et-hero-tabs-container--top')) {
        this.placeholder.height(this.$tabContainer.outerHeight());
        $hero.after(this.placeholder);
        this.$tabContainer.addClass('et-hero-tabs-container--top');
        this.$tabContainer.css({ width: '100%' });
        this.setSliderCss();
      }
    } else {
      if (this.$tabContainer.hasClass('et-hero-tabs-container--top')) {
        this.$tabContainer.removeClass('et-hero-tabs-container--top');
        this.placeholder.remove();
        this.$tabContainer.css({ width: '' });
        this.setSliderCss();
      }
    }
  }

  // Update which tab is active based on scroll
  findCurrentTabSelector() {
    let newCurrentId = null;
    let newCurrentTab = null;
    const self = this;

    this.$tabs.each(function() {
      const id = $(this).attr('href');
      const $section = $(id);
      if (!$section.length) return;

      const offsetTop = $section.offset().top - self.tabContainerHeight;
      const offsetBottom = offsetTop + $section.outerHeight();
      const scrollPos = $(window).scrollTop();

      if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
        newCurrentId = id;
        newCurrentTab = $(this);
      }
    });

    if (this.currentId !== newCurrentId) {
      this.currentId = newCurrentId;
      this.currentTab = newCurrentTab;
      this.setSliderCss();
    }
  }

  // Move slider under active tab
  setSliderCss() {
    let width = 0, left = 0;

    if (this.currentTab && this.currentTab.length) {
      width = this.currentTab.outerWidth();
      left = this.currentTab.offset().left - this.$tabContainer.offset().left;
    } else {
      const $first = this.$tabs.first();
      if ($first.length) {
        width = $first.outerWidth();
        left = $first.offset().left - this.$tabContainer.offset().left;
      }
    }

    this.$slider.css({ width: width + 'px', left: left + 'px' });
  }
}

// Initialize the sticky menu once DOM is ready
$(document).ready(function() {
  new StickyNavigation();
});
