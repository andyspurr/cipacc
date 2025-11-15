// ===== GLOBAL VARIABLES =====
const tabs = document.querySelectorAll('.et-hero-tab');
const tabSlider = document.querySelector('.et-hero-tab-slider');
const tabContainer = document.querySelector('.et-hero-tabs-container');
const slides = document.querySelectorAll('.et-slide');
const playerDetailView = document.getElementById('player-detail-view');
const playerBackBtn = document.getElementById('player-detail-back');
const playerName = document.getElementById('player-name');
const playerTeam = document.getElementById('player-team');
const playerBio = document.getElementById('player-bio');
const playerSeasonSelectDetail = document.getElementById('player-season-select');

// ===== STICKY MENU =====
const stickyOffset = tabContainer.offsetTop;
window.addEventListener('scroll', () => {
    if(window.pageYOffset > stickyOffset){
        tabContainer.classList.add('et-hero-tabs-container--top');
    } else {
        tabContainer.classList.remove('et-hero-tabs-container--top');
    }
});

// ===== INITIALIZE SLIDES =====
slides.forEach(s => s.style.display = 'flex');

// ===== TAB NAVIGATION =====
function setActiveTab(activeTab){
    tabs.forEach(tab => tab.classList.remove('active'));
    activeTab.classList.add('active');

    const rect = activeTab.getBoundingClientRect();
    const containerRect = tabContainer.getBoundingClientRect();
    tabSlider.style.width = `${rect.width}px`;
    tabSlider.style.left = `${activeTab.offsetLeft}px`;
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

// ===== FIXTURES TABLE =====
// Already in HTML, no additional JS needed

// ===== RESULTS TABLE =====
const resultsTableBody = document.querySelector('#results-table tbody');
const resultsSeasonSelect = document.getElementById('results-season-select');

const resultsData = [
    {date:'2024-06-10', opponent:'Team A', venue:'Home', result:'Win', season:'2024'},
    {date:'2024-07-03', opponent:'Team B', venue:'Away', result:'Loss', season:'2024'},
    {date:'2023-05-12', opponent:'Team C', venue:'Home', result:'Win', season:'2023'},
    {date:'2022-06-18', opponent:'Team D', venue:'Away', result:'Tie', season:'2022'},
];

// Populate season filter
const seasons = Array.from(new Set(resultsData.map(d=>d.season))).sort((a,b)=>b-a);
seasons.forEach(s=>{
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    resultsSeasonSelect.appendChild(opt);
});

// Render results table
function renderResultsTable(season){
    resultsTableBody.innerHTML = '';
    resultsData.filter(r => season === 'all' || r.season === season)
        .forEach(r=>{
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${r.date}</td><td>${r.opponent}</td><td>${r.venue}</td><td>${r.result}</td>`;
            resultsTableBody.appendChild(tr);
        });
    updateResultsPieChart(season);
}

resultsSeasonSelect.addEventListener('change', e=>{
    renderResultsTable(e.target.value);
});

// ===== RESULTS PIE CHART =====
const ctx = document.getElementById('results-pie-chart').getContext('2d');
let pieChart;

function updateResultsPieChart(season){
    const filtered = resultsData.filter(r => season==='all'||r.season===season);
    const counts = {Win:0, Loss:0, Tie:0};
    filtered.forEach(r=>{ counts[r.result]++; });
    const data = [counts.Win, counts.Loss, counts.Tie];

    if(pieChart) pieChart.destroy();

    pieChart = new Chart(ctx, {
        type:'pie',
        data:{
            labels:['Win','Loss','Tie'],
            datasets:[{
                data:data,
                backgroundColor:['#4caf50','#f44336','#ffc107']
            }]
        },
        options:{responsive:true}
    });
}

// Initialize table and chart
renderResultsTable('all');

// ===== PLAYER STATS =====
const statsCards = document.querySelectorAll('.stats-card');
const tablePanels = document.querySelectorAll('.table-panel');
const statsSeasonSelect = document.getElementById('stats-season-select');

const playerData = {
    "Alice": {
        team:"CIPA CITMA",
        bio:"Alice is an all-rounder.",
        seasons:{
            "2024": {batting:{Runs:250,Average:50,High:75},bowling:{Wickets:12,Average:18,Best:"4/22"},superstat:{AppearanceScore:8,BowlingScore:12,BattingScore:15,FieldingScore:5,Total:40}},
            "2023": {batting:{Runs:180,Average:45,High:60},bowling:{Wickets:8,Average:22,Best:"3/18"},superstat:{AppearanceScore:7,BowlingScore:8,BattingScore:12,FieldingScore:6,Total:33}}
        }
    },
    "Bob": {
        team:"CIPA CITMA",
        bio:"Bob is a specialist batsman.",
        seasons:{
            "2024": {batting:{Runs:300,Average:60,High:85},bowling:{Wickets:2,Average:40,Best:"1/12"},superstat:{AppearanceScore:9,BowlingScore:3,BattingScore:20,FieldingScore:4,Total:36}},
            "2023": {batting:{Runs:220,Average:44,High:70},bowling:{Wickets:3,Average:35,Best:"2/20"},superstat:{AppearanceScore:8,BowlingScore:4,BattingScore:15,FieldingScore:5,Total:32}}
        }
    }
};

// Populate stats season filter
const statSeasons = Array.from(new Set(Object.values(playerData).flatMap(p => Object.keys(p.seasons)))).sort((a,b)=>b-a);
statSeasons.forEach(s=>{
    const opt = document.createElement('option');
    opt.value=s;
    opt.textContent=s;
    statsSeasonSelect.appendChild(opt);
});

// Render stats table
function renderStatsTable(season){
    const battingBody = document.querySelector('#batting-table tbody');
    const bowlingBody = document.querySelector('#bowling-table tbody');
    const superstatBody = document.querySelector('#superstat-table tbody');
    battingBody.innerHTML = '';
    bowlingBody.innerHTML = '';
    superstatBody.innerHTML = '';

    Object.entries(playerData).forEach(([name,data])=>{
        if(!data.seasons[season]) return;
        const s = data.seasons[season];
        // Batting
        const trBat = document.createElement('tr');
        trBat.innerHTML = `<td>${name}</td><td>${s.batting.Runs}</td><td>${s.batting.Average}</td><td>${s.batting.High}</td>`;
        battingBody.appendChild(trBat);
        // Bowling
        const trBowl = document.createElement('tr');
        trBowl.innerHTML = `<td>${name}</td><td>${s.bowling.Wickets}</td><td>${s.bowling.Average}</td><td>${s.bowling.Best}</td>`;
        bowlingBody.appendChild(trBowl);
        // Superstat
        const trSuper = document.createElement('tr');
        trSuper.innerHTML = `<td>${name}</td><td>${s.superstat.AppearanceScore}</td><td>${s.superstat.BowlingScore}</td><td>${s.superstat.BattingScore}</td><td>${s.superstat.FieldingScore}</td><td>${s.superstat.Total}</td>`;
        superstatBody.appendChild(trSuper);
    });
}

statsSeasonSelect.addEventListener('change', e=>{
    renderStatsTable(e.target.value);
});

// Initialize stats table
renderStatsTable(statSeasons[0]);

// ===== STATS CARD SWITCH =====
statsCards.forEach(card=>{
    card.addEventListener('click', ()=>{
        statsCards.forEach(c=>c.classList.remove('active'));
        card.classList.add('active');
        const target = card.getAttribute('data-target');
        tablePanels.forEach(panel=>{
            if(panel.id === target) panel.classList.remove('hidden');
            else panel.classList.add('hidden');
        });
    });
});

// ===== PLAYER DETAIL VIEW =====
function showPlayerDetail(name){
    const pdata = playerData[name];
    if(!pdata) return;

    playerDetailView.classList.remove('hidden');
    playerName.textContent = name;
    playerTeam.textContent = pdata.team;
    playerBio.textContent = pdata.bio;

    playerSeasonSelectDetail.innerHTML = '';
    Object.keys(pdata.seasons).sort((a,b)=>b-a).forEach(s=>{
        const opt = document.createElement('option');
        opt.value=s;
        opt.textContent=s;
        playerSeasonSelectDetail.appendChild(opt);
    });
    updatePlayerStats(name, playerSeasonSelectDetail.value);

    slides.forEach(s => s.style.display = 'none');
}

function updatePlayerStats(name, season){
    const pdata = playerData[name];
    if(!pdata || !pdata.seasons[season]) return;
    const s = pdata.seasons[season];
    document.getElementById('detail-matches').textContent = "N/A";
    document.getElementById('detail-runs').textContent = s.batting.Runs;
    document.getElementById('detail-wickets').textContent = s.bowling.Wickets;
    document.getElementById('detail-average').textContent = s.batting.Average;
}

playerBackBtn.addEventListener('click', ()=>{
    playerDetailView.classList.add('hidden');
    slides.forEach(s => s.style.display = 'flex');
});

playerSeasonSelectDetail.addEventListener('change', e=>{
    updatePlayerStats(playerName.textContent, e.target.value);
});
