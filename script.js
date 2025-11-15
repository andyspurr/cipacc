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

/* ====== Stats Section JS (self-contained) ====== */
document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------
     Example player data object
     Replace / load this from JSON or server in production
     Keyed by player name (exact match with table first column)
  ------------------------ */
  const playerData = {
    "John Smith": {
      name: "John Smith",
      team: "CIPA CITMA",
      photo: "images/john-smith.jpg",
      bio: "All-rounder with steady batting and reliable fielding.",
      seasons: {
        "2024": { matches: 10, runs: 430, wickets: 5, average: 43.0 },
        "2023": { matches: 12, runs: 540, wickets: 8, average: 45.0 }
      },
      career: { matches: 22, runs: 970, wickets: 13, average: 44.1 },
      batting: { "2024": { runs: 430, average: 43.0, high: 92 }, "2023": { runs: 540, average: 45.0, high: 110 } },
      bowling: { "2024": { wickets: 5, average: 30.0, best: "2/20" }, "2023": { wickets: 8, average: 25.5, best: "3/28" } },
      superstat: { "2024": { appearance: 60, bowl: 22, bat: 33, field: 14 }, "2023": { appearance: 70, bowl: 30, bat: 40, field: 16 } }
    },
    "Adam Ross": {
      name: "Adam Ross",
      team: "CIPA CITMA",
      photo: "images/adam-ross.jpg",
      bio: "Promising youngster, agile in the field.",
      seasons: {
        "2024": { matches: 8, runs: 120, wickets: 5, average: 17.1 },
        "2023": { matches: 9, runs: 210, wickets: 12, average: 23.3 }
      },
      career: { matches: 17, runs: 330, wickets: 17, average: 19.4 },
      batting: { "2024": { runs: 120, average: 17.1, high: 44 }, "2023": { runs: 210, average: 21.0, high: 62 } },
      bowling: { "2024": { wickets: 5, average: 33.2, best: "2/11" }, "2023": { wickets: 12, average: 22.5, best: "4/20" } },
      superstat: { "2024": { appearance: 40, bowl: 10, bat: 44, field: 12 }, "2023": { appearance: 50, bowl: 20, bat: 28, field: 12 } }
    }
  };

  /* ------------------------
     Identify DOM elements
  ------------------------ */
  const cardButtons = Array.from(document.querySelectorAll('.stats-card'));
  const panels = {
    batting: document.getElementById('batting-panel'),
    bowling: document.getElementById('bowling-panel'),
    superstat: document.getElementById('superstat-panel')
  };
  const seasonSelect = document.getElementById('stats-season-select');
  const searchInput = document.getElementById('stats-search');

  const tables = {
    batting: document.getElementById('batting-table'),
    bowling: document.getElementById('bowling-table'),
    superstat: document.getElementById('superstat-table')
  };

  const detailView = document.getElementById('player-detail-view');
  const detailBack = document.getElementById('player-detail-back');
  const playerPhoto = document.getElementById('player-photo');
  const playerNameEl = document.getElementById('player-name');
  const playerTeamEl = document.getElementById('player-team');
  const playerBioEl = document.getElementById('player-bio');
  const playerSeasonSelect = document.getElementById('player-season-select');
  const detailMatches = document.getElementById('detail-matches');
  const detailRuns = document.getElementById('detail-runs');
  const detailWickets = document.getElementById('detail-wickets');
  const detailAverage = document.getElementById('detail-average');

  /* ------------------------
     Helper: get all seasons present in playerData
  ------------------------ */
  function gatherSeasons() {
    const set = new Set();
    Object.values(playerData).forEach(p => {
      if (p.seasons) Object.keys(p.seasons).forEach(s => set.add(s));
    });
    return Array.from(set).sort((a,b) => b - a);
  }

  /* ------------------------
     Populate season select used by all tables
  ------------------------ */
  function populateSeasonSelect() {
    const seasons = gatherSeasons();
    seasonSelect.innerHTML = '<option value="all" selected>All seasons</option>';
    seasons.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      seasonSelect.appendChild(opt);
    });
  }

  /* ------------------------
     Build rows for each table from playerData and optional season
  ------------------------ */
  function buildTables(season = 'all') {
    // batting table
    const battingBody = tables.batting.querySelector('tbody');
    battingBody.innerHTML = '';
    const bowlingBody = tables.bowling.querySelector('tbody');
    bowlingBody.innerHTML = '';
    const superBody = tables.superstat.querySelector('tbody');
    superBody.innerHTML = '';

    Object.values(playerData).forEach(player => {
      const name = player.name;

      // batting values
      const batStats = season === 'all' ? (player.career || {}) : (player.batting && player.batting[season]) ? player.batting[season] : { runs: '-', average: '-', high: '-' };
      const batRuns = batStats.runs ?? '-';
      const batAvg = batStats.average ?? batStats.avg ?? '-';
      const batHigh = batStats.high ?? '-';

      const batRow = document.createElement('tr');
      batRow.innerHTML = `<td>${name}</td><td>${batRuns}</td><td>${batAvg}</td><td>${batHigh}</td>`;
      battingBody.appendChild(batRow);

      // bowling values
      const bowlStats = season === 'all' ? (player.career || {}) : (player.bowling && player.bowling[season]) ? player.bowling[season] : { wickets: '-', average: '-', best: '-' };
      const bowlW = bowlStats.wickets ?? '-';
      const bowlAvg = bowlStats.average ?? bowlStats.avg ?? '-';
      const bowlBest = bowlStats.best ?? '-';
      const bowlRow = document.createElement('tr');
      bowlRow.innerHTML = `<td>${name}</td><td>${bowlW}</td><td>${bowlAvg}</td><td>${bowlBest}</td>`;
      bowlingBody.appendChild(bowlRow);

      // superstat values
      const sStats = season === 'all' ? (player.superstat && player.superstat['career'] ? player.superstat['career'] : player.career) : (player.superstat && player.superstat[season]) ? player.superstat[season] : {};
      const appearance = sStats.appearance ?? sStats.appear ?? 0;
      const bowlScore = sStats.bowl ?? 0;
      const batScore = sStats.bat ?? 0;
      const fieldScore = sStats.field ?? 0;
      const total = (Number(appearance) || 0) + (Number(bowlScore) || 0) + (Number(batScore) || 0) + (Number(fieldScore) || 0);
      const superRow = document.createElement('tr');
      superRow.innerHTML = `<td>${name}</td><td>${appearance}</td><td>${bowlScore}</td><td>${batScore}</td><td>${fieldScore}</td><td>${total}</td>`;
      superBody.appendChild(superRow);
    });

    // after building, attach sorting and row click handlers (rebind)
    enableSortingForAll();
    attachRowClickHandlers();
  }

  /* ------------------------
     Table switching (cards)
  ------------------------ */
  cardButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      cardButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.target;
      // hide all
      Object.values(panels).forEach(p => p.classList.add('hidden'));
      // show target
      panels[target].classList.remove('hidden');
      // clear search input
      searchInput.value = '';
    });
  });

  /* ------------------------
     Generic search/filter for visible table
  ------------------------ */
  function filterVisibleTable() {
    const q = (searchInput.value || '').toLowerCase().trim();
    // find visible table tbody
    const visiblePanel = Object.values(panels).find(p => !p.classList.contains('hidden'));
    if (!visiblePanel) return;
    const tbody = visiblePanel.querySelector('tbody');
    if (!tbody) return;
    Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
      const text = tr.innerText.toLowerCase();
      tr.style.display = text.includes(q) ? '' : 'none';
    });
  }
  searchInput.addEventListener('input', filterVisibleTable);

  /* ------------------------
     Sorting utility for all tables (click header to toggle asc/desc)
  ------------------------ */
  function enableSortingForAll() {
    document.querySelectorAll('.sortable-table').forEach(table => {
      const headers = Array.from(table.querySelectorAll('th'));
      const tbody = table.querySelector('tbody');

      headers.forEach((th, colIndex) => {
        // remove previous listener by cloning header
        const newTh = th.cloneNode(true);
        th.parentNode.replaceChild(newTh, th);
        newTh.addEventListener('click', () => {
          // toggle classes
          headers.forEach(h => h.classList.remove('asc', 'desc'));
          const currentlyAsc = newTh.classList.contains('asc');
          newTh.classList.toggle('asc', !currentlyAsc);
          newTh.classList.toggle('desc', currentlyAsc);

          // sort rows
          const rowsArr = Array.from(tbody.querySelectorAll('tr'));
          const type = newTh.dataset.type || 'string';
          rowsArr.sort((a, b) => {
            const aText = a.children[colIndex].innerText.trim().toLowerCase();
            const bText = b.children[colIndex].innerText.trim().toLowerCase();
            if (type === 'number') {
              const aNum = parseFloat(aText) || 0;
              const bNum = parseFloat(bText) || 0;
              return newTh.classList.contains('asc') ? aNum - bNum : bNum - aNum;
            } else {
              return newTh.classList.contains('asc') ? aText.localeCompare(bText) : bText.localeCompare(aText);
            }
          });

          // re-append
          rowsArr.forEach(r => tbody.appendChild(r));
        });
      });
    });
  }

  /* ------------------------
     Row click handler: open detail view (delegated)
     Works for any of the three tables.
  ------------------------ */
  function attachRowClickHandlers() {
    // remove previous delegation by cloning tbodies (simple way)
    document.querySelectorAll('.sortable-table tbody').forEach(tbody => {
      const newTbody = tbody.cloneNode(true);
      tbody.parentNode.replaceChild(newTbody, tbody);
    });

    document.querySelectorAll('.sortable-table tbody').forEach(tbody => {
      tbody.addEventListener('click', function (e) {
        const tr = e.target.closest('tr');
        if (!tr) return;
        const playerName = tr.children[0].innerText.trim();
        const data = playerData[playerName];
        if (!data) {
          // If no global data, try to build from row cells (fallback)
          showFallbackDetail(playerName, tr);
          return;
        }
        showPlayerDetail(playerName, data);
      });
    });
  }

  /* fallback detail if playerData missing */
  function showFallbackDetail(name, tr) {
    playerPhoto.style.display = 'none';
    playerNameEl.textContent = name;
    playerTeamEl.textContent = '';
    playerBioEl.textContent = 'No additional data available.';
    playerSeasonSelect.innerHTML = '';
    detailMatches.textContent = '-';
    detailRuns.textContent = '-';
    detailWickets.textContent = '-';
    detailAverage.textContent = '-';
    // show detail and hide tables
    showDetail();
  }

  /* ------------------------
     Show player detail filled from playerData
  ------------------------ */
  function showPlayerDetail(name, data) {
    // photo
    if (data.photo) {
      playerPhoto.src = data.photo;
      playerPhoto.style.display = '';
    } else {
      playerPhoto.style.display = 'none';
    }

    playerNameEl.textContent = data.name || name;
    playerTeamEl.textContent = data.team || '';
    playerBioEl.textContent = data.bio || '';

    // populate season select for player
    playerSeasonSelect.innerHTML = '';
    const seasons = (data.seasons) ? Object.keys(data.seasons).sort((a,b) => b - a) : [];
    seasons.forEach(s => {
      const o = document.createElement('option'); o.value = s; o.textContent = s;
      playerSeasonSelect.appendChild(o);
    });
    // career option
    const careerOpt = document.createElement('option'); careerOpt.value = 'career'; careerOpt.textContent = 'Career';
    playerSeasonSelect.appendChild(careerOpt);

    // default select latest season if exists, otherwise career
    const defaultSeason = seasons.length ? seasons[0] : 'career';
    playerSeasonSelect.value = defaultSeason;

    // update stats table for chosen season
    function updateDetailStats() {
      const s = playerSeasonSelect.value;
      const stats = (s === 'career') ? (data.career || {}) : (data.seasons && data.seasons[s]) ? data.seasons[s] : {};
      detailMatches.textContent = stats.matches ?? '-';
      detailRuns.textContent = stats.runs ?? '-';
      detailWickets.textContent = stats.wickets ?? '-';
      detailAverage.textContent = stats.average ?? '-';
    }

    playerSeasonSelect.addEventListener('change', updateDetailStats);
    updateDetailStats();

    showDetail();
  }

  function showDetail() {
    // hide panels
    Object.values(panels).forEach(p => p.classList.add('hidden'));
    document.querySelector('.stats-controls').classList.add('hidden');
    document.querySelector('.stats-cards').classList.add('hidden');
    detailView.classList.remove('hidden');
    detailView.setAttribute('aria-hidden', 'false');
  }

  /* back button */
  detailBack.addEventListener('click', function () {
    detailView.classList.add('hidden');
    document.querySelector('.stats-controls').classList.remove('hidden');
    document.querySelector('.stats-cards').classList.remove('hidden');
    // show active panel
    const active = document.querySelector('.stats-card.active').dataset.target;
    panels[active].classList.remove('hidden');
  });

  /* ------------------------
     Season select change: rebuild tables to show season-specific numbers
  ------------------------ */
  seasonSelect.addEventListener('change', function () {
    const val = seasonSelect.value;
    buildTables(val);
  });

  /* ------------------------
     Initialize everything
  ------------------------ */
  populateSeasonSelect();     // build season options
  buildTables('all');         // fill tables with 'all' (career) data
  enableSortingForAll();      // ensure headers are bound
  attachRowClickHandlers();   // ensure rows clickable
});
