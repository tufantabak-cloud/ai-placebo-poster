import os

css_to_append = """

/* ============================================================
   MOBILE OPTIMIZATION OVERRIDES
   ============================================================ */

/* 1. Prevent Horizontal Overflow */
*, *::before, *::after {
  box-sizing: border-box !important;
}

html, body {
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

p, h1, h2, h3, a {
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
}

/* 3. Fluid Images and Canvas (fNIRS charts) */
img, canvas, svg, video {
  max-width: 100% !important;
  height: auto !important;
}

/* Scrollable Tables */
.table-wrapper, .table-responsive, table {
  width: 100% !important;
  overflow-x: auto !important;
  display: block !important;
  -webkit-overflow-scrolling: touch !important;
}

/* 4. Single Column Layout on Mobile */
@media (max-width: 768px) {
  /* Fix 1-7 Survey Scales */
  .survey-container, .likert-group, .rating-container, .likert-scale, .options-container {
    flex-wrap: wrap !important;
    justify-content: center !important;
  }
  
  /* Fallback to column for survey if wrap is not enough */
  .survey-container {
    flex-direction: column !important;
    width: 100% !important;
    align-items: center !important;
  }

  /* Reset main layouts to single column stack */
  .poster-main {
    column-count: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    gap: 1rem !important;
  }

  .poster-footer, .poster-header, .header-top-bar, .interactive-zone, .header-controls {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    align-items: center !important;
    text-align: center !important;
    gap: 1rem !important;
  }
  
  .col-left, .col-center, .col-right, .card, .flex-item {
    width: 100% !important;
    flex-basis: 100% !important;
    display: block !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  .hypotheses-grid, .design-grid, .role-cards {
    grid-template-columns: 1fr !important;
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
  }
  
  .card {
    padding: 1rem !important;
  }
  
  .dashboard-content {
    padding: 1.5rem !important;
    width: 95% !important;
    margin: 0 auto !important;
  }
}
"""

file_path = "c:/Users/Tufan TABAK/Desktop/academic pster/interactive_poster/styles.css"

with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("CSS appended successfully.")
