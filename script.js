/* =========================================
   GRIMOIRE
   ========================================= */


/* ---------- DATA ---------- */

let entries = JSON.parse(
  localStorage.getItem("myGrimoireEntries") || "[]"
);

let currentSection = "contents";
let selectedPhotos = [];



/* ---------- OPEN BOOK ---------- */

function openBook() {

  document.getElementById("cover").style.display = "none";

  document.getElementById("book").style.display = "grid";

  document.getElementById("bookControls").style.display = "flex";

  showContents();
}



/* ---------- TABLE OF CONTENTS ---------- */

function goHome() {

  currentSection = "contents";

  showContents();
}


function showContents() {

  document.getElementById("leftPageContent").innerHTML = `

    <div class="toc">

      <p class="chapter-number">I</p>

      <h2>TABLE OF CONTENTS</h2>

      <div class="ornament small">❧ ───── ❧</div>

      <button onclick="showSection('spells')">
        <span>01</span> Spells
      </button>

      <button onclick="showSection('herbs')">
        <span>02</span> Herbs
      </button>

      <button onclick="showSection('rituals')">
        <span>03</span> Rituals
      </button>

      <button onclick="showSection('notes')">
        <span>04</span> Notes
      </button>

      <button class="new-entry-button" onclick="openEntryForm()">
        + ADD NEW ENTRY
      </button>

    </div>
  `;


  document.getElementById("rightPageContent").innerHTML = `

    <div class="welcome-page">

      <p class="chapter-number">✦</p>

      <h2>MY GRIMOIRE</h2>

      <div class="ornament small">❧ ───── ❧</div>

      <p>
        A place to record spells, herbs,
        rituals, and notes.
      </p>

      <p>
        Choose a section from the table
        of contents to begin.
      </p>

      <div class="welcome-symbol">☽</div>

    </div>

  `;

  document.getElementById("leftPageNumber").textContent = "i";
  document.getElementById("rightPageNumber").textContent = "1";
}



/* ---------- SECTIONS ---------- */

function showSection(section) {

  currentSection = section;

  const titles = {
    spells: "SPELLS",
    herbs: "HERBS",
    rituals: "RITUALS",
    notes: "NOTES"
  };

  const symbols = {
    spells: "🔮",
    herbs: "🌿",
    rituals: "🕯️",
    notes: "📜"
  };

  const sectionEntries = entries.filter(
    entry => entry.type === section
  );


  document.getElementById("leftPageContent").innerHTML = `

    <div>

      <p class="chapter-number">${symbols[section]}</p>

      <h2>${titles[section]}</h2>

      <div class="ornament small">❧ ───── ❧</div>

      <button
        class="new-entry-button"
        onclick="openEntryForm('${section}')"
        style="
          width:100%;
          padding:12px;
          border:1px solid #80683d;
          background:transparent;
          cursor:pointer;
          color:#493622;
          margin-bottom:20px;
        "
      >
        + ADD ${section.slice(0,-1).toUpperCase()} ENTRY
      </button>

      <div class="entry-list">

        ${
          sectionEntries.length === 0

          ?

          `
          <p style="
            text-align:center;
            font-style:italic;
            opacity:.7;
          ">
            There are no entries here yet.
          </p>
          `

          :

          sectionEntries.map(entry => `

            <div
              class="entry-card"
              onclick="viewEntry('${entry.id}')"
            >

              <h3>${escapeHTML(entry.title)}</h3>

              <p>
                ${entry.date || "No date"}
              </p>

              ${
                entry.photos.length
                ? `<p>📷 ${entry.photos.length} photo(s)</p>`
                : ""
              }

            </div>

          `).join("")
        }

      </div>

    </div>
  `;


  document.getElementById("rightPageContent").innerHTML = `

    <div class="welcome-page">

      <p class="chapter-number">${symbols[section]}</p>

      <h2>${titles[section]}</h2>

      <div class="ornament small">❧ ───── ❧</div>

      <p>
        ${
          section === "herbs"
          ? "Document herbs and the traditional uses or associations you want to remember."
          : "Your entries will appear on the opposite page."
        }
      </p>

      <div class="welcome-symbol">
        ${symbols[section]}
      </div>

      <p class="hint">
        Click an entry to open it.
      </p>

    </div>

  `;

}



/* ---------- ENTRY FORM ---------- */

function openEntryForm(section = "spells") {

  document.getElementById("entryModal").classList.add("active");

  document.getElementById("entryType").value = section;

  document.getElementById("entryTitle").value = "";

  document.getElementById("entryDate").value =
    new Date().toISOString().split("T")[0];

  document.getElementById("entryIngredients").value = "";

  document.getElementById("entryIntention").value = "";

  document.getElementById("entryNotes").value = "";

  document.getElementById("entryPhotos").value = "";

  selectedPhotos = [];

  document.getElementById("photoPreview").innerHTML = "";
}



function closeEntryForm() {

  document
    .getElementById("entryModal")
    .classList.remove("active");

}



/* ---------- PHOTOS ---------- */

document
  .getElementById("entryPhotos")
  .addEventListener("change", function(event) {

    selectedPhotos = [];

    const files = Array.from(event.target.files);

    files.forEach(file => {

      const reader = new FileReader();

      reader.onload = function(e) {

        selectedPhotos.push(e.target.result);

        const img = document.createElement("img");

        img.src = e.target.result;

        document
          .getElementById("photoPreview")
          .appendChild(img);

      };

      reader.readAsDataURL(file);

    });

  });



/* ---------- SAVE ENTRY ---------- */

function saveEntry() {

  const title =
    document.getElementById("entryTitle").value.trim();

  if (!title) {

    alert("Please give your entry a title.");

    return;
  }


  const entry = {

    id: Date.now().toString(),

    type:
      document.getElementById("entryType").value,

    title: title,

    date:
      document.getElementById("entryDate").value,

    ingredients:
      document.getElementById("entryIngredients").value,

    intention:
      document.getElementById("entryIntention").value,

    notes:
      document.getElementById("entryNotes").value,

    photos: selectedPhotos

  };


  entries.push(entry);


  try {

    localStorage.setItem(
      "myGrimoireEntries",
      JSON.stringify(entries)
    );

  } catch (error) {

    alert(
      "The entry is too large to save in your browser. Try using smaller photos."
    );

    return;

  }


  closeEntryForm();

  showSection(entry.type);

}



/* ---------- VIEW ENTRY ---------- */

function viewEntry(id) {

  const entry = entries.find(
    item => item.id === id
  );

  if (!entry) return;


  const typeNames = {

    spells: "SPELL",

    herbs: "HERB",

    rituals: "RITUAL",

    notes: "NOTE"

  };


  document.getElementById("viewContent").innerHTML = `

    <div class="view-entry">

      <p class="chapter-number">
        ${typeNames[entry.type]}
      </p>

      <h2>${escapeHTML(entry.title)}</h2>

      <p class="view-date">
        ${entry.date || ""}
      </p>

      <div class="ornament small">
        ❧ ───── ❧
      </div>


      ${
        entry.ingredients

        ?

        `
        <div class="view-section">

          <h3>INGREDIENTS</h3>

          <p>
            ${escapeHTML(entry.ingredients)}
          </p>

        </div>
        `

        : ""
      }


      ${
        entry.intention

        ?

        `
        <div class="view-section">

          <h3>INTENTION</h3>

          <p>
            ${escapeHTML(entry.intention)}
          </p>

        </div>
        `

        : ""
      }


      ${
        entry.notes

        ?

        `
        <div class="view-section">

          <h3>NOTES</h3>

          <p>
            ${escapeHTML(entry.notes)}
          </p>

        </div>
        `

        : ""
      }


      ${
        entry.photos.length

        ?

        `
        <div class="view-section">

          <h3>PHOTOS</h3>

          <div class="view-photos">

            ${entry.photos.map(photo => `
              <img src="${photo}" alt="Grimoire photo">
            `).join("")}

          </div>

        </div>
        `

        : ""
      }


      <button
        onclick="deleteEntry('${entry.id}')"
        style="
          margin-top:30px;
          padding:10px 18px;
          background:#3a291b;
          color:#e0ce9d;
          border:0;
          cursor:pointer;
        "
      >
        DELETE ENTRY
      </button>

    </div>

  `;


  document
    .getElementById("viewModal")
    .classList.add("active");

}



function closeView() {

  document
    .getElementById("viewModal")
    .classList.remove("active");

}



/* ---------- DELETE ---------- */

function deleteEntry(id) {

  if (
    !confirm(
      "Are you sure you want to remove this page?"
    )
  ) return;


  entries = entries.filter(
    entry => entry.id !== id
  );


  localStorage.setItem(
    "myGrimoireEntries",
    JSON.stringify(entries)
  );


  closeView();


  if (currentSection !== "contents") {

    showSection(currentSection);

  }

}



/* ---------- SECURITY / TEXT ---------- */

function escapeHTML(text) {

  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}



/* ---------- KEYBOARD ---------- */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      closeEntryForm();

      closeView();

    }

  }
);