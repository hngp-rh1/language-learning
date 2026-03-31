/* ============================================================
   MAIN.JS
   Handles:
   - SPA page loading
   - Passing parameters (unit ID) to unit.html
   - Mobile menu toggle
   - Click handlers for navigation
   ============================================================ */

/* ------------------------------------------------------------
   Toggle mobile navigation drawer
------------------------------------------------------------ */
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.classList.toggle("open");
}

/* ------------------------------------------------------------
   Load external HTML into main content area
   Supports optional parameter (e.g., unit ID)
------------------------------------------------------------ */
function loadPage(page, unitId = null) {
    fetch(`pages/${page}.html`)
        .then(res => res.text())
        .then(html => {
            const container = document.getElementById("mainContent");
            container.innerHTML = html;

            if (page === "unit") {
                const script = document.createElement("script");
                script.id = "lesson-script";
                script.src = "js/lesson.js";

                script.onload = () => {
                    // Wait for DOM to finish rendering
                    requestAnimationFrame(() => {
                        const id = unitId || "1";
                        loadUnit(id);
                    });
                };

                document.body.appendChild(script);
            }
        })
        .catch(err => console.error("Error loading page:", err));
}


/* ------------------------------------------------------------
   Attach click handlers after DOM loads
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {

    // Load default page
    loadPage("main");

    // Handle clicks on elements with data-page
    document.addEventListener("click", (e) => {
        const pageLink = e.target.closest("[data-page]");
        if (pageLink) {
            e.preventDefault();
            const page = pageLink.dataset.page;

            // If this is a unit link, it will have data-unit
            const unitId = pageLink.dataset.unit;

            if (unitId) {
                loadPage("unit", unitId);
            } else {
                loadPage(page);
            }

            // Close mobile drawer if open
            const menu = document.getElementById("mobileMenu");
            if (menu && menu.classList.contains("open")) {
                menu.classList.remove("open");
            }
        }
    });
});

/* ------------------------------------------------------------
   Collapsible Phase Headers + Expand/Collapse All
------------------------------------------------------------ */
document.addEventListener("click", (e) => {
    const header = e.target.closest(".phase-header");
    if (!header) return;

    const targetId = header.dataset.target;
    const content = document.getElementById(targetId);

    header.classList.toggle("open");

    if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "block";
    } else {
        content.style.display = "none";
    }
});

/* ------------------------------------------------------------
   Expand All / Collapse All buttons
   (Works even after SPA loads dialogues.html dynamically)
------------------------------------------------------------ */
document.addEventListener("click", (e) => {
    if (e.target.id === "expand-all") {
        document.querySelectorAll(".phase-header").forEach(header => {
            header.classList.add("open");
            const content = document.getElementById(header.dataset.target);
            content.style.display = "block";
        });
    }

    if (e.target.id === "collapse-all") {
        document.querySelectorAll(".phase-header").forEach(header => {
            header.classList.remove("open");
            const content = document.getElementById(header.dataset.target);
            content.style.display = "none";
        });
    }
});
