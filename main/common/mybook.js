/* =========================
   DARK MODE
========================= */

const body = document.body;
const darkToggle = document.getElementById("darkToggle");

if (darkToggle) {
  darkToggle.onclick = () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      localStorage.setItem("mode", "dark");
    } else {
      localStorage.setItem("mode", "light");
    }
  };
}

/* Load saved mode */
if (localStorage.getItem("mode") === "dark") {
  body.classList.add("dark");
}

/* =========================
   FONT SIZE CONTROL
========================= */

let fontSize = 17;

const plus = document.getElementById("fontPlus");
const minus = document.getElementById("fontMinus");

const reader = document.querySelector(".reader");

if (plus) {
  plus.onclick = () => {
    fontSize += 1;
    reader.style.fontSize = fontSize + "px";
  };
}

if (minus) {
  minus.onclick = () => {
    fontSize -= 1;
    reader.style.fontSize = fontSize + "px";
  };
}

/* =========================
   PROGRESS BAR
========================= */

const progress = document.getElementById("progress");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const scrolled = (scrollTop / scrollHeight) * 100;

  if (progress) {
    progress.style.width = scrolled + "%";
  }
});

/* =========================
   SHARE BUTTON
========================= 

const shareBtn = document.getElementById("shareBtn");

if (shareBtn) {
  shareBtn.onclick = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };
}*/

/* =========================
   BOOKMARK SYSTEM
========================= */

function saveBookmark() {
  const data = {
    title: document.title,
    url: window.location.href,
    time: new Date().toISOString(),
  };

  localStorage.setItem("bookmark_" + Date.now(), JSON.stringify(data));
  alert("Bookmark saved!");
}

/* =========================
   RESTORE FONT SIZE
========================= */

const savedFont = localStorage.getItem("fontSize");

if (savedFont) {
  fontSize = parseInt(savedFont);
  if (reader) {
    reader.style.fontSize = fontSize + "px";
  }
}

/* Save font size automatically */
setInterval(() => {
  localStorage.setItem("fontSize", fontSize);
}, 2000);

/* =========================
   SMOOTH SCROLL
========================= */

document.documentElement.style.scrollBehavior = "smooth";

/* =========================
   AUTO DARK ICON CHANGE
========================= */

function updateDarkIcon() {
  if (!darkToggle) return;

  if (body.classList.contains("dark")) {
    darkToggle.textContent = "☀️";
  } else {
    darkToggle.textContent = "🌙";
  }
}

setInterval(updateDarkIcon, 500);
