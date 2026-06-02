css_append = """
/* === WO6: Responsive QA Overrides === */
html, body {
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
}

/* 1. Typography using clamp() for fluid scaling */
.main-title {
    font-size: clamp(1.8rem, 5vw, 3rem) !important;
}
.landing-title {
    font-size: clamp(2rem, 6vw, 3.8rem) !important;
}
.hero-slogan {
    font-size: clamp(1.5rem, 5vw, 2.5rem) !important;
}

/* 2. Header and View Toggle at 320-430px */
@media (max-width: 480px) {
    .poster-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
    .header-top-bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
    }
    .header-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
    }
    .lang-switcher {
        margin-right: 0 !important;
        margin-bottom: 0.5rem;
    }
}

/* 3. Role Cards (Mobile Stacking) */
@media (max-width: 768px) {
    .role-cards {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }
    .role-card {
        width: 100%;
        max-width: 350px;
        margin: 0 auto;
    }
}

/* 4. Quiz Likert Scale touch targets and wrapping */
.scale-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
}
.scale-btn {
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
}
.dene-btn, .action-btn, .close-modal, .exit-poster-btn, .lang-btn {
    min-height: 44px; /* Minimum touch target */
}
.close-modal {
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 5. Modals internal scrolling */
.modal-content {
    max-height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
}
body.no-scroll {
    overflow: hidden !important;
}

/* 6. Dashboard Tables responsive */
.table-responsive {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    display: block;
}
.session-means table {
    width: 100%;
    min-width: 600px;
}
.chart-wrapper {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
}
"""

with open('styles.css', 'a', encoding='utf-8') as f:
    f.write("\n" + css_append + "\n")
print("Appended responsive overrides to styles.css")
