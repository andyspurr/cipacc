// ===== HERO TABS SCROLLING & ACTIVE SLIDER =====
const tabs = document.querySelectorAll('.et-hero-tab');
const slider = document.querySelector('.et-hero-tab-slider');
const slides = document.querySelectorAll('.et-slide');
const tabContainer = document.querySelector('.et-hero-tabs-container');

function updateSlider(tab) {
    slider.style.width = tab.offsetWidth + 'px';
    slider.style.left = tab.offsetLeft + 'px';
}

tabs.forEach(tab => {
    tab.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(tab.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Highlight tab on scroll
window.addEventListener('scroll', () => {
    let current = slides[0].id;
    slides.forEach(slide => {
        const top = slide.getBoundingClientRect().top;
        if (top <= window.innerHeight / 2) {
            current = slide.id;
        }
    });
    tabs.forEach(tab => {
        if (tab.getAttribute('href') === '#' + current) {
            tab.classList.add('active');
            updateSlider(tab);
        } else {
            tab.classList.remove('active');
        }
    });
});

// Initialize slider under first tab
updateSlider(tabs[0]);

// ===== STATS CARD TOGGLE =====
const statsCards = document.querySelectorAll('.stats-card');
const tablePanels = document.querySelectorAll('.table-panel');

statsCards.forEach(card => {
    card.addEventListener('click', () => {
        statsCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const target = card.dataset.target;
        tablePanels.forEach(panel => {
            if (panel.id === target) panel.classList.remove('hidden');
            else panel.classList.add('hidden');
        });
    });
});

// ===== PLAYER DETAIL VIEW =====
const playerDetailView = document.getElementById('player-detail-view');
const playerBackBtn = document.getElementById('player-detail-back');

document.querySelectorAll('.sortable-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
        // Here you would populate the player details dynamically
        playerDetailView.classList.remove('hidden');
        window.scrollTo({ top: playerDetailView.offsetTop - 70, behavior: 'smooth' });
    });
});

playerBackBtn.addEventListener('click', () => {
    playerDetailView.classList.add('hidden');
});

// ===== RESULTS SEASON FILTER =====
const resultsSeasonSelect = document.getElementById('results-season-select');
const resultsTable = document.getElementById('results-table').querySelector('tbody');

function filterResults() {
    const season = resultsSeasonSelect.value;
    resultsTable.querySelectorAll('tr').forEach(row => {
        const date = row.cells[0].textContent.trim();
        const year = date.split('-')[0];
        if (season === 'all' || season === year) row.style.display = '';
        else row.style.display = 'none';
    });
}

// Populate season select dynamically
const years = new Set();
resultsTable.querySelectorAll('tr').forEach(row => {
    years.add(row.cells[0].textContent.split('-')[0]);
});
[...years].sort((a,b) => b-a).forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    resultsSeasonSelect.appendChild(option);
});

resultsSeasonSelect.addEventListener('change', filterResults);
filterResults();

// ===== SORTABLE TABLES =====
function sortTable(table, col, type) {
    const tbody = table.querySelector('tbody');
    Array.from(tbody.querySelectorAll('tr'))
        .sort((a, b) => {
            let x = a.cells[col].textContent.trim();
            let y = b.cells[col].textContent.trim();
            if (type === 'number') { x = parseFloat(x); y = parseFloat(y); }
            if (type === 'date') { x = new Date(x); y = new Date(y); }
            if (x < y) return -1;
            if (x > y) return 1;
            return 0;
        })
        .forEach(tr => tbody.appendChild(tr));
}

document.querySelectorAll('.sortable-table').forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach((th, i) => {
        th.addEventListener('click', () => {
            const type = th.dataset.type || 'string';
            const ascending = !th.classList.contains('asc');
            headers.forEach(h => h.classList.remove('asc','desc'));
            th.classList.toggle('asc', ascending);
            th.classList.toggle('desc', !ascending);
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            rows.sort((a,b) => {
                let x = a.cells[i].textContent.trim();
                let y = b.cells[i].textContent.trim();
                if (type==='number'){ x=parseFloat(x); y=parseFloat(y); }
                if (type==='date'){ x=new Date(x); y=new Date(y); }
                if(x<y) return ascending?-1:1;
                if(x>y) return ascending?1:-1;
                return 0;
            });
            rows.forEach(r=>table.querySelector('tbody').appendChild(r));
        });
    });
});
