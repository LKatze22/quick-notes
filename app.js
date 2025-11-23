function sanitizeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
let notes = [];
let editingNoteId = null;

function loadNotes() {
  const savedNotes = localStorage.getItem("quickNotes");
  return savedNotes ? JSON.parse(savedNotes) : [];
}

function saveNote(event) {
  event.preventDefault();

  const title = sanitizeHTML(document.getElementById("noteTitle").value.trim());
  const content = sanitizeHTML(
    document.getElementById("noteContent").value.trim()
  );

  if (!title || !content) {
    alert("Bitte alle Felder ausfüllen");
    return;
  }

  if (title.length > 100) {
    alert("Titel zu lang (max 100 Zeichen)");
    return;
  }
  if (editingNoteId) {
    // Update existing Note

    const noteIndex = notes.findIndex((note) => note.id === editingNoteId);
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title,
      content: content,
    };
  } else {
    // Add New Note
    notes.unshift({
      id: generateId(),
      title: title,
      content: content,
    });
  }

  closeNoteDialog();
  saveNotes();
  renderNotes();
}

function generateId() {
  return Date.now().toString();
}

function saveNotes() {
  localStorage.setItem("quickNotes", JSON.stringify(notes));
}

function deleteNote(noteId) {
  notes = notes.filter((note) => note.id != noteId);
  saveNotes();
  renderNotes();
}

function renderNotes() {
  const notesContainer = document.getElementById("notesContainer");

  if (notes.length === 0) {
    // show some fall back elements
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>No notes yet</h2>
        <p>Create your first note to get started!</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
      </div>
    `;
    return;
  }

  notesContainer.innerHTML = notes
    .map(
      (note) => `
    <div class="note-card">
      <h3 class="note-title">${sanitizeHTML(note.title)}</h3>
      <p class="note-content">${sanitizeHTML(note.content)}</p>
      <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${
          note.id
        }')" title="Edit Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="delete-btn" onclick="deleteNote('${
          note.id
        }')" title="Delete Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
          </svg>
        </button>
      </div>

    </div>
    `
    )
    .join("");
  const hiddenElements = document.querySelectorAll(".note-card");
  hiddenElements.forEach((el) => observer.observe(el));
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById("noteDialog");
  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");

  if (noteId) {
    // Edit Mode
    const noteToEdit = notes.find((note) => note.id === noteId);
    editingNoteId = noteId;
    document.getElementById("dialogTitle").textContent = "Edit Note";
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
    // Add Mode
    editingNoteId = null;
    document.getElementById("dialogTitle").textContent = "Add New Note";
    titleInput.value = "";
    contentInput.value = "";
  }

  dialog.showModal();
  titleInput.focus();
}

function closeNoteDialog() {
  document.getElementById("noteDialog").close();
}

document.addEventListener("DOMContentLoaded", function () {
  notes = loadNotes();
  renderNotes();

  document.getElementById("noteForm").addEventListener("submit", saveNote);
  document;

  document
    .getElementById("noteDialog")
    .addEventListener("click", function (event) {
      if (event.target === this) {
        closeNoteDialog();
      }
    });
  // --- Navigation toggle (mobile) ---
  const navToggle = document.getElementById("navToggle");
  if (navToggle) {
    const mobileMenu = document.getElementById("mobileMenu");
    // ensure initial aria-hidden state
    if (mobileMenu) mobileMenu.setAttribute("aria-hidden", "true");

    navToggle.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      const willOpen = !expanded;
      this.setAttribute("aria-expanded", String(willOpen));
      // explicitly add/remove class
      document.body.classList.toggle("nav-open", willOpen);
      if (mobileMenu) mobileMenu.setAttribute("aria-hidden", String(!willOpen));
    });
  }

  // --- Theme toggle (desktop + mobile) ---
  // bind all buttons with the .theme-toggle class so desktop and mobile toggles stay in sync
  const themeToggles = Array.from(document.querySelectorAll('.theme-toggle'));

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      themeToggles.forEach(t => t.textContent = '☀️');
      // update meta theme-color for light mode
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#ffffff');
    } else {
      document.body.classList.remove('light-theme');
      themeToggles.forEach(t => t.textContent = '🌙');
      // update meta theme-color for dark mode
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#1e1f26');
    }
    try {
      localStorage.setItem('quickNotesTheme', theme);
    } catch (e) {
      // ignore storage errors
    }
  }

  // initialize theme from localStorage
  try {
    const savedTheme = localStorage.getItem('quickNotesTheme');
    applyTheme(savedTheme === 'light' ? 'light' : 'dark');
  } catch (e) {
    applyTheme('dark');
  }

  // attach listeners to all theme toggles
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-theme');
      applyTheme(isLight ? 'dark' : 'light');
      // if mobile menu is open, keep it open; don't forcibly close
    });
  });

});


const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});
const hiddenElements = document.querySelectorAll(".note-card");
hiddenElements.forEach((el) => observer.observe(el));
