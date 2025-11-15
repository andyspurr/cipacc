// ================= STICKY MENU =================
const tabsContainer = document.querySelector('.et-hero-tabs-container');
const tabs = document.querySelectorAll('.et-hero-tab');
const slider = document.querySelector('.et-hero-tab-slider');
const tabOffsetTop = tabsContainer.offsetTop;

window.addEventListener('scroll', () => {
  if(window.scrollY >= tabOffsetTop) {
    tabsContainer.classList.add('et-hero-tabs-container--top');
  } else {
    tabsContainer.classList.remove('et-hero-tabs-container--top');
  }
});

// ================= TAB SWITCHING =================
tabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = tab.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({behavior:'smooth'});
    
    // Active tab styling
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Slider
    slider.style.width = tab.offsetWidth + 'px';
    slider.style.left = tab.offsetLeft + 'px';
  });
});

// Set initial slider
if(tabs.length > 0){
  slider.style.width = tabs[0].offsetWidth + 'px';
  slider.style.left = tabs[0].offsetLeft + 'px';
  tabs[0].classList.add('active');
}

// ================= RESULTS DATA =================
const resultsData = [
  {date:'2024-06-10', opponent:'Team A', venue:'Home', result:'Win', season:'2024'},
  {date:'2024-07-03', opponent:'Team B', venue:'Away', result:'Loss', season:'2024'},
  {date:'2023-05-12', opponent:'Team C', venue:'Home', result:'Win', season:'2023'},
  {date:'2022-06-18', opponent:'Team D', venue:'Away', result:'Tie', season:'2022'}
];

const resultsTableBody = document.querySelector('#results-table tbody');
const resultsSeasonSelect = document.getElementById('results-season-select');

const seasons = [...new Set(resultsData.map(r => r.season))];
seasons.forEach(season => {
  const opt = document.createElement('option');
  opt.value = season;
  opt.textContent = season;
  resultsSeasonSelect.appendChild(opt);
});

function renderResults(season='all'){
  resultsTableBody.innerHTML = '';
  const filtered = season==='all' ? resultsData : resultsData.filter(r => r.season===season);
  filtered.forEach(r=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.date}</td><td>${r.opponent}</td><td>${r.venue}</td><td>${r.result}</td>`;
    resultsTableBody.appendChild(tr);
  });
  updateResultsChart(filtered);
}

resultsSeasonSelect.addEventListener('change', () => {
  renderResults(resultsSeasonSelect.value);
});

renderResults(); // initial

// ================= RESULTS PIE CHART =================
const ctx = document.getElementById('results-pie-chart').getContext('2d');
let resultsChart;

function updateResultsChart(filteredData){
  const counts = {Win:0, Loss:0, Tie:0};
  filteredData.forEach(r => {
    if(counts[r.result]!==undefined) counts[r.result]++;
  });

  const data = {
    labels: ['Win','Loss','Tie'],
    datasets:[{
      data:[counts.Win, counts.Loss, counts.Tie],
      backgroundColor:['#4caf50','#f44336','#ff9800']
    }]
  };

  if(resultsChart) resultsChart.destroy();
  resultsChart = new Chart(ctx, {
    type:'pie',
    data:data,
    options:{ responsive:true, plugins:{ legend:{ position:'bottom' } } }
  });
}

// ================= STATS DATA =================
const statsData = {
  batting: {
    '2024': [
      {player:'Alice', runs:300, average:30, highScore:70},
      {player:'Bob', runs:250, average:25, highScore:60}
    ],
    '2023': [
      {player:'Alice', runs:200, average:25, highScore:50},
      {player:'Bob', runs:180, average:20, highScore:45}
    ]
  },
  bowling: {
    '2024': [
      {player:'Charlie', wickets:15, average:18, best:'4/20'},
      {player:'Dana', wickets:12, average:20, best:'3/15'}
    ],
    '2023': [
      {player:'Charlie', wickets:10, average:22, best:'3/25'},
      {player:'Dana', wickets:8, average:25, best:'2/18'}
    ]
  },
  superstat: {
    '2024': [
      {player:'Alice', appearance:10, bowling:0, batting:30, fielding:5, total:45},
      {player:'Charlie', appearance:8, bowling:15, batting:10, fielding:3, total:38}
    ],
    '2023': [
      {player:'Alice', appearance:8, bowling:0, batting:20, fielding:3, total:31},
      {player:'Charlie', appearance:7, bowling:10, batting:5, fielding:2, total:24}
    ]
  }
};

const statsSeasonSelect = document.getElementById('stats-season-select');
Object.keys(statsData.batting).forEach(season => {
  const opt = document.createElement('option');
  opt.value = season;
  opt.textContent = season;
  statsSeasonSelect.appendChild(opt);
});

const tablePanels = {
  batting: document.querySelector('#batting-panel tbody'),
  bowling: document.querySelector('#bowling-panel tbody'),
  superstat: document.querySelector('#superstat-panel tbody')
};

function renderStats(season='2024'){
  ['batting','bowling','superstat'].forEach(type => {
    const tbody = tablePanels[type];
    tbody.innerHTML = '';
    statsData[type][season].forEach(p=>{
      let html = '';
      if(type==='batting'){
        html = `<tr><td>${p.player}</td><td>${p.runs}</td><td>${p.average}</td><td>${p.highScore}</td></tr>`;
      } else if(type==='bowling'){
        html = `<tr><td>${p.player}</td><td>${p.wickets}</td><td>${p.average}</td><td>${p.best}</td></tr>`;
      } else {
        html = `<tr><td>${p.player}</td><td>${p.appearance}</td><td>${p.bowling}</td><td>${p.batting}</td><td>${p.fielding}</td><td>${p.total}</td></tr>`;
      }
      tbody.innerHTML += html;
    });
  });
}

statsSeasonSelect.addEventListener('change', ()=>renderStats(statsSeasonSelect.value));
renderStats(statsSeasonSelect.value);

// ================= STATS TAB SWITCH =================
document.querySelectorAll('.stats-card').forEach(card=>{
  card.addEventListener('click', ()=>{
    document.querySelectorAll('.stats-card').forEach(c=>c.classList.remove('active'));
    card.classList.add('active');
    document.querySelectorAll('.table-panel').forEach(panel=>panel.classList.add('hidden'));
    document.getElementById(card.dataset.target).classList.remove('hidden');
  });
});

// ================= PLAYER DETAIL VIEW (example toggle) =================
const playerDetailView = document.getElementById('player-detail-view');
document.getElementById('player-detail-back').addEventListener('click', ()=>{
  playerDetailView.classList.add('hidden');
});
