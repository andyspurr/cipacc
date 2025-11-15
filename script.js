// ====== MAIN MENU TABS ======
const tabs = document.querySelectorAll('.et-hero-tab');
const tabSlider = document.querySelector('.et-hero-tab-slider');
const tabContainer = document.querySelector('.et-hero-tabs-container');

function activateTab(tab) {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Move slider
    tabSlider.style.width = tab.offsetWidth + 'px';
    tabSlider.style.left = tab.offsetLeft + 'px';
}

tabs.forEach(tab => {
    tab.addEventListener('click', e => {
        e.preventDefault();
        const targetId = tab.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        activateTab(tab);
    });
});

// Initialize slider under first tab
activateTab(tabs[0]);

// ====== STICKY MENU ======
window.addEventListener('scroll', () => {
    if(window.scrollY > tabContainer.offsetTop) {
        tabContainer.classList.add('et-hero-tabs-container--top');
    } else {
        tabContainer.classList.remove('et-hero-tabs-container--top');
    }

    // Highlight active tab on scroll
    document.querySelectorAll('.et-slide').forEach((slide, idx) => {
        const rect = slide.getBoundingClientRect();
        if(rect.top <= 100 && rect.bottom >= 100) {
            activateTab(tabs[idx]);
        }
    });
});

// ====== RESULTS TABLE ======
const resultsTable = document.getElementById('results-table');
const resultsSeasonSelect = document.getElementById('results-season-select');

// Example data per season
const resultsData = {
    "2024": [
        { Date: "2024-06-10", Opponent: "Team A", Venue: "Home", Result: "Win" },
        { Date: "2024-07-03", Opponent: "Team B", Venue: "Away", Result: "Loss" }
    ],
    "2023": [
        { Date: "2023-05-12", Opponent: "Team C", Venue: "Home", Result: "Win" }
    ],
    "2022": [
        { Date: "2022-06-18", Opponent: "Team D", Venue: "Away", Result: "Tie" }
    ]
};

// Populate season select
Object.keys(resultsData).forEach(season => {
    const option = document.createElement('option');
    option.value = season;
    option.textContent = season;
    resultsSeasonSelect.appendChild(option);
});

// Function to populate results table
function populateResults(season) {
    const tbody = resultsTable.querySelector('tbody');
    tbody.innerHTML = '';
    const data = season === 'all' ? Object.values(resultsData).flat() : resultsData[season];
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(val => {
            const td = document.createElement('td');
            td.textContent = val;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    updateResultsChart(data);
}

// Listen to season change
resultsSeasonSelect.addEventListener('change', () => {
    populateResults(resultsSeasonSelect.value);
});

// Initialize results table with all
populateResults('all');

// ====== RESULTS PIE CHART ======
let resultsChart;
function updateResultsChart(data) {
    const counts = { Win: 0, Loss: 0, Tie: 0 };
    data.forEach(r => {
        counts[r.Result] = (counts[r.Result] || 0) + 1;
    });

    const ctx = document.getElementById('results-pie-chart').getContext('2d');
    if(resultsChart) resultsChart.destroy();

    resultsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Win', 'Loss', 'Tie'],
            datasets: [{
                data: [counts.Win, counts.Loss, counts.Tie],
                backgroundColor: ['#4caf50','#f44336','#ff9800']
            }]
        },
        options: {
            responsive: true
        }
    });
}

// ====== STATS TABLES ======
const statsData = {
    "2024": {
        batting: [
            { Player: "Alice", Runs: 120, Average: 24, "High Score": 50 },
            { Player: "Bob", Runs: 90, Average: 18, "High Score": 40 }
        ],
        bowling: [
            { Player: "Alice", Wickets: 5, Average: 22, Best: "3/15" },
            { Player: "Bob", Wickets: 8, Average: 19, Best: "4/20" }
        ],
        superstat: [
            { Player: "Alice", "Appearance Score": 10, "Bowling Score": 5, "Batting Score": 4, "Fielding Score": 3, Total: 22 },
            { Player: "Bob", "Appearance Score": 12, "Bowling Score": 8, "Batting Score": 3, "Fielding Score": 2, Total: 25 }
        ]
    },
    "2023": {
        batting: [
            { Player: "Charlie", Runs: 80, Average: 20, "High Score": 35 }
        ],
        bowling: [
            { Player: "Charlie", Wickets: 6, Average: 21, Best: "3/12" }
        ],
        superstat: [
            { Player: "Charlie", "Appearance Score": 8, "Bowling Score": 6, "Batting Score": 3, "Fielding Score": 2, Total: 19 }
        ]
    }
};

const statsSeasonSelect = document.getElementById('stats-season-select');
Object.keys(statsData).forEach(season => {
    const option = document.createElement('option');
    option.value = season;
    option.textContent = season;
    statsSeasonSelect.appendChild(option);
});

// Populate stats tables
function populateStats(season) {
    const seasonData = statsData[season];
    populateTable('batting-table', seasonData.batting);
    populateTable('bowling-table', seasonData.bowling);
    populateTable('superstat-table', seasonData.superstat);
}

function populateTable(tableId, data) {
    const tbody = document.getElementById(tableId).querySelector('tbody');
    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(val => {
            const td = document.createElement('td');
            td.textContent = val;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// Listen to stats season change
statsSeasonSelect.addEventListener('change', () => {
    populateStats(statsSeasonSelect.value);
});

// Initialize stats table with first season
populateStats(Object.keys(statsData)[0]);

// ====== STATS TAB SWITCHING ======
const statCards = document.querySelectorAll('.stats-card');
const tablePanels = document.querySelectorAll('.table-panel');

statCards.forEach(card => {
    card.addEventListener('click', () => {
        statCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        tablePanels.forEach(panel => panel.classList.add('hidden'));
        const target = document.getElementById(card.dataset.target);
        target.classList.remove('hidden');
    });
});

// ====== PLAYER DETAIL VIEW ======
const playerDetailView = document.getElementById('player-detail-view');
const playerDetailBack = document.getElementById('player-detail-back');

playerDetailBack.addEventListener('click', () => {
    playerDetailView.classList.add('hidden');
    document.querySelector('.et-main').style.display = 'block';
});
