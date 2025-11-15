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

  document.addEventListener("DOMContentLoaded", () => {
  // ===== Sample Player Data =====
  const playerData = {
    "John Smith": {
      name: "John Smith",
      team: "CIPA CITMA",
      photo: "images/john-smith.jpg",
      bio: "All-rounder with steady batting and reliable fielding.",
      seasons: {
        "2024": { matches: 10, runs: 430, wickets: 5, average: 43.0, batting: { runs:430, average:43, high:92 }, bowling: { wickets:5, average:30, best:"2/20" }, superstat: { appearance:60, bowl:22, bat:33, field:14 } },
        "2023": { matches: 12, runs: 540, wickets: 8, average: 45.0, batting: { runs:540, average:45, high:110 }, bowling: { wickets:8, average:25.5, best:"3/28" }, superstat: { appearance:70, bowl:30, bat:40, field:16 } }
      },
      career: { matches:22, runs:970, wickets:13, average:44.1 }
    },
    "Adam Ross": {
      name: "Adam Ross",
      team: "CIPA CITMA",
      photo: "images/adam-ross.jpg",
      bio: "Promising youngster, agile in the field.",
      seasons: {
        "2024": { matches: 8, runs: 120, wickets: 5, average:17.1, batting:{runs:120,average:17.1,high:44}, bowling:{wickets:5,average:33.2,best:"2/11"}, superstat:{appearance:40,bowl:10,bat:44,field:12} },
        "2023": { matches: 9, runs: 210, wickets:12, average:23.3, batting:{runs:210,average:21,high:62}, bowling:{wickets:12,average:22.5,best:"4/20"}, superstat:{appearance:50,bowl:20,bat:28,field:12} }
      },
      career: { matches:17, runs:330, wickets:17, average:19.4 }
    }
  };

  // ===== DOM Elements =====
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

  // ===== Helper: get all seasons in data =====
  function getAllSeasons() {
    const seasonSet = new Set();
    Object.values(playerData).forEach(p => {
      Object.keys(p.seasons).forEach(s => seasonSet.add(s));
    });
    return Array.from(seasonSet).sort((a,b) => b - a);
  }

  // ===== Populate season dropdown =====
  function populateSeasonDropdown() {
    seasonSelect.innerHTML = '<option value="all">All Seasons</option>';
    getAllSeasons().forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      seasonSelect.appendChild(opt);
    });
  }

  // ===== Build tables =====
  function buildTables(season = "all") {
    // clear all table bodies
    Object.values(tables).forEach(tbl => tbl.querySelector("tbody").innerHTML = "");

    Object.values(playerData).forEach(player => {
      const name = player.name;

      // Batting
      const bat = (season === "all") ? player.career : player.seasons[season]?.batting ?? { runs:"-", average:"-", high:"-" };
      const batRow = document.createElement("tr");
      batRow.innerHTML = `<td>${name}</td><td>${bat.runs}</td><td>${bat.average}</td><td>${bat.high ?? "-"}</td>`;
      tables.batting.querySelector("tbody").appendChild(batRow);

      // Bowling
      const bowl = (season === "all") ? player.career : player.seasons[season]?.bowling ?? { wickets:"-", average:"-", best:"-" };
      const bowlRow = document.createElement("tr");
      bowlRow.innerHTML = `<td>${name}</td><td>${bowl.wickets}</td><td>${bowl.average}</td><td>${bowl.best ?? "-"}</td>`;
      tables.bowling.querySelector("tbody").appendChild(bowlRow);

      // Superstat
      const s = (season === "all") ? player.career : player.seasons[season]?.superstat ?? {};
      const appearance = s.appearance ?? 0;
      const bowlScore = s.bowl ?? 0;
      const batScore = s.bat ?? 0;
      const fieldScore = s.field ?? 0;
      const total = appearance + bowlScore + batScore + fieldScore;
      const superRow = document.createElement("tr");
      superRow.innerHTML = `<td>${name}</td><td>${appearance}</td><td>${bowlScore}</td><td>${batScore}</td><td>${fieldScore}</td><td>${total}</td>`;
      tables.superstat.querySelector("tbody").appendChild(superRow);
    });

    enableSortingForAll();
    attachRowClickHandlers();
  }

  // ===== Cards switching =====
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const target = card.dataset.target;
      Object.values(panels).forEach(p => p.classList.add("hidden"));
      panels[target.replace("-panel","")]?.classList.remove("hidden");
    });
  });

  // ===== Filter visible table =====
  function filterVisibleTable() {
    const q = searchInput.value.toLowerCase().trim();
    const visiblePanel = Array.from(Object.values(panels)).find(p => !p.classList.contains("hidden"));
    if (!visiblePanel) return;
    visiblePanel.querySelectorAll("tbody tr").forEach(tr => {
      tr.style.display = tr.innerText.toLowerCase().includes(q) ? "" : "none";
    });
  }
  searchInput.addEventListener("input", filterVisibleTable);

  // ===== Sorting =====
  function enableSortingForAll() {
    document.querySelectorAll(".sortable-table").forEach(table => {
      const headers = table.querySelectorAll("th");
      const tbody = table.querySelector("tbody");

      headers.forEach((th, idx) => {
        th.onclick = () => {
          const asc = !th.classList.contains("asc");
          headers.forEach(h => h.classList.remove("asc","desc"));
          th.classList.toggle("asc", asc);
          th.classList.toggle("desc", !asc);

          const type = th.dataset.type ?? "string";
          const rows = Array.from(tbody.querySelectorAll("tr"));
          rows.sort((a,b) => {
            let A = a.children[idx].innerText;
            let B = b.children[idx].innerText;
            if(type==="number"){ A=parseFloat(A)||0; B=parseFloat(B)||0; return asc? A-B : B-A; }
            return asc? A.localeCompare(B) : B.localeCompare(A);
          });
          rows.forEach(r=>tbody.appendChild(r));
        };
      });
    });
  }

  // ===== Row click → detail view =====
  function attachRowClickHandlers() {
    document.querySelectorAll(".sortable-table tbody").forEach(tbody => {
      tbody.querySelectorAll("tr").forEach(tr => {
        tr.onclick = () => {
          const playerName = tr.children[0].innerText;
          const data = playerData[playerName];
          if(!data) return;
          // Photo
          if(data.photo){ playerPhoto.src = data.photo; playerPhoto.style.display = ""; }
          else playerPhoto.style.display = "none";
          playerNameEl.textContent = data.name;
          playerTeamEl.textContent = data.team ?? "";
          playerBioEl.textContent = data.bio ?? "";

          // Season select in detail
          playerSeasonSelect.innerHTML="";
          Object.keys(data.seasons).sort((a,b)=>b-a).forEach(s=>{
            const opt=document.createElement("option"); opt.value=s; opt.textContent=s; playerSeasonSelect.appendChild(opt);
          });
          const careerOpt=document.createElement("option"); careerOpt.value="career"; careerOpt.textContent="Career"; playerSeasonSelect.appendChild(careerOpt);
          playerSeasonSelect.value = Object.keys(data.seasons).sort((a,b)=>b-a)[0] ?? "career";

          function updateDetailStats() {
            const s = playerSeasonSelect.value;
            const stats = (s==="career") ? data.career : data.seasons[s] ?? {};
            detailMatches.textContent = stats.matches ?? "-";
            detailRuns.textContent = stats.runs ?? "-";
            detailWickets.textContent = stats.wickets ?? "-";
            detailAverage.textContent = stats.average ?? "-";
          }
          playerSeasonSelect.onchange = updateDetailStats;
          updateDetailStats();

          // Show detail
          Object.values(panels).forEach(p=>p.classList.add("hidden"));
          document.querySelector(".stats-cards").classList.add("hidden");
          document.querySelector(".stats-controls").classList.add("hidden");
          detailView.classList.remove("hidden");
        };
      });
    });
  }

  // ===== Back button =====
  detailBack.onclick = () => {
    detailView.classList.add("hidden");
    document.querySelector(".stats-cards").classList.remove("hidden");
    document.querySelector(".stats-controls").classList.remove("hidden");
    // show active panel
    const active = document.querySelector(".stats-card.active").dataset.target.replace("-panel","");
    panels[active]?.classList.remove("hidden");
  };

  // ===== Season select changes table =====
  seasonSelect.onchange = () => buildTables(seasonSelect.value);

  // ===== Initialize =====
  populateSeasonDropdown();
  buildTables("all");
});
