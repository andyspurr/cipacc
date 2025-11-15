document.addEventListener("DOMContentLoaded", () => {
  /* ========================
     HERO TABS + SLIDER + SCROLL
     ======================== */
  const tabs = document.querySelectorAll(".et-hero-tab");
  const slides = document.querySelectorAll(".et-slide");
  const slider = document.querySelector(".et-hero-tab-slider");
  const tabContainer = document.querySelector(".et-hero-tabs-container");

  function moveSlider(tab) {
    const rect = tab.getBoundingClientRect();
    const containerRect = tab.parentElement.getBoundingClientRect();
    slider.style.left = `${rect.left - containerRect.left}px`;
    slider.style.width = `${rect.width}px`;
  }

  // Click tabs to scroll to section
  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(tab.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - tabContainer.offsetHeight,
          behavior: "smooth"
        });
      }
    });
  });

  // Update slider as you scroll
  function updateActiveTab() {
    let currentIndex = slides.length - 1;
    const scrollPos = window.scrollY + tabContainer.offsetHeight + 10;
    slides.forEach((slide, i) => {
      if (scrollPos >= slide.offsetTop) currentIndex = i;
    });

    tabs.forEach(t => t.classList.remove("active"));
    if (tabs[currentIndex]) {
      tabs[currentIndex].classList.add("active");
      moveSlider(tabs[currentIndex]);
    }
  }

  window.addEventListener("scroll", updateActiveTab);
  updateActiveTab(); // initial

  /* ========================
     STICKY MENU
     ======================== */
  const stickyOffset = tabContainer.offsetTop;
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > stickyOffset) {
      tabContainer.classList.add("et-hero-tabs-container--top");
    } else {
      tabContainer.classList.remove("et-hero-tabs-container--top");
    }
  });

  /* ========================
     STATS CARDS SWITCH PANELS
     ======================== */
  const cards = document.querySelectorAll(".stats-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const targetPanel = document.getElementById(card.dataset.target);
      document.querySelectorAll(".table-panel").forEach(panel => {
        panel.classList.add("hidden");
      });
      targetPanel.classList.remove("hidden");
    });
  });

  /* ========================
     RESULTS SEASON FILTER
     ======================== */
  const resultsTable = document.getElementById("results-table");
  const seasonSelect = document.getElementById("results-season-select");

  const seasons = new Set();
  Array.from(resultsTable.querySelectorAll("tbody tr")).forEach(row => {
    const year = new Date(row.cells[0].textContent).getFullYear();
    seasons.add(year);
  });

  Array.from(seasons).sort((a,b)=>b-a).forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    seasonSelect.appendChild(option);
  });

  seasonSelect.addEventListener("change", () => {
    const selected = seasonSelect.value;
    Array.from(resultsTable.querySelectorAll("tbody tr")).forEach(row => {
      const year = new Date(row.cells[0].textContent).getFullYear();
      if (selected === "all" || selected == year) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });

    updateResultsChart();
  });

  /* ========================
     CHART.JS PIE CHART
     ======================== */
  const ctx = document.getElementById("results-pie-chart").getContext("2d");
  let resultsChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Win', 'Loss', 'Tie'],
      datasets: [{
        data: [],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  function updateResultsChart() {
    const filteredRows = Array.from(resultsTable.querySelectorAll("tbody tr")).filter(r => r.style.display !== "none");
    const counts = { Win:0, Loss:0, Tie:0 };

    filteredRows.forEach(row => {
      const result = row.cells[3].textContent.trim();
      if (counts[result] !== undefined) counts[result]++;
    });

    resultsChart.data.datasets[0].data = [counts.Win, counts.Loss, counts.Tie];
    resultsChart.update();
  }

  updateResultsChart();
});
