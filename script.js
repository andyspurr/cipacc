// ===== ELEMENTS =====
const tabs = document.querySelectorAll('.et-hero-tab');
const slider = document.querySelector('.et-hero-tab-slider');
const slides = document.querySelectorAll('.et-slide');
const tabsContainer = document.querySelector('.et-hero-tabs-container');

const resultsTable = document.getElementById('results-table').querySelector('tbody');
const resultsSeasonSelect = document.getElementById('results-season-select');

const statsSeasonSelect = document.getElementById('stats-season-select');
const statsSearch = document.getElementById('stats-search');

const statsCards = document.querySelectorAll('.stats-card');
const tablePanels = document.querySelectorAll('.table-panel');

const playerDetailView = document.getElementById('player-detail-view');
const playerBackBtn = document.getElementById('player-detail-back');
const playerPhoto = document.getElementById('player-photo');
const playerNameEl = document.getElementById('player-name');
const playerTeamEl = document.getElementById('player-team');
const playerBioEl = document.getElementById('player-bio');
const playerSeasonSelect = document.getElementById('player-season-select');
const detailMatches = document.getElementById('detail-matches');
const detailRuns = document.getElementById('detail-runs');
const detailWickets = document.getElementById('detail-wickets');
const detailAverage = document.getElementById('detail-average');

// ===== SAMPLE DATA =====
const resultsData = [
    {date:'2024-06-10', opponent:'Team A', venue:'Home', result:'Win', season:'2024'},
    {date:'2024-07-03', opponent:'Team B', venue:'Away', result:'Loss', season:'2024'},
    {date:'2023-05-12', opponent:'Team C', venue:'Home', result:'Win', season:'2023'},
    {date:'2022-06-18', opponent:'Team D', venue:'Away', result:'Tie', season:'2022'}
];

const playerData = {
    "Alice": {
        photo: '', team:'CIPA CITMA', bio:'Top order batsman', seasons:{
            '2024': {matches:5, runs:220, wickets:2, average:44},
            '2023': {matches:6, runs:190, wickets:1, average:31.7}
        }
    },
    "Bob": {
        photo: '', team:'CIPA CITMA', bio:'Fast bowler', seasons:{
            '2024': {matches:5, runs:50, wickets:8, average:6.25},
            '2023': {matches:6, runs:40, wickets:10, average:4}
        }
    }
};

// ===== HELPER FUNCTIONS =====
function showSlides(){
    slides.forEach(s => s.style.display = 'flex');
}

function setActiveTab(tab){
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Move slider
    slider.style.width = tab.offsetWidth + 'px';
    slider.style.left = tab.offsetLeft + 'px';
}

// ===== TAB NAVIGATION =====
tabs.forEach(tab => {
    tab.addEventListener('click', e => {
        e.preventDefault();
        const targetId = tab.getAttribute('href').substring(1);
        const targetSlide = document.getElementById(targetId);
        if(targetSlide){
            window.scrollTo({
                top: targetSlide.offsetTop - tabsContainer.offsetHeight,
                behavior: 'smooth'
            });
            setActiveTab(tab);
        }
    });
});

// ===== STICKY MENU =====
window.addEventListener('scroll', ()=>{
    if(window.scrollY > window.innerHeight){
        tabsContainer.classList.add('et-hero-tabs-container--top');
    } else {
        tabsContainer.classList.remove('et-hero-tabs-container--top');
    }

    // Highlight tab based on section
    slides.forEach((slide,i)=>{
        const rect = slide.getBoundingClientRect();
        if(rect.top <= tabsContainer.offsetHeight + 10 && rect.bottom > tabsContainer.offsetHeight){
            setActiveTab(tabs[i]);
        }
    });
});

// ===== RESULTS TABLE =====
function populateResults(season='all'){
    resultsTable.innerHTML = '';
    const filtered = season==='all' ? resultsData : resultsData.filter(r=>r.season===season);
    filtered.forEach(r=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.date}</td><td>${r.opponent}</td><td>${r.venue}</td><td>${r.result}</td>`;
        resultsTable.appendChild(tr);
    });
}
function populateResultsSeasons(){
    const seasons = [...new Set(resultsData.map(r=>r.season))].sort().reverse();
    seasons.forEach(s=>{
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        resultsSeasonSelect.appendChild(opt);
    });
}

// ===== RESULTS PIE CHART =====
function renderResultsChart(season='all'){
    const filtered = season==='all' ? resultsData : resultsData.filter(r=>r.season===season);
    const counts = {Win:0, Loss:0, Tie:0};
    filtered.forEach(r=> counts[r.result] = (counts[r.result] || 0)+1);

    const ctx = document.getElementById('results-pie-chart').getContext('2d');
    if(window.resultsChart) window.resultsChart.destroy();
    window.resultsChart = new Chart(ctx, {
        type:'pie',
        data:{
            labels:['Win','Loss','Tie'],
            datasets:[{data:[counts.Win, counts.Loss, counts.Tie], backgroundColor:['#4caf50','#f44336','#ff9800']}]
        }
    });
}

resultsSeasonSelect.addEventListener('change', e=>{
    populateResults(e.target.value);
    renderResultsChart(e.target.value);
});

// ===== STATS TABLES =====
function populateStatsTables(season='2024'){
    tablePanels.forEach(panel => {
        const tbody = panel.querySelector('tbody');
        tbody.innerHTML = '';
        Object.entries(playerData).forEach(([name,data])=>{
            if(!data.seasons[season]) return;
            const s = data.seasons[season];
            if(panel.id==='batting-panel'){
                const tr = document.createElement('tr');
                tr.innerHTML=`<td>${name}</td><td>${s.runs}</td><td>${s.average}</td><td>${Math.max(s.runs)}</td>`;
                tbody.appendChild(tr);
            }
            else if(panel.id==='bowling-panel'){
                const tr = document.createElement('tr');
                tr.innerHTML=`<td>${name}</td><td>${s.wickets}</td><td>${s.average}</td><td>${Math.max(s.wickets)}</td>`;
                tbody.appendChild(tr);
            }
            else if(panel.id==='superstat-panel'){
                const total = s.runs + s.wickets + s.average;
                const tr = document.createElement('tr');
                tr.innerHTML=`<td>${name}</td><td>${s.runs}</td><td>${s.wickets}</td><td>${s.runs}</td><td>${s.average}</td><td>${total}</td>`;
                tbody.appendChild(tr);
            }
        });
    });
}

function populateStatsSeasons(){
    const seasons = [...new Set(Object.values(playerData).flatMap(d=>Object.keys(d.seasons)))].sort().reverse();
    seasons.forEach(s=>{
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        statsSeasonSelect.appendChild(opt);
        playerSeasonSelect.appendChild(opt.cloneNode(true));
    });
}

statsSeasonSelect.addEventListener('change', e=>{
    populateStatsTables(e.target.value);
});

statsCards.forEach(card=>{
    card.addEventListener('click', ()=>{
        statsCards.forEach(c=>c.classList.remove('active'));
        card.classList.add('active');
        tablePanels.forEach(p=>p.classList.add('hidden'));
        document.getElementById(card.dataset.target).classList.remove('hidden');
    });
});

// ===== PLAYER DETAIL =====
function showPlayerDetail(name){
    const pdata = playerData[name];
    if(!pdata) return;
    playerDetailView.classList.remove('hidden');
    slides.forEach(s=>s.style.display='none');

    playerNameEl.textContent = name;
    playerTeamEl.textContent = pdata.team;
    playerBioEl.textContent = pdata.bio;
    if(pdata.photo){
        playerPhoto.src = pdata.photo;
        playerPhoto.style.display='block';
    } else playerPhoto.style.display='none';

    // Populate season stats
    playerSeasonSelect.value = Object.keys(pdata.seasons)[0];
    updatePlayerSeasonStats(name, playerSeasonSelect.value);
}

function updatePlayerSeasonStats(name, season){
    const pdata = playerData[name];
    const s = pdata.seasons[season];
    if(!s) return;
    detailMatches.textContent = s.matches;
    detailRuns.textContent = s.runs;
    detailWickets.textContent = s.wickets;
    detailAverage.textContent = s.average;
}

playerBackBtn.addEventListener('click', ()=>{
    playerDetailView.classList.add('hidden');
    slides.forEach(s=>s.style.display='flex');
});

playerSeasonSelect.addEventListener('change', e=>{
    updatePlayerSeasonStats(playerNameEl.textContent, e.target.value);
});

// ===== INITIALIZE =====
showSlides();
populateResultsSeasons();
populateResults();
renderResultsChart();
populateStatsSeasons();
populateStatsTables(statsSeasonSelect.value);
setActiveTab(tabs[0]);
