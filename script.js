document.addEventListener("DOMContentLoaded", () => {

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

    onScroll() { this.checkTabContainerPosition(); this.findCurrentTabSelector(); }
    onResize() { this.tabContainerHeight = this.$tabContainer.outerHeight(); this.setSliderCss(); }

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

  new StickyNavigation();

  // ===== RESULTS SECTION =====
  const resultsTable = document.getElementById('results-table');
  const resultsSelect = document.getElementById('results-season-select');
  const resultsRows = resultsTable ? Array.from(resultsTable.querySelectorAll('tbody tr')) : [];
  let resultsChart;

  if (resultsTable && resultsSelect) {
    // Populate unique years
    const yearsSet = new Set();
    resultsRows.forEach(row => {
      const year = row.cells[0].textContent.trim().split('-')[0];
      if(year) yearsSet.add(year);
    });
    resultsSelect.innerHTML = '<option value="all" selected>All</option>';
    Array.from(yearsSet).sort((a,b)=>b-a).forEach(y=>{
      const opt = document.createElement('option'); opt.value=y; opt.textContent=y;
      resultsSelect.appendChild(opt);
    });

    function filterResults(year){
      resultsRows.forEach(row=>{
        const rowYear = row.cells[0].textContent.trim().split('-')[0];
        row.style.display = (year==='all' || rowYear===year) ? '' : 'none';
      });
    }

    function updateResultsChart(year){
      let wins=0, losses=0, ties=0;
      resultsRows.forEach(row=>{
        const rowYear = row.cells[0].textContent.trim().split('-')[0];
        if(year==='all' || rowYear===year){
          const r = row.cells[3].textContent.trim().toLowerCase();
          if(r==='win') wins++; else if(r==='loss') losses++; else if(r==='tie') ties++;
        }
      });
      if(!resultsChart){
        const ctx = document.getElementById('results-pie-chart').getContext('2d');
        resultsChart = new Chart(ctx, {
          type:'pie',
          data:{labels:['Wins','Losses','Ties'],datasets:[{data:[wins,losses,ties],backgroundColor:['#4caf50','#f44336','#ffc107']}]},
          options:{responsive:true,plugins:{legend:{position:'bottom'}}}
        });
      } else {
        resultsChart.data.datasets[0].data=[wins,losses,ties];
        resultsChart.update();
      }
    }

    resultsSelect.addEventListener('change', e=>{
      const val = e.target.value;
      filterResults(val);
      updateResultsChart(val);
    });

    filterResults('all');
    updateResultsChart('all');
  }

  // ===== STATS SECTION =====
  const playerData = window.playerData || {}; // use global object or your JSON

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

  // Seasons
  function getAllSeasons(){
    const set = new Set();
    Object.values(playerData).forEach(p=>Object.keys(p.seasons||{}).forEach(s=>set.add(s)));
    return Array.from(set).sort((a,b)=>b-a);
  }
  function populateSeasonDropdown(){
    seasonSelect.innerHTML='<option value="all">All Seasons</option>';
    getAllSeasons().forEach(s=>{
      const opt=document.createElement("option"); opt.value=s; opt.textContent=s;
      seasonSelect.appendChild(opt);
    });
  }

  function buildTables(season='all'){
    Object.values(tables).forEach(tbl=>tbl.querySelector("tbody").innerHTML='');
    Object.values(playerData).forEach(player=>{
      const name = player.name;
      // Batting
      const bat = (season==='all') ? player.career : player.seasons[season]?.batting ?? { runs:"-", average:"-", high:"-" };
      const batRow = document.createElement("tr");
      batRow.innerHTML=`<td>${name}</td><td>${bat.runs}</td><td>${bat.average}</td><td>${bat.high??"-"}</td>`;
      tables.batting.querySelector("tbody").appendChild(batRow);

      // Bowling
      const bowl = (season==='all') ? player.career : player.seasons[season]?.bowling ?? { wickets:"-", average:"-", best:"-" };
      const bowlRow = document.createElement("tr");
      bowlRow.innerHTML=`<td>${name}</td><td>${bowl.wickets}</td><td>${bowl.average}</td><td>${bowl.best??"-"}</td>`;
      tables.bowling.querySelector("tbody").appendChild(bowlRow);

      // Superstat
      const s = (season==='all') ? player.career : player.seasons[season]?.superstat ?? {};
      const appearance = s.appearance??0, bowlScore=s.bowl??0, batScore=s.bat??0, fieldScore=s.field??0, total=appearance+bowlScore+batScore+fieldScore;
      const superRow = document.createElement("tr");
      superRow.innerHTML=`<td>${name}</td><td>${appearance}</td><td>${bowlScore}</td><td>${batScore}</td><td>${fieldScore}</td><td>${total}</td>`;
      tables.superstat.querySelector("tbody").appendChild(superRow);
    });
    enableSortingForAll();
    attachRowClickHandlers();
  }

  // Cards switching
  cards.forEach(card=>{
    card.onclick=()=>{
      cards.forEach(c=>c.classList.remove("active"));
      card.classList.add("active");
      const target = card.dataset.target;
      Object.values(panels).forEach(p=>p.classList.add("hidden"));
      panels[target.replace("-panel","")]?.classList.remove("hidden");
    };
  });

  // Filter
  searchInput.addEventListener("input", ()=>{
    const q = searchInput.value.toLowerCase().trim();
    const visiblePanel = Array.from(Object.values(panels)).find(p=>!p.classList.contains("hidden"));
    if(!visiblePanel) return;
    visiblePanel.querySelectorAll("tbody tr").forEach(tr=>tr.style.display=tr.innerText.toLowerCase().includes(q)?'':'none');
  });

  // Sorting
  function enableSortingForAll(){
    document.querySelectorAll(".sortable-table").forEach(table=>{
      const headers = table.querySelectorAll("th"); const tbody = table.querySelector("tbody");
      headers.forEach((th,idx)=>{
        th.onclick=()=>{
          const asc = !th.classList.contains("asc");
          headers.forEach(h=>h.classList.remove("asc","desc"));
          th.classList.toggle("asc",asc); th.classList.toggle("desc",!asc);
          const type = th.dataset.type||"string";
          const rows = Array.from(tbody.querySelectorAll("tr"));
          rows.sort((a,b)=>{
            let A=a.children[idx].innerText,B=b.children[idx].innerText;
            if(type==="number"){ A=parseFloat(A)||0; B=parseFloat(B)||0; return asc? A-B : B-A;}
            return asc? A.localeCompare(B) : B.localeCompare(A);
          });
          rows.forEach(r=>tbody.appendChild(r));
        };
      });
    });
  }

  // Row click → detail
  function attachRowClickHandlers(){
    document.querySelectorAll(".sortable-table tbody").forEach(tbody=>{
      tbody.querySelectorAll("tr").forEach(tr=>{
        tr.onclick=()=>{
          const playerName = tr.children[0].innerText;
          const data = playerData[playerName];
          if(!data) return;
          if(data.photo){ playerPhoto.src=data.photo; playerPhoto.style.display="";} else playerPhoto.style.display="none";
          playerNameEl.textContent=data.name; playerTeamEl.textContent=data.team??""; playerBioEl.textContent=data.bio??"";

          // Player season select
          playerSeasonSelect.innerHTML="";
          Object.keys(data.seasons||{}).sort((a,b)=>b-a).forEach(s=>{
            const o=document.createElement("option"); o.value=s; o.textContent=s; playerSeasonSelect.appendChild(o);
          });
          const careerOpt=document.createElement("option"); careerOpt.value="career"; careerOpt.textContent="Career"; playerSeasonSelect.appendChild(careerOpt);
          playerSeasonSelect.value=Object.keys(data.seasons||{}).sort((a,b)=>b-a)[0]??"career";

          function updateDetailStats(){
            const s = playerSeasonSelect.value;
            const stats = (s==="career")? data.career : data.seasons[s]??{};
            detailMatches.textContent=stats.matches??"-";
            detailRuns.textContent=stats.runs??"-";
            detailWickets.textContent=stats.wickets??"-";
            detailAverage.textContent=stats.average??"-";
          }
          playerSeasonSelect.onchange=updateDetailStats; updateDetailStats();

          // Show detail
          Object.values(panels).forEach(p=>p.classList.add("hidden"));
          document.querySelector(".stats-cards").classList.add("hidden");
          document.querySelector(".stats-controls").classList.add("hidden");
          detailView.classList.remove("hidden");
        };
      });
    });
  }

  detailBack.onclick=()=>{
    detailView.classList.add("hidden");
    document.querySelector(".stats-cards").classList.remove("hidden");
    document.querySelector(".stats-controls").classList.remove("hidden");
    const active = document.querySelector(".stats-card.active").dataset.target.replace("-panel","");
    panels[active]?.classList.remove("hidden");
  };

  seasonSelect.onchange=()=>buildTables(seasonSelect.value);

  populateSeasonDropdown();
  buildTables("all");

});
