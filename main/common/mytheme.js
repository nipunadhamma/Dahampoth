
/* =========================
   THEME SYSTEM (DARK / LIGHT)
========================= */

const icon = document.getElementById("themeIcon");

/* Apply saved theme */
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (icon) icon.textContent = "light_mode";
} else {
  if (icon) icon.textContent = "dark_mode";
}

/* Toggle theme */
function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    localStorage.setItem("theme", "dark");
    if (icon) icon.textContent = "light_mode";
  } else {
    localStorage.setItem("theme", "light");
    if (icon) icon.textContent = "dark_mode";
  }

  updateThemeColor();
}

/* Auto system theme (first visit only) */
if (!localStorage.getItem("theme")) {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("dark");
  }
}

/* =========================
   PWA SERVICE WORKER
========================= */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((err) => console.error("SW Error:", err));
  });
}

/* =========================
   THEME COLOR META UPDATE
========================= */

function updateThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');

  if (!meta) return;

  meta.setAttribute(
    "content",
    document.body.classList.contains("dark") ? "#121212" : "#5d4037",
  );
}

/* run once */
updateThemeColor();

/* =====================================================
   Reader Controls
   Font Size + Home + Dark Mode
===================================================== */

// ===============================
// SETTINGS
// ===============================

const READER_SETTINGS = {
  fontSize: 20,
  minFont: 12,
  maxFont: 40,
};

// ===============================
// GET BOOK CONTENT
// ===============================

function getReaderContent() {
  return document.querySelector(".content");
}

// ===============================
// LOAD SAVED FONT SIZE
// ===============================

function loadFontSize() {
  const content = getReaderContent();

  if (!content) return;

  let savedSize = localStorage.getItem("bookFontSize");

  if (savedSize) {
    READER_SETTINGS.fontSize = Number(savedSize);
  }

  content.style.fontSize = READER_SETTINGS.fontSize + "px";
}

// ===============================
// FONT SIZE CONTROL
// ===============================

function changeFont(value) {
  const content = getReaderContent();

  if (!content) return;

  READER_SETTINGS.fontSize += value;

  if (READER_SETTINGS.fontSize < READER_SETTINGS.minFont) {
    READER_SETTINGS.fontSize = READER_SETTINGS.minFont;
  }

  if (READER_SETTINGS.fontSize > READER_SETTINGS.maxFont) {
    READER_SETTINGS.fontSize = READER_SETTINGS.maxFont;
  }

  content.style.fontSize = READER_SETTINGS.fontSize + "px";

  localStorage.setItem("bookFontSize", READER_SETTINGS.fontSize);
}

// ===============================
// BOOKMARK PAGE
// ===============================

function goBookmarks() {
  window.location.href = "../bookmarks.html";
}
function gBookmarks() {
  window.location.href = "bookmarks.html";
}
function gobookBookmarks() {
  window.location.href = "../bookmarks.html";
}

/* =========================
   HOME BUTTON
========================= */

function goHome() {
  window.location.href = "../index.html";
}
function gobookHome() {
  window.location.href = "main/index.html";
}

function goToSite() {
  window.location.href = "https://www.nipunadhamma.org/";
}