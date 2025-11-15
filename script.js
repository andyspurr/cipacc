// ===== HERO TABS SCROLL & STICKY =====
const tabs = document.querySelectorAll('.et-hero-tab');
const slider = document.querySelector('.et-hero-tab-slider');
const slides = document.querySelectorAll('.et-slide');
const tabContainer = document.querySelector('.et-hero-tabs-container');
const stickyOffset = tabContainer.offsetHeight || 70;

function updateSlider(tab) {
    slider.style.width = tab.offsetWidth + 'px';
    slider.style.left = tab.offsetLeft + 'px';
}

// Scroll to section when tab clicked
tabs.forEach(tab => {
    tab.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(tab.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - stickyOffset,
                behavior: 'smooth'
            });
        }
    });
});

// Highlight tab on scroll
window.addEventListener('scroll', () => {
    let currentSlide = slides[0].id;
    slides.forEach(slide => {
        const rect = slide.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
            currentSlide = slide.id;
        }
    });
    tabs.forEach(tab => {
        if (tab.getAttribute('href') === '#' + currentSlide) {
            tab.classList.add('active');
            updateSlider(tab);
        } else {
            tab.classList.remove('active');
        }
    });
});

// Initialize slider
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
            panel.classList.toggle('hidden', panel.id !== target);
        });
    });
});

// ===== PLAYER DETAIL VIEW =====
const playerDetailView = document.getElementById('player-detail-view');
const playerBackBtn = document.getElementById('player-detail-back');

document.querySelectorAll('.sortable-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
        playerDetailView.classList.remove('hidden');
        window.scrollTo({ top: playerDetailView.offsetTop - stickyOffset, behavior: 'smooth' });
    });
});

playerBackBtn.addEventListener('click', () => {
    playerDetailView.classList.add('hidden');
});

// ===== RESULTS SEASON FILTER =====
const resultsSeasonSelect = document.getElementById('results-season-select');
const resultsTableBody = document.querySelector('#results-table tbody');

function filterResults() {
    const season = resultsSeasonSelect.value;
    resultsTableBody.querySelectorAll('tr').forEach(row => {
        const year = row.cells[0].textContent.split('-')[0];
        row.style.display = season === 'all' || year === season ? '' : 'none';
    });
}

// Populate season select
const years = new Set();
resultsTableBody.querySelectorAll('tr').forEach(row => {
    years.add(row.cells[0].textContent.split('-')[0]);
});
[...years].sort((a,b)=>b-a).forEach(year=>{
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    resultsSeasonSelect.appendChild(option);
});

resultsSeasonSelect.addEventListener('change', filterResults);
filterResults();

// ===== SORTABLE TABLES =====
function sortTable(table, colIndex, type, ascending) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort((a,b) => {
        let x = a.cells[colIndex].textContent.trim();
        let y = b.cells[colIndex].textContent.trim();
        if(type==='number'){ x=parseFloat(x); y=parseFloat(y); }
        if(type==='date'){ x=new Date(x); y=new Date(y); }
        if(x<y) return ascending?-1:1;
        if(x>y) return ascending?1:-1;
        return 0;
    });
    rows.forEach(r => tbody.appendChild(r));
}

document.querySelectorAll('.sortable-table').forEach(table => {
    table.querySelectorAll('th').forEach((th, index) => {
        th.addEventListener('click', () => {
            const type = th.dataset.type || 'string';
            const ascending = !th.classList.contains('asc');
            table.querySelectorAll('th').forEach(h => h.classList.remove('asc','desc'));
            th.classList.toggle('asc', ascending);
            th.classList.toggle('desc', !ascending);
            sortTable(table, index, type, ascending);
        });
    });
});

// ===== ENSURE ALL SECTIONS ARE VISIBLE =====
slides.forEach(slide => slide.style.display = 'block');
