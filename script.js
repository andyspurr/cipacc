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
document.addEventListener("DOMContentLoaded", () => {
  const resultsTable = document.getElementById("results-table");
  const resultsSelect = document.getElementById("results-season-select");
  const rows = Array.from(resultsTable.querySelectorAll("tbody tr"));
  const ctx = document.getElementById("results-pie-chart").getContext("2d");

  // 1️⃣ Initialize Pie Chart
  let resultsChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Wins", "Losses", "Ties"],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ["#4caf50", "#f44336", "#ffc107"]
      }]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } }
  });

  // 2️⃣ Populate unique seasons from table
  const yearSet = new Set();
  rows.forEach(row => {
    const year = row.cells[0].textContent.trim().split("-")[0];
    if (year) yearSet.add(year);
  });
  resultsSelect.innerHTML = '<option value="all" selected>All</option>';
  Array.from(yearSet).sort((a,b)=>b-a).forEach(year=>{
    const opt = document.createElement("option");
    opt.value = year;
    opt.textContent = year;
    resultsSelect.appendChild(opt);
  });

  // 3️⃣ Function to filter table
  function filterTable(selectedYear) {
    rows.forEach(row => {
      const rowYear = row.cells[0].textContent.trim().split("-")[0];
      row.style.display = (selectedYear==="all" || rowYear===selectedYear) ? "" : "none";
    });
  }

  // 4️⃣ Function to count Wins/Losses/Ties
  function getResultCounts(selectedYear) {
    let wins=0, losses=0, ties=0;
    rows.forEach(row => {
      const rowYear = row.cells[0].textContent.trim().split("-")[0];
      if(selectedYear==="all" || rowYear===selectedYear){
        const result = row.cells[3].textContent.trim().toLowerCase();
        if(result==="win") wins++;
        else if(result==="loss") losses++;
        else if(result==="tie") ties++;
      }
    });
    return [wins, losses, ties];
  }

  // 5️⃣ Update Pie Chart
  function updateChart(selectedYear){
    const counts = getResultCounts(selectedYear);
    resultsChart.data.datasets[0].data = counts;
    resultsChart.update();
  }

  // 6️⃣ Event listener
  resultsSelect.addEventListener("change", e => {
    const year = e.target.value;
    filterTable(year);
    updateChart(year);
  });

  // 7️⃣ Initialize
  filterTable("all");
  updateChart("all");
});
document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------
     Elements
  ------------------------ */
  const cards = document.querySelectorAll(".stats-card");
  const panels = {
    batting: document.getElementById("batting-panel"),
    bowling: document.getElementById("bowling-panel"),
    superstat: document.getElementById("superstat-panel")
  };
  const tables = {
    batting: document.getElementById("batting-table"),
    bowling: document.getElementById("bowling-table"),
    superstat: document.getElementById("superstat-table")
  };
  const seasonSelect = document.getElementById("stats-season-select");
  const searchInput = document.getElementById("stats-search");

  const detailView = document.getElementById("player-detail-view");
  const detailBack = document.getElementById("player-detail-back");
  const playerPhoto = document.getElementById("player-photo");
  const playerNameEl = document.getElementById("player-name");
  const playerTeamEl = document.getElementById("player-team");
  const playerBioEl = document.getElementById("player-bio");
  const playerSeasonSelect = document.getElementById("player-season-select");
  const detailMatches = document.getElementById("detail-matches");
  const detailRuns = document.getElementById("detail-runs");
  const detailWickets = document.getElementById("detail-wickets");
  const detailAverage = document.getElementById("detail-average");

  /* ------------------------
     Example player data
     Replace with your actual JSON or server data
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
     Helpers
  ------------------------ */
  function gatherSeasons() {
    const set = new Set();
    Object.values(playerData).forEach(p => {
      if (p.seasons) Object.keys(p.seasons).forEach(s => set.add(s));
    });
    return Array.from(set).sort((a,b) => b - a);
  }

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
     Build table rows
  ------------------------ */
  function buildTables(season='all') {
    Object.keys(tables).forEach(type => {
      const tbody = tables[type].querySelector('tbody');
      tbody.innerHTML = '';
    });

    Object.values(playerData).forEach(player => {
      const name = player.name;

      // Batting
      const batStats = season==='all' ? (player.career||{}) : (player.batting?.[season]||{runs:'-',average:'-',high:'-'});
      const batRow = `<tr>
        <td>${name}</td>
        <td>${batStats.runs ?? '-'}</td>
        <td>${batStats.average ?? '-'}</td>
        <td>${batStats.high ?? '-'}</td>
      </tr>`;
      tables.batting.querySelector('tbody').insertAdjacentHTML('beforeend', batRow);

      // Bowling
      const bowlStats = season==='all' ? (player.career||{}) : (player.bowling?.[season]||{wickets:'-',average:'-',best:'-'});
      const bowlRow = `<tr>
        <td>${name}</td>
        <td>${bowlStats.wickets ?? '-'}</td>
        <td>${bowlStats.average ?? '-'}</td>
        <td>${bowlStats.best ?? '-'}</td>
      </tr>`;
      tables.bowling.querySelector('tbody').insertAdjacentHTML('beforeend', bowlRow);

      // Superstat
      const sStats = season==='all' ? (player.superstat?.career || player.career || {}) : (player.superstat?.[season]||{appearance:0,bowl:0,bat:0,field:0});
      const total = (Number(sStats.appearance)||0)+(Number(sStats.bowl)||0)+(Number(sStats.bat)||0)+(Number(sStats.field)||0);
      const superRow = `<tr>
        <td>${name}</td>
        <td>${sStats.appearance ?? 0}</td>
        <td>${sStats.bowl ?? 0}</td>
        <td>${sStats.bat ?? 0}</td>
        <td>${sStats.field ?? 0}</td>
        <td>${total}</td>
      </tr>`;
      tables.superstat.querySelector('tbody').insertAdjacentHTML('beforeend', superRow);
    });

    // Reattach sorting & click handlers
    enableSorting();
    attachRowClickHandlers();
  }

  /* ------------------------
     Sorting
  ------------------------ */
  function enableSorting() {
    document.querySelectorAll(".sortable-table").forEach(table => {
      table.querySelectorAll("th").forEach((th, idx) => {
        th.onclick = () => {
          const tbody = table.querySelector("tbody");
          const rows = Array.from(tbody.querySelectorAll("tr"));
          const type = th.dataset.type || 'string';
          const asc = !th.classList.contains('asc');

          table.querySelectorAll("th").forEach(h=>h.classList.remove('asc','desc'));
          th.classList.toggle('asc',asc);
          th.classList.toggle('desc',!asc);

          rows.sort((a,b)=>{
            let A = a.children[idx].innerText.trim();
            let B = b.children[idx].innerText.trim();
            if(type==='number'){ A=parseFloat(A)||0; B=parseFloat(B)||0; return asc?A-B:B-A;}
            return asc? A.localeCompare(B): B.localeCompare(A);
          });
          rows.forEach(r=>tbody.appendChild(r));
        };
      });
    });
  }

  /* ------------------------
     Row click for player detail
  ------------------------ */
  function attachRowClickHandlers() {
    document.querySelectorAll(".sortable-table tbody tr").forEach(tr=>{
      tr.onclick = () => {
        const playerName = tr.children[0].innerText;
        const data = playerData[playerName];
        if(!data) return;

        // photo
        if(data.photo){ playerPhoto.src = data.photo; playerPhoto.style.display=''; }
        else playerPhoto.style.display='none';

        playerNameEl.textContent = data.name;
        playerTeamEl.textContent = data.team ?? '';
        playerBioEl.textContent = data.bio ?? '';

        // populate player season select
        playerSeasonSelect.innerHTML='';
        const seasons = data.seasons ? Object.keys(data.seasons).sort((a,b)=>b-a):[];
        seasons.forEach(s=>{
          const opt = document.createElement('option'); opt.value=s; opt.textContent=s;
          playerSeasonSelect.appendChild(opt);
        });
        const careerOpt = document.createElement('option'); careerOpt.value='career'; careerOpt.textContent='Career';
        playerSeasonSelect.appendChild(careerOpt);
        playerSeasonSelect.value = seasons[0]??'career';

        updatePlayerDetail(data,playerSeasonSelect.value);
        detailView.classList.remove('hidden');
        Object.values(panels).forEach(p=>p.classList.add('hidden'));
      };
    });
  }

  function updatePlayerDetail(data,season){
    const stats = season==='career'?data.career:data.seasons?.[season]||{};
    detailMatches.textContent=stats.matches??'-';
    detailRuns.textContent=stats.runs??'-';
    detailWickets.textContent=stats.wickets??'-';
    detailAverage.textContent=stats.average??'-';
  }

  playerSeasonSelect.addEventListener('change',()=>updatePlayerDetail(playerData[playerNameEl.textContent],playerSeasonSelect.value));

  /* ------------------------
     Cards switch panels
  ------------------------ */
  cards.forEach(card=>{
    card.onclick = ()=>{
      const targetId = card.dataset.target;
      cards.forEach(c=>c.classList.remove('active'));
      card.classList.add('active');
      Object.values(panels).forEach(p=>p.classList.add('hidden'));
      const panelToShow = document.getElementById(targetId);
      if(panelToShow) panelToShow.classList.remove('hidden');
    };
  });

  /* ------------------------
     Search filter
  ------------------------ */
  searchInput.addEventListener('input',()=>{
    const q = searchInput.value.toLowerCase();
    const visiblePanel = Object.values(panels).find(p=>!p.classList.contains('hidden'));
    if(!visiblePanel) return;
    visiblePanel.querySelectorAll('tbody tr').forEach(tr=>{
      tr.style.display = tr.innerText.toLowerCase().includes(q)?'':'none';
    });
  });

  /* ------------------------
     Back button
  ------------------------ */
  detailBack.onclick = ()=>{
    detailView.classList.add('hidden');
    document.querySelector('.stats-controls').classList.remove('hidden');
    document.querySelector('.stats-cards').classList.remove('hidden');
    const activePanel = document.querySelector('.stats-card.active').dataset.target;
    document.getElementById(activePanel).classList.remove('hidden');
  };

  /* ------------------------
     Season select rebuilds tables
  ------------------------ */
  seasonSelect.onchange = ()=>buildTables(seasonSelect.value);

  /* ------------------------
     Initialize
  ------------------------ */
  populateSeasonSelect();
  buildTables('all');
});
