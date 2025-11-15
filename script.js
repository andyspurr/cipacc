/* ===== BASE STYLES ===== */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  scroll-behavior: smooth;
  background: #f8f8f8;
}

h1 {
  font-family: "Bodoni Moda", serif;
  font-style: italic;
  letter-spacing: 0.5em;
  font-weight: 400;
  font-size: 3em;
  margin: 0.4em 0;
}

h2 {
  font-family: "Bodoni Moda", serif;
  font-style: italic;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-align: center;
  margin: 0;
  padding-top: 1.5em;
  color: #222;
  font-size: 1.5rem;
}

h3 {
  font-family: "Arial", sans-serif;
  font-weight: normal;
  letter-spacing: 0.05em;
  font-size: 1em;
  margin: 0.4em 0;
}

a {
  text-decoration: none;
}

/* ===== HERO SECTION ===== */
.et-hero-tabs {
  position: relative;
  height: 350px; /* smaller than full viewport */
  background-image: url('images/2018team.jpg');
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  color: white;
  text-align: center;
  overflow: hidden;
}

.et-hero-tabs::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 0;
}

.et-hero-content {
  position: relative;
  z-index: 1;
}

/* ===== STICKY MENU ===== */
.et-hero-tabs-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 12px 0;
  background: rgba(255, 255, 255, 0.95);
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.12);
}

.et-hero-tab {
  color: #333;
  padding: 8px 10px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.25s ease;
}

.et-hero-tab.active {
  color: #0077cc;
  font-weight: 600;
}

.et-hero-tab:hover {
  color: #0077cc;
}

.et-hero-tab-slider {
  position: absolute;
  bottom: 0;
  height: 3px;
  background: #0077cc;
  transition: left 0.25s ease, width 0.25s ease;
}

/* ===== MAIN CONTENT ===== */
.et-main {
  padding: 0;
  margin-top: 350px; /* push content below hero */
}

.et-slide {
  min-height: 80vh;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.et-slide:nth-child(even) {
  background: #fafafa;
}

/* ===== TABLES ===== */
.sortable-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

.sortable-table th, .sortable-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.sortable-table th {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.sortable-table th.asc::after {
  content: " ▲";
  font-size: 0.75rem;
}
.sortable-table th.desc::after {
  content: " ▼";
  font-size: 0.75rem;
}

.sortable-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.sortable-table tbody tr:hover {
  background-color: #f1f1f1;
}

/* ===== RESULTS SECTION ===== */
.results-filter-container {
  position: sticky;
  top: 60px;
  z-index: 10;
  width: 90%;
  max-width: 900px;
  margin: 0 auto 10px auto;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.results-dashboard {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 90%;
  max-width: 1000px;
  margin: 20px auto;
  gap: 20px;
}

.results-table-wrapper {
  flex: 1 1 60%;
  min-width: 300px;
  overflow-x: auto;
}

.results-chart-container {
  flex: 1 1 35%;
  min-width: 250px;
  margin: 20px 0;
}

/* ===== STATS SECTION ===== */
.stats-cards { display:flex; gap:10px; margin-bottom:10px; }
.stats-card { padding:5px 10px; border:1px solid #ccc; cursor:pointer; border-radius:4px; background:#f5f5f5; }
.stats-card.active { background:#4caf50; color:white; }
.table-panel.hidden { display:none; }

/* ===== PLAYER DETAIL POPUP ===== */
#player-detail-view {
  width: 90%;
  max-width: 700px;
  margin: 40px auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  display: none;
}

.back-btn {
  background: none;
  border: none;
  color: #0077cc;
  font-size: 1.2rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  margin-bottom: 1.5rem;
}
