// ===== HERO TABS =====
const tabs = document.querySelectorAll('.et-hero-tab');
const slider = document.querySelector('.et-hero-tab-slider');
const tabContainer = document.querySelector('.et-hero-tabs-container');

function setActiveTab(tab){
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const left = tab.offsetLeft;
    const width = tab.offsetWidth;
    slider.style.left = left + 'px';
    slider.style.width = width + 'px';
}

tabs.forEach(tab => {
    tab.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(tab.getAttribute('href'));
        if(target){
            window.scrollTo({top: target.offsetTop - tabContainer.offsetHeight, behavior:'smooth'});
        }
        setActiveTab(tab);
    });
});

// Initialize slider position
if(tabs.length) setActiveTab(tabs[0]);

// ===== STICKY MENU =====
const heroSection = document.querySelector('.et-hero-tabs');
window.addEventListener('scroll', ()=>{
    if(window.scrollY > heroSection.offsetHeight){
        tabContainer.classList.add('et-hero-tabs-container--top');
    } else {
        tabContainer.classList.remove('et-hero-tabs-container--top');
    }
});

// ===== RESULTS TABLE & PIE CHART =====
const resultsTable = document.getElementById('results-table');
const resultsSeasonSelect = document.getElementById('results-season-select');
const resultsChartCtx = document.getElementById('results-pie-chart').getContext('2d');

// Sample results data by season
const resultsData = {
    '2024': [
        {Date:'2024-06-10', Opponent:'Team A', Venue:'Home', Result:'Win'},
        {Date:'2024-07-03', Opponent:'Team B', Venue:'Away', Result:'Loss'}
    ],
    '2023': [
        {Date:'2023-05-12', Opponent:'Team C', Venue:'Home', Result:'Win'}
    ],
    '2022': [
        {Date:'2022-06-18', Opponent:'Team D', Venue:'Away', Result:'Tie'}
    ]
};

// Populate season select
Object.keys(resultsData).sort((a,b)=>b-a).forEach(season=>{
    const opt = document.createElement('option');
    opt.value = season;
    opt.textContent = season;
    resultsSeasonSelect.appendChild(opt);
});

// Render table for selected season
function renderResultsTable(season){
    const tbody = resultsTable.querySelector('tbody');
    tbody.innerHTML='';
    const data = resultsData[season] || [];
    data.forEach(r=>{
        const tr = document.createElement('tr');
        tr.innerHTML=`<td>${r.Date}</td><td>${r.Opponent}</td><td>${r.Venue}</td><td>${r.Result}</td>`;
        tbody.appendChild(tr);
    });
    renderResultsChart(season);
}

// Render pie chart
let resultsChart;
function renderResultsChart(season){
    const data = resultsData[season] || [];
    const counts = {Win:0, Loss:0, Tie:0};
    data.forEach(r=>{if(counts[r.Result]!==undefined) counts[r.Result]++;});

    const chartData = {
        labels: ['Win','Loss','Tie'],
        datasets:[{
            data:[counts.Win, counts.Loss, counts.Tie],
            backgroundColor:['#4caf50','#f44336','#ff9800']
        }]
    };

    if(resultsChart) resultsChart.destroy();
    resultsChart = new Chart(resultsChartCtx, {type:'pie', data:chartData});
}

resultsSeasonSelect.addEventListener('change', e=>{
    renderResultsTable(e.target.value);
});

// Initial render
resultsSeasonSelect.value = Object.keys(resultsData)[0];
renderResultsTable(resultsSeasonSelect.value);

// ===== STATS TABLES =====
const statsTables = {
    'batting':'batting-table',
    'bowling':'bowling-table',
    'superstat':'superstat-table'
};

// Sample player stats
const statsData = {
    '2024': {
        batting:[
            {Player:'Alice', Runs:350, Average:35, 'High Score':80},
            {Player:'Bob', Runs:200, Average:25, 'High Score':50}
        ],
        bowling:[
            {Player:'Alice', Wickets:12, Average:15, Best:'4/20'},
            {Player:'Charlie', Wickets:10, Average:18, Best:'3/25'}
        ],
        superstat:[
            {Player:'Alice', 'Appearance Score':8, 'Bowling Score':9, 'Batting Score':9, 'Fielding Score':7, Total:33}
        ]
    },
    '2023': {
        batting:[
            {Player:'Alice', Runs:300, Average:33, 'High Score':75},
            {Player:'Charlie', Runs:280, Average:28, 'High Score':70}
        ],
        bowling:[
            {Player:'Charlie', Wickets:10, Average:20, Best:'3/30'}
        ],
        superstat:[
            {Player:'Charlie', 'Appearance Score':7, 'Bowling Score':8, 'Batting Score':7, 'Fielding Score':6, Total:28}
        ]
    }
};

// Populate season select
const statsSeasonSelect = document.getElementById('stats-season-select');
Object.keys(statsData).sort((a,b)=>b-a).forEach(season=>{
    const opt = document.createElement('option');
    opt.value = season;
    opt.textContent = season;
    statsSeasonSelect.appendChild(opt);
});

// Populate stats tables
function populateStatsTables(season){
    for(const type in statsTables){
        const tbody = document.getElementById(statsTables[type]).querySelector('tbody');
        tbody.innerHTML='';
        const data = statsData[season][type] || [];
        data.forEach(p=>{
            const tr = document.createElement('tr');
            tr.innerHTML=Object.values(p).map(v=>`<td>${v}</td>`).join('');
            // Make row clickable
            tr.addEventListener('click', ()=>showPlayerDetail(p.Player));
            tbody.appendChild(tr);
        });
    }
}

// Initial render
statsSeasonSelect.value = Object.keys(statsData)[0];
populateStatsTables(statsSeasonSelect.value);

statsSeasonSelect.addEventListener('change', e=>{
    populateStatsTables(e.target.value);
});

// Switch between batting/bowling/superstat tables
const statsCards = document.querySelectorAll('.stats-card');
const tablePanels = document.querySelectorAll('.table-panel');

statsCards.forEach(card=>{
    card.addEventListener('click', ()=>{
        statsCards.forEach(c=>c.classList.remove('active'));
        card.classList.add('active');
        tablePanels.forEach(p=>p.classList.add('hidden'));
        document.getElementById(card.dataset.target).classList.remove('hidden');
    });
});

// ===== PLAYER DETAIL VIEW =====
const playerDetailView = document.getElementById('player-detail-view');
const playerBackBtn = document.getElementById('player-detail-back');
const playerName = document.getElementById('player-name');
const playerPhoto = document.getElementById('player-photo');
const playerTeam = document.getElementById('player-team');
const playerBio = document.getElementById('player-bio');
const playerSeasonSelectDetail = document.getElementById('player-season-select');
const detailMatches = document.getElementById('detail-matches');
const detailRuns = document.getElementById('detail-runs');
const detailWickets = document.getElementById('detail-wickets');
const detailAverage = document.getElementById('detail-average');

// Player detailed data
const playerData = {
    'Alice': {
        team:'CIPA CITMA CC',
        bio:'Top-order batter and occasional bowler.',
        seasons:{
            '2024':{Matches:10,Runs:350,Wickets:12,Average:35},
            '2023':{Matches:8,Runs:300,Wickets:10,Average:33}
        }
    },
    'Bob': {
        team:'CIPA CITMA CC',
        bio:'All-rounder with strong fielding.',
        seasons:{
            '2024':{Matches:8,Runs:200,Wickets:8,Average:25}
        }
    },
    'Charlie': {
        team:'CIPA CITMA CC',
        bio:'Bowling specialist.',
        seasons:{
            '2023':{Matches:9,Runs:280,Wickets:10,Average:28}
        }
    }
};

function showPlayerDetail(name){
    const pdata = playerData[name];
    if(!pdata) return;
    playerDetailView.classList.remove('hidden');
    playerName.textContent = name;
    playerTeam.textContent = pdata.team;
    playerBio.textContent = pdata.bio;

    // Populate seasons
    playerSeasonSelectDetail.innerHTML = '';
    Object.keys(pdata.seasons).sort((a,b)=>b-a).forEach(s=>{
        const opt = document.createElement('option');
        opt.value=s;
        opt.textContent=s;
        playerSeasonSelectDetail.appendChild(opt);
    });
    updatePlayerStats(name, playerSeasonSelectDetail.value);

    // Hide main slides
    document.querySelectorAll('.et-slide').forEach(s=>s.style.display='none');
}

function updatePlayerStats(name, season){
    const pdata = playerData[name];
    if(!pdata || !pdata.seasons[season]) return;
    const s = pdata.seasons[season];
    detailMatches.textContent = s.Matches;
    detailRuns.textContent = s.Runs;
    detailWickets.textContent = s.Wickets;
    detailAverage.textContent = s.Average;
}

playerSeasonSelectDetail.addEventListener('change', e=>{
    updatePlayerStats(playerName.textContent, e.target.value);
});

playerBackBtn.addEventListener('click', ()=>{
    playerDetailView.classList.add('hidden');
    document.querySelectorAll('.et-slide').forEach(s=>s.style.display='flex');
});
