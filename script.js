document.addEventListener("DOMContentLoaded", () => {

  /* ===== HERO TABS & SCROLLING ===== */
  const tabs = document.querySelectorAll(".et-hero-tab");
  const slides = document.querySelectorAll(".et-slide");
  const slider = document.querySelector(".et-hero-tab-slider");
  const tabContainer = document.querySelector(".et-hero-tabs-container");

  // Scroll smoothly to section on tab click
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

  // Update active tab and slider on scroll
  function updateSlider() {
    let activeIndex = slides.length - 1;
    const scrollPos = window.scrollY + tabContainer.offsetHeight + 10;

    slides.forEach((slide, i) => {
      if (scrollPos >= slide.offsetTop) activeIndex = i;
    });

    tabs.forEach(t => t.classList.remove("active"));
    tabs[activeIndex]?.classList.add("active");

    const rect = tabs[activeIndex]?.getBoundingClientRect();
    const containerRect = tabContainer.getBoundingClientRect();
    if (rect) {
      slider.style.left = `${rect.left - containerRect.left}px`;
      slider.style.width = `${rect.width}px`;
    }
  }

  window.addEventListener("scroll", updateSlider);
  updateSlider();

  // Sticky menu
  const stickyOffset = tabContainer.offsetTop;
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > stickyOffset) {
      tabContainer.classList.add("et-hero-tabs-container--top");
    } else {
      tabContainer.classList.remove("et-hero-tabs-container--top");
    }
  });

  /* ===== STATS PANEL SWITCHING ===== */
  const statsCards = document.querySelectorAll(".stats-card");
  const tablePanels = document.querySelectorAll(".table-panel");

  statsCards.forEach(card => {
    card.addEventListener("click", () => {
      statsCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const targetId = card.dataset.target;
      tablePanels.forEach(panel => {
        if (panel.id === targetId) panel.classList.remove("hidden");
        else panel.classList.add("hidden");
      });
    });
  });

  /* ===== RESULTS FILTER BY SEASON ===== */
  const resultsTable = document.querySelector("#results-table tbody");
  const resultsSeasonSelect = document.querySelector("#results-season-select");

  function populateSeasons() {
    const seasons = Array.from(new Set(Array.from(resultsTable.querySelectorAll("tr")).map(tr => {
      return tr.children[0].textContent.split("-")[0]; // Year from date
    }))).sort().reverse();

    seasons.forEach(season => {
      const option = document.createElement("option");
      option.value = season;
      option.textContent = season;
      resultsSeasonSelect.appendChild(option);
    });
  }

  populateSeasons();

  resultsSeasonSelect.addEventListener("change", () => {
    const season = resultsSeasonSelect.value;
    resultsTable.querySelectorAll("tr").forEach(tr => {
      if (season === "all" || tr.children[0].textContent.startsWith(season)) {
        tr.style.display = "";
      } else {
        tr.style.display = "none";
      }
    });
  });

  /* ===== SORTABLE TABLES ===== */
  function makeSortable(table) {
    const headers = table.querySelectorAll("th");
    headers.forEach((th, index) => {
      th.addEventListener("click", () => {
        const type = th.dataset.type || "string";
        const tbody = table.querySelector("tbody");
        const rows = Array.from(tbody.querySelectorAll("tr"));

        const asc = !th.classList.contains("asc");
        headers.forEach(h => h.classList.remove("asc", "desc"));
        th.classList.add(asc ? "asc" : "desc");

        rows.sort((a, b) => {
          let valA = a.children[index].textContent.trim();
          let valB = b.children[index].textContent.trim();

          if (type === "number") {
            valA = parseFloat(valA) || 0;
            valB = parseFloat(valB) || 0;
          } else if (type === "date") {
            valA = new Date(valA);
            valB = new Date(valB);
          }

          return asc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  }

  document.querySelectorAll(".sortable-table").forEach(makeSortable);

  /* ===== PLAYER DETAIL VIEW (optional) ===== */
  const playerDetailView = document.querySelector("#player-detail-view");
  const backBtn = document.querySelector("#player-detail-back");

  backBtn?.addEventListener("click", () => {
    playerDetailView.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

});
