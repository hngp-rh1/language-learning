/* ============================================================
   LESSON.JS
   Handles:
   - Loading unit data from JSON
   - Rendering dialogue content
   - Switching between FSI / DLI / Pimsleur
   - Updating sticky audio player
   - Speed + loop controls
   ============================================================ */

let currentUnit = null;
let currentSource = "fsi"; // default source

/* ------------------------------------------------------------
   Load a unit by ID (called from main.js)
------------------------------------------------------------ */
function loadUnit(id) {
   fetch("data/units.json")
        .then(res => res.json())
        .then(data => {
            currentUnit = data[id];
            if (!currentUnit) {
                document.getElementById("dialogue-content").innerHTML =
                    "<p>Unit not found.</p>";
                return;
            }

            // Render title + subtitle
            document.getElementById("unit-title").textContent =
                `Unit ${id}: ${currentUnit.title}`;
            document.getElementById("unit-subtitle").textContent =
                currentUnit.english;

            // Render default source (FSI)
            renderDialogue("fsi");

            // Highlight default button
            highlightButton("fsi");

            // Setup audio player
            updateAudioPlayer("fsi");

            // Attach button listeners
            setupSourceButtons();
        });
}

/* ------------------------------------------------------------
   Render dialogue for selected source
------------------------------------------------------------ */
function renderDialogue(source) {
    currentSource = source;

    const container = document.getElementById("dialogue-content");
    const data = currentUnit[source];

    if (!data) {
        container.innerHTML = "<p>No content available for this source.</p>";
        return;
    }

    // Fade out
    container.classList.add("fade-out");

    setTimeout(() => {
        // Swap content after fade-out
        container.innerHTML = data.dialogue;

        // Fade in
        container.classList.remove("fade-out");
        container.classList.add("fade-in");

        // Remove fade-in class after animation completes
        setTimeout(() => {
            container.classList.remove("fade-in");
        }, 350);

        // Update audio
        updateAudioPlayer(source);

    }, 300);
}


/* ------------------------------------------------------------
   Highlight selected source button
------------------------------------------------------------ */
function highlightButton(source) {
    document.querySelectorAll(".source-btn").forEach(btn => {
        if (btn.dataset.source === source) {
            btn.classList.add("active-source");
        } else {
            btn.classList.remove("active-source");
        }
    });
}

/* ------------------------------------------------------------
   Setup click listeners for FSI / DLI / Pimsleur buttons
------------------------------------------------------------ */
function setupSourceButtons() {
    document.querySelectorAll(".source-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const source = btn.dataset.source;
            highlightButton(source);
            renderDialogue(source);
        });
    });
}

/* ------------------------------------------------------------
   Update sticky audio player
------------------------------------------------------------ */
function updateAudioPlayer(source) {
    const audioElement = document.getElementById("audio-element");
    const audioData = currentUnit[source];

    if (audioData && audioData.audio) {
        audioElement.src = audioData.audio;
    } else {
        audioElement.removeAttribute("src");
    }
}

/* ------------------------------------------------------------
   Audio speed + loop controls
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("audio-element");
    const speedSelect = document.getElementById("audio-speed");
    const loopBtn = document.getElementById("loop-toggle");

    // Speed control
    speedSelect.addEventListener("change", () => {
        audio.playbackRate = parseFloat(speedSelect.value);
    });

    // Loop toggle
    loopBtn.addEventListener("click", () => {
        audio.loop = !audio.loop;
        loopBtn.classList.toggle("loop-active");
    });
});
