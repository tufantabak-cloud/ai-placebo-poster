import os

css_to_append = """

/* Additional Fallback and Exact Classes for Mobile Survey & Layout */
@media (max-width: 768px) {
  .survey-form, .survey-q, .chart-container {
    flex-direction: column !important;
    width: 100% !important;
    align-items: center !important;
  }
  .likert-scale span {
    flex: 1 1 auto;
    min-width: 30px;
    margin: 2px;
  }
}
"""

file_path = "c:/Users/Tufan TABAK/Desktop/academic pster/interactive_poster/styles.css"

with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("CSS appended successfully.")
