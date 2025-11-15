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

document.addEventListener('DOMContentLoaded', function () {
  const resultsTable = document.getElementById('results-table');
  const resultsSelect = document.getElementById('results-season-select');

  if (!resultsTable || !resultsSelect) return;

  const rows = Array.from(resultsTable.querySelectorAll('tbody tr'));
  const yearSet = new Set();

 // ===== Results season filter =====
  // Extract years from the first column (Date)
  rows.forEach(row => {
    const dateText = row.cells[0].textContent.trim();
    const year = dateText.split('-')[0]; // YYYY-MM-DD → YYYY
    if (year) yearSet.add(year);
  });

  // Populate dropdown with unique years (newest first)
  Array.from(yearSet).sort((a, b) => b - a).forEach(year => {
    const opt = document.createElement('option');
    opt.value = year;
    opt.textContent = year;
    resultsSelect.appendChild(opt);
  });

  // Filter rows when selecting a year
  resultsSelect.addEventListener('change', e => {
    const selectedYear = e.target.value;
    rows.forEach(row => {
      const rowYear = row.cells[0].textContent.trim().split('-')[0];
      row.style.display = selectedYear === 'all' || rowYear === selectedYear ? '' : 'none';
    });
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const resultsTable = document.getElementById('results-table');
  const resultsSelect = document.getElementById('results-season-select');
  const rows = Array.from(resultsTable.querySelectorAll('tbody tr'));
  let resultsChart;

  // 1️⃣ Populate the season dropdown dynamically from Date column, no duplicates
  const yearSet = new Set(); // Set ensures uniqueness
  rows.forEach(row => {
    const year = row.cells[0].textContent.trim().split('-')[0];
    if (year) yearSet.add(year);
  });

  // Clear existing options except "All"
  resultsSelect.innerHTML = '<option value="all" selected>All</option>';

  // Add sorted unique years
  Array.from(yearSet).sort((a, b) => b - a).forEach(year => {
    const opt = document.createElement('option');
    opt.value = year;
    opt.textContent = year;
    resultsSelect.appendChild(opt);
  });

  // 2️⃣ Filter table rows
  function filterResultsTable(selectedYear) {
    rows.forEach(row => {
      const rowYear = row.cells[0].textContent.trim().split('-')[0];
      row.style.display = selectedYear === 'all' || rowYear === selectedYear ? '' : 'none';
    });
  }

  // 3️⃣ Count Wins / Losses / Ties
  function getResultsCounts(selectedYear) {
    let wins = 0, losses = 0, ties = 0;
    rows.forEach(row => {
      const rowYear = row.cells[0].textContent.trim().split('-')[0];
      if (selectedYear === 'all' || rowYear === selectedYear) {
        const result = row.cells[3].textContent.trim().toLowerCase();
        if (result === 'win') wins++;
        else if (result === 'loss') losses++;
        else if (result === 'tie') ties++;
      }
    });
    return [wins, losses, ties];
  }

  // 4️⃣ Create or update pie chart
  function updateResultsChart(selectedYear) {
    const counts = getResultsCounts(selectedYear);
    const ctx = document.getElementById('results-pie-chart').getContext('2d');

    if (!resultsChart) {
      resultsChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Wins', 'Losses', 'Ties'],
          datasets: [{
            data: counts,
            backgroundColor: ['#4caf50', '#f44336', '#ffc107']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    } else {
      resultsChart.data.datasets[0].data = counts;
      resultsChart.update();
    }
  }

  // 5️⃣ Event listener for dropdown
  resultsSelect.addEventListener('change', e => {
    const selectedYear = e.target.value;
    filterResultsTable(selectedYear);
    updateResultsChart(selectedYear);
  });

  // 6️⃣ Initialize table and chart
  filterResultsTable('all');
  updateResultsChart('all');
});
/* ===== Stats Section (Card-based) ===== */
#stats-section { padding: 40px 20px; background: #fff; }
#stats-section .stats-inner { max-width: 1100px; margin: 0 auto; }

/* header */
.stats-header h2 {
  font-family: "Bodoni Moda", serif;
  font-style: italic;
  margin: 0 0 8px;
  letter-spacing: 0.08em;
}
.stats-intro { margin: 0 0 18px; color: #555; }

/* cards */
.stats-cards {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.stats-card {
  min-width: 180px;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #e3e7ea;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  cursor: pointer;
  text-align: left;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
}
.stats-card:hover { transform: translateY(-4px); box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
.stats-card.active { background: #0077cc; color: #fff; border-color: #0077cc; }

/* card text */
.card-title { font-weight: 700; font-size: 1.05rem; margin-bottom: 6px; }
.card-sub { font-size: 0.9rem; color: inherit; opacity: .95; }

/* controls */
.stats-controls { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin: 18px 0; }
.controls-left { display:flex; align-items:center; gap:12px; }
.small-select { padding: 8px 10px; border-radius:6px; border:1px solid #ccc; background:#fff; }
.controls-right input[type="search"] { padding: 10px 12px; border-radius: 8px; border: 1px solid #ccc; width: 220px; }

/* dashboard layout */
.stats-dashboard { display: block; }

/* table container */
.stats-table-container { width: 100%; overflow-x: auto; margin-bottom: 18px; }
.sortable-table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; }
.sortable-table thead { background: #f7f7f7; position: sticky; top: 0; z-index: 2; }
.sortable-table th, .sortable-table td { padding: 10px 14px; border-bottom: 1px solid #eee; text-align: left; }
.sortable-table tbody tr:nth-child(even) { background: #fafafa; }
.sortable-table tbody tr:hover { background: #f0f8ff; cursor: pointer; }

/* sortable header indicators */
.sortable-table th { cursor: pointer; user-select: none; position: relative; }
.sortable-table th.asc::after { content: "▲"; position: absolute; right: 10px; font-size: 0.7em; }
.sortable-table th.desc::after { content: "▼"; position: absolute; right: 10px; font-size: 0.7em; }

/* hide helpers */
.hidden { display: none !important; }

/* player detail panel */
.player-detail {
  max-width: 900px;
  margin: 20px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  padding: 18px;
}
.back-btn { background:none; border:none; color:#0077cc; cursor:pointer; font-size:1rem; margin-bottom:10px; }
.player-detail-inner { display:flex; gap:20px; align-items:flex-start; }
.player-photo-wrap img { width:140px; height:140px; object-fit:cover; border-radius:10px; box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
.player-meta h3 { margin:0 0 6px; font-family:"Bodoni Moda",serif; font-style:italic; }
.player-meta .muted { color:#666; margin-bottom:8px; }
.detail-stats { width:100%; margin-top:12px; border-collapse:collapse; }
.detail-stats th, .detail-stats td { padding:8px 10px; border:1px solid #eee; text-align:center; }

/* small screens */
@media (max-width:700px) {
  .player-detail-inner { flex-direction:column; align-items:center; }
  .controls-right input { width: 100%; }
  .stats-cards { justify-content: stretch; }
}
