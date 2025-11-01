// ===== STICKY NAVIGATION =====
class StickyNavigation {
  constructor() {
    this.currentId = null;
    this.currentTab = null;
    this.$tabContainer = $('.et-hero-tabs-container');
    this.$tabs = $('.et-hero-tab');
    this.$slider = $('.et-hero-tab-slider');
    this.tabContainerHeight = this.$tabContainer.outerHeight() || 70;
    this.placeholder = $('<div class="et-hero-tabs-placeholder"></div>');

    const self = this;
    this.$tabs.on('click', function (e) { self.onTabClick(e, $(this)); });
    $(window).on('scroll', () => this.onScroll());
    $(window).on('resize', () => this.onResize());

    this.findCurrentTabSelector();
    this.setSliderCss();

    // Parallax effect for hero background
    $(window).on('scroll', function () {
      const scrollTop = $(window).scrollTop();
      $('.et-hero-tabs').css('background-position', 'center ' + (scrollTop * 0.5) + 'px');
    });
  }

  onTabClick(event, $element) {
    event.preventDefault();
    const target = $($element.attr('href'));
    if (!target.length) return;

    const scrollTop = target.offset().top - this.tabContainerHeight + 1;
    $('html, body').animate({ scrollTop: scrollTop }, 600);
  }

  onScroll() {
    this.checkTabContainerPosition();
    this.findCurrentTabSelector();
  }

  onResize() {
    this.tabContainerHeight = this.$tabContainer.outerHeight();
    this.setSliderCss();
  }

  checkTabContainerPosition() {
    const $hero = $('.et-hero-tabs');
    const offset = $hero.offset().top + $hero.outerHeight() - this.tabContainerHeight;

    if ($(window).scrollTop() > offset) {
      if (!this.$tabContainer.hasClass('et-hero-tabs-container--top')) {
        this.placeholder.height(this.tabContainerHeight);
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

  findCurrentTabSelector() {
    let newCurrentId = null;
    let newCurrentTab = null;
    const self = this;

    this.$tabs.each(function () {
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

      // Update active tab highlight
      this.$tabs.removeClass('active');
      if (this.currentTab) this.currentTab.addClass('active');

      this.setSliderCss();
    }
  }

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

// ===== SORTABLE + FILTERABLE TABLES =====
$(document).ready(function () {
  new StickyNavigation();

  // Make all tables with class "sortable-table" interactive
  $('table.sortable-table').each(function () {
    const $table = $(this);
    const $rows = $table.find('tbody tr');

    // === SORT FUNCTION ===
    $table.find('th').on('click', function () {
      const index = $(this).index();
      const type = $(this).data('type');
      const isAsc = $(this).hasClass('asc');

      $table.find('th').removeClass('asc desc');
      $(this).addClass(isAsc ? 'desc' : 'asc');

      const sortedRows = $rows.get().sort((a, b) => {
        let A = $(a).children('td').eq(index).text().toLowerCase();
        let B = $(b).children('td').eq(index).text().toLowerCase();

        if (type === 'number') {
          A = parseFloat(A) || 0;
          B = parseFloat(B) || 0;
        }

        if (A < B) return isAsc ? 1 : -1;
        if (A > B) return isAsc ? -1 : 1;
        return 0;
      });

      $.each(sortedRows, function (_, row) {
        $table.children('tbody').append(row);
      });
    });

    // === FILTER FUNCTION (if linked filter input exists) ===
    const filterId = $table.data('filter'); // e.g. data-filter="#stats-filter"
    if (filterId && $(filterId).length) {
      const $filter = $(filterId);
      $filter.on('keyup', function () {
        const value = $(this).val().toLowerCase().trim();

        $rows.each(function () {
          const text = $(this).text().toLowerCase();
          $(this).toggle(text.includes(value));
        });
      });
    }
  });
});
// ===== ROW CLICK TO DETAIL VIEW (Expanded Version) =====
document.querySelectorAll('#stats-table tbody tr').forEach(row => {
  row.addEventListener('click', () => {
    const data = row.dataset;

    document.getElementById('player-name').textContent = data.player || 'Unknown Player';
    document.getElementById('detail-matches').textContent = data.matches || '-';
    document.getElementById('detail-runs').textContent = data.runs || '-';
    document.getElementById('detail-wickets').textContent = data.wickets || '-';
    document.getElementById('player-bio').textContent = data.bio || 'No biography available.';
    document.getElementById('player-team').textContent = data.team || '';
    document.getElementById('detail-career').textContent = data.career || '';

    const photo = document.getElementById('player-photo');
    if (data.photo) {
      photo.src = data.photo;
      photo.style.display = 'block';
    } else {
      photo.style.display = 'none';
    }

    document.getElementById('stats-view').classList.add('hidden');
    document.getElementById('player-detail-view').classList.remove('hidden');
  });
});

document.getElementById('back-to-table').addEventListener('click', () => {
  document.getElementById('player-detail-view').classList.add('hidden');
  document.getElementById('stats-view').classList.remove('hidden');
});

// ===== BACK BUTTON =====
document.getElementById('back-to-table').addEventListener('click', () => {
  document.getElementById('player-detail-view').classList.add('hidden');
  document.getElementById('stats-view').classList.remove('hidden');
});
// ===== RESULTS TABLE YEAR FILTER =====
document.addEventListener('DOMContentLoaded', function () {
  const resultsTable = document.getElementById('results-table');
  const resultsSelect = document.getElementById('results-season-select');

  if (!resultsTable || !resultsSelect) return;

  const rows = Array.from(resultsTable.querySelectorAll('tbody tr'));
  const yearSet = new Set();

  // Collect available years from the "Season" column (last cell)
  rows.forEach(row => {
    const seasonCell = row.cells[row.cells.length - 1];
    if (seasonCell) {
      const year = seasonCell.textContent.trim();
      if (year) yearSet.add(year);
    }
  });

  // Populate dropdown with unique years
  Array.from(yearSet).sort((a, b) => b - a).forEach(year => {
    const opt = document.createElement('option');
    opt.value = year;
    opt.textContent = year;
    resultsSelect.appendChild(opt);
  });

  // Filter function
  resultsSelect.addEventListener('change', e => {
    const selectedYear = e.target.value;
    rows.forEach(row => {
      const year = row.cells[row.cells.length - 1].textContent.trim();
      if (selectedYear === 'all' || year === selectedYear) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
});
