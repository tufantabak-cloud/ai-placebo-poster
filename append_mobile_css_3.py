import os

css_to_append = """

/* Additional Refinements based on UX Audit */
@media (max-width: 768px) {
  /* Ensure proper padding on the sides so text doesn't stick to the edges */
  body, .poster-container {
    padding-left: 15px !important;
    padding-right: 15px !important;
  }

  .dashboard-content {
    padding-left: 15px !important;
    padding-right: 15px !important;
    width: 100% !important;
  }

  /* Likert Scale - Horizontal scroll instead of wrap for better UX */
  .likert-scale {
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    justify-content: flex-start !important;
    width: 100% !important;
    padding-bottom: 8px !important;
  }
  
  .likert-scale span {
    flex: 0 0 auto !important; /* Prevent shrinking */
    min-width: 45px !important;
  }
}
"""

file_path = "c:/Users/Tufan TABAK/Desktop/academic pster/interactive_poster/styles.css"

with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("CSS refined appended successfully.")
