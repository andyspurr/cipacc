// ==== MENU STICKY + TAB HIGHLIGHT ====
const tabsContainer = document.querySelector('.et-hero-tabs-container');
const tabs = document.querySelectorAll('.et-hero-tab');
const tabSlider = document.querySelector('.et-hero-tab-slider');

function updateSlider(tab) {
    const rect = tab.getBoundingClientRect();
    const containerRect = tabsContainer.getBoundingClientRect();
    tabSlider.style.width = rect.width + 'px';
    tabSlider.style.left = (rect.left - containerRect.left) + 'px';
}

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        updateSlider(tab);

        const target = document.querySelector(tab.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initialize first tab slider
if (tabs.length) {
    tabs[0].classList.add('active');
    updateSlider(tabs[0]);
}

// Sticky menu
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > tabsContainer.offsetTop) {
        tabsContainer.classList.add('et-hero-tabs-container--top');
    } else {
        tabsContainer.classList.remove('et-hero-tabs-container--top');
    }
});

// ==== RESULTS DATA AND TABLE ====
const resultsData = [
    { date: "2024-06-10", opponent: "Team A", venue: "Home", result: "Win", season: "2024" },
    { date: "2024-07-03", opponent: "Team B", venue: "Away", result: "Loss", season: "2024" },
    { date: "2023-05-12", opponent: "Team C", venue: "Home", result: "Win", season: "2023" },
    { date: "2022-06-18", opponent: "Team D", venue: "Away", result: "Tie", season: "2022" }
];

const resultsTableBody = document.querySelector('#results-table tbody');
const seasonSelect = document.querySelector('#results-season-select');

function populateSeasonSelect() {
    const seasons = [...new Set(resultsData.map(r => r.season))].sort((a,b)=>b-a);
    seasons.forEach(s => {
        const option = document.createElement('option');
        option.value = s;
        option.textContent = s;
        seasonSelect.appendChild(option);
    });
}

function populateResultsTable(season='all') {
    resultsTableBody.innerHTML = '';
    const filtered = season === 'all' ? resultsData : resultsData.filter(r => r.season === season);
    filtered.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.date}</td><td>${r.opponent}</td><td>${r.venue}</td><td>${r.result}</td>`;
        resultsTableBody.appendChild(tr);
    });
    updatePieChart(filtered);
}

// ==== PIE CHART ====
let pieChart;
const pieCtx = document.getElementById('results-pie-chart').getContext('2d');
function updatePieChart(data) {
    const counts = { Win: 0, Loss: 0, Tie: 0 };
    data.forEach(r => counts[r.result] = (counts[r.result] || 0) + 1);

    const chartData = {
        labels: ['Win', 'Loss', 'Tie'],
        datasets: [{
            data: [counts.Win, counts.Loss, counts.Tie],
            backgroundColor: ['#4caf50','#f44336','#ff9800']
        }]
    };

    if(pieChart) pieChart.destroy();
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: chartData,
        options: { responsive:true, plugins:{legend:{position:'bottom'}} }
    });
}

seasonSelect.addEventListener('change', () => {
    populateResultsTable(seasonSelect.value);
});

// ==== STATS DATA AND TABLES ====
const statsData = {
    "2024": {
        batting: [
            { player:"Alice", runs:250, average:25.0, highScore:50 },
            { player:"Bob", runs:180, average:18.0, highScore:40 }
        ],
        bowling: [
            { player:"Alice", wickets:5, average:20, best:"2/15" },
            { player:"Bob", wickets:8, average:15, best:"4/20" }
        ],
        superstat: [
            { player:"Alice", appearanceScore:8, bowlingScore:5, battingScore:7, fieldingScore:6, total:26 },
            { player:"Bob", appearanceScore:9, bowlingScore:8, battingScore:6, fieldingScore:5, total:28 }
        ]
    },
    "2023": {
        batting: [
            { player:"Charlie", runs:300, average:30.0, highScore:60 }
        ],
        bowling: [
            { player:"Charlie", wickets:10, average:18, best:"5/25" }
        ],
        superstat: [
            { player:"Charlie", appearanceScore:10, bowlingScore:9, battingScore:8, fieldingScore:7, total:34 }
        ]
    }
};

const statsSeasonSelect = document.querySelector('#stats-season-select');
const statsCards = document.querySelectorAll('.stats-card');
const tablePanels = document.querySelectorAll('.table-panel');

function populateStatsSeasonSelect() {
    const seasons = Object.keys(statsData).sort((a,b)=>b-a);
    seasons.forEach(s => {
        const option = document.createElement('option');
        option.value = s;
        option.textContent = s;
        statsSeasonSelect.appendChild(option);
    });
}

function populateStatsTables(season) {
    // Batting
    const battingBody = document.querySelector('#batting-table tbody');
    battingBody.innerHTML = '';
    statsData[season].batting.forEach(p=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${p.player}</td><td>${p.runs}</td><td>${p.average}</td><td>${p.highScore}</td>`;
        battingBody.appendChild(tr);
    });
    // Bowling
    const bowlingBody = document.querySelector('#bowling-table tbody');
    bowlingBody.innerHTML = '';
    statsData[season].bowling.forEach(p=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${p.player}</td><td>${p.wickets}</td><td>${p.average}</td><td>${p.best}</td>`;
        bowlingBody.appendChild(tr);
    });
    // Superstat
    const superBody = document.querySelector('#superstat-table tbody');
    superBody.innerHTML = '';
    statsData[season].superstat.forEach(p=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${p.player}</td><td>${p.appearanceScore}</td><td>${p.bowlingScore}</td><td>${p.battingScore}</td><td>${p.fieldingScore}</td><td>${p.total}</td>`;
        superBody.appendChild(tr);
    });
}

// Stats panel switching
statsCards.forEach(card => {
    card.addEventListener('click', () => {
        statsCards.forEach(c=>c.classList.remove('active'));
        card.classList.add('active');
        const target = card.dataset.target;
        tablePanels.forEach(p=>{
            p.id === target ? p.classList.remove('hidden') : p.classList.add('hidden');
        });
    });
});

statsSeasonSelect.addEventListener('change', () => {
    populateStatsTables(statsSeasonSelect.value);
});

// ==== INITIALIZATION ====
populateSeasonSelect();
populateResultsTable('all');
populateStatsSeasonSelect();
populateStatsTables(statsSeasonSelect.value);
