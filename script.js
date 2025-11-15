// ===== HERO TABS / STICKY MENU =====
const tabsContainer = document.querySelector('.et-hero-tabs-container');
const tabs = document.querySelectorAll('.et-hero-tab');
const slider = document.querySelector('.et-hero-tab-slider');

function updateSlider(tab) {
  slider.style.width = tab.offsetWidth + 'px';
  slider.style.left = tab.offsetLeft + 'px';
}

tabs.forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    updateSlider(tab);

    const targetId = tab.getAttribute('href').replace('#', '');
    const targetEl = document.getElementById(targetId);
    if(targetEl){
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Initialize slider
if(tabs.length) updateSlider(tabs[0]);

// Sticky menu
window.addEventListener('scroll', () => {
  const stickyOffset = tabsContainer.offsetTop;
  if(window.pageYOffset > stickyOffset){
    tabsContainer.classList.add('et-hero-tabs-container--top');
  } else {
    tabsContainer.classList.remove('et-hero-tabs-container--top');
  }
});

// ===== RESULTS TABLE =====
const resultsTable = document.getElementById('results-table');
const seasonSelect = document.getElementById('results-season-select');

const resultsData = [
  {date:'2024-06-10', opponent:'Team A', venue:'Home', result:'Win', season:'2024'},
  {date:'2024-07-03', opponent:'Team B', venue:'Away', result:'Loss', season:'2024'},
  {date:'2023-05-12', opponent:'Team C', venue:'Home', result:'Win', season:'2023'},
  {date:'2022-06-18', opponent:'Team D', venue:'Away', result:'Tie', season:'2022'}
];

// Populate season filter
const seasons = [...new Set(resultsData.map(d => d.season))].sort((a,b)=>b-a);
seasons.forEach(season => {
  const opt = document.createElement('option');
  opt.value = season;
  opt.textContent = season;
  seasonSelect.appendChild(opt);
});

function renderResultsTable(season='all'){
  const tbody = resultsTable.querySelector('tbody');
  tbody.innerHTML = '';
  const filtered = season==='all' ? resultsData : resultsData.filter(r=>r.season===season);
  filtered.forEach(r=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.date}</td><td>${r.opponent}</td><td>${r.venue}</td><td>${r.result}</td>`;
    tbody.appendChild(tr);
  });
  renderResultsChart(filtered);
}

seasonSelect.addEventListener('change', e=>{
  renderResultsTable(e.target.value);
});

// ===== RESULTS PIE CHART =====
const ctx = document.getElementById('results-pie-chart').getContext('2d');
let resultsPie;

function renderResultsChart(data){
  const counts = {Win:0, Loss:0, Tie:0};
  data.forEach(d=>{
    if(counts[d.result]!==undefined) counts[d.result]++;
  });
  const chartData = {
    labels: Object.keys(counts),
    datasets: [{
      label: 'Results',
      data: Object.values(counts),
      backgroundColor: ['#4caf50','#f44336','#ff9800']
    }]
  };
  if(resultsPie) resultsPie.destroy();
  resultsPie = new Chart(ctx, { type:'pie', data: chartData });
}

// ===== PLAYER STATS =====
const statsTables = {
  'batting': [
    {player:'Alice', runs:120, avg:30, high:50, season:'2024'},
    {player:'Bob', runs:80, avg:20, high:35, season:'2024'},
    {player:'Charlie', runs:60, avg:15, high:25, season:'2023'}
  ],
  'bowling': [
    {player:'Alice', wickets:5, avg:12.4, best:'3-20', season:'2024'},
    {player:'Bob', wickets:8, avg:10.5, best:'4-15', season:'2024'},
    {player:'Charlie', wickets:3, avg:15, best:'2-20', season:'2023'}
  ],
  'superstat': [
    {player:'Alice', appearance:8, bowling:5, batting:7, fielding:6, total:26, season:'2024'},
    {player:'Bob', appearance:7, bowling:6, batting:5, fielding:7, total:25, season:'2024'}
  ]
};

const statsSeasonSelect = document.getElementById('stats-season-select');
const statsSearch = document.getElementById('stats-search');

const tablePanels = document.querySelectorAll('.table-panel');
const statsCards = document.querySelectorAll('.stats-card');

const playerDetailView = document.getElementById('player-detail-view');
const playerDetailBack = document.getElementById('player-detail-back');
const playerNameEl = document.getElementById('player-name');
const playerPhoto = document.getElementById('player-photo');
const playerTeam = document.getElementById('player-team');
const playerBio = document.getElementById('player-bio');
const playerSeasonSelect = document.getElementById('player-season-select');
const detailMatches = document.getElementById('detail-matches');
const detailRuns = document.getElementById('detail-runs');
const detailWickets = document.getElementById('detail-wickets');
const detailAverage = document.getElementById('detail-average');

function populateStatsSeasonSelect(){
  const allSeasons = [...new Set(Object.values(statsTables).flat().map(d=>d.season))].sort((a,b)=>b-a);
  allSeasons.forEach(s=>{
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    statsSeasonSelect.appendChild(opt);
  });
}

// Render table panel
function renderStatsTable(panelId, season='all'){
  const table = document.getElementById(`${panelId}-table`);
  const tbody = table.querySelector('tbody');
  tbody.innerHTML='';
  const data = statsTables[panelId].filter(r=> season==='all' || r.season===season);
  data.forEach(player=>{
    const tr = document.createElement('tr');
    if(panelId==='batting'){
      tr.innerHTML=`<td>${player.player}</td><td>${player.runs}</td><td>${player.avg}</td><td>${player.high}</td>`;
    } else if(panelId==='bowling'){
      tr.innerHTML=`<td>${player.player}</td><td>${player.wickets}</td><td>${player.avg}</td><td>${player.best}</td>`;
    } else if(panelId==='superstat'){
      tr.innerHTML=`<td>${player.player}</td><td>${player.appearance}</td><td>${player.bowling}</td><td>${player.batting}</td><td>${player.fielding}</td><td>${player.total}</td>`;
    }
    tr.addEventListener('click',()=>showPlayerDetail(player));
    tbody.appendChild(tr);
  });
}

// Switch stats cards
statsCards.forEach(card=>{
  card.addEventListener('click',()=>{
    statsCards.forEach(c=>c.classList.remove('active'));
    card.classList.add('active');
    tablePanels.forEach(p=>p.classList.add('hidden'));
    document.getElementById(card.dataset.target).classList.remove('hidden');
    renderStatsTable(card.dataset.target, statsSeasonSelect.value);
  });
});

// Filter by season
statsSeasonSelect.addEventListener('change',()=>{
  const activePanel = document.querySelector('.table-panel:not(.hidden)').id;
  renderStatsTable(activePanel, statsSeasonSelect.value);
});

// Player search
statsSearch.addEventListener('input',()=>{
  const query = statsSearch.value.toLowerCase();
  const activePanel = document.querySelector('.table-panel:not(.hidden)').id;
  const tbody = document.getElementById(`${activePanel}-table`).querySelector('tbody');
  Array.from(tbody.querySelectorAll('tr')).forEach(tr=>{
    tr.style.display = tr.textContent.toLowerCase().includes(query)?'':'none';
  });
});

// Show player popup
function showPlayerDetail(player){
  playerDetailView.classList.remove('hidden');
  playerNameEl.textContent = player.player;
  playerTeam.textContent = player.team||'CIPA CITMA CC';
  playerBio.textContent = player.bio||'';
  detailMatches.textContent = player.matches||'N/A';
  detailRuns.textContent = player.runs||'N/A';
  detailWickets.textContent = player.wickets||'N/A';
  detailAverage.textContent = player.avg||'N/A';
  playerPhoto.style.display=player.photo?'block':'none';
  playerPhoto.src=player.photo||'';
}

// Hide player popup
playerDetailBack.addEventListener('click',()=>{
  playerDetailView.classList.add('hidden');
});

// Initialize
renderResultsTable();
populateStatsSeasonSelect();
renderStatsTable('batting');
