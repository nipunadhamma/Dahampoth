$('.TOC-text .material-icons.parent').click(e => {
    const icon = $(e.currentTarget);
    icon.parent().toggleClass('closed').siblings('.TOC-children').toggle();
    icon.text(icon.text() == 'expand_less' ? 'arrow_downward' : 'expand_less');
});

$(document).keydown(function (e) {
    switch (e.which) {
        case 37: // left
            $('nav.bottom a.prev').get(0).click();
            break;

        case 39: // right
            $('nav.bottom a.next').get(0).click();
            break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

const clipb = new ClipboardJS(".share-icon", {
  text: function (icon) {
    let url = "";

    const star = icon.parentElement.querySelector(".star-icon");

    // Book index page share
    if (!star) {
      const folder = icon.parentElement.getAttribute("book-folder");

      url = `https://suththa.org/books/${folder}/index.html`;

      return url;
    }

    // Chapter page share
    const bookmarkData = JSON.parse(star.dataset.bookmark);

    const bookFolder = bookmarkData.book.folder;

    return `https://suththa.org/books/${bookFolder}/${icon.getAttribute("file-name")}`;
  },
});

clipb.on("success", (e) =>
  showToast("link එක copy කර ගත්තා. ඔබට අවශ්‍ය තැන paste කරන්න."),
);



function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    return;
  }

  toast.innerHTML = message;
  toast.className = "show";

  setTimeout(function () {
    toast.className = "";
  }, 3000);
}

const cssColors = {
    light: {
        '--background-color': '#ed9333',
        '--hover-background-color': '#ceb276',
        '--accent-color': '#92320c',
        '--text-color': '#000000',
        '--info-color': '#0000FF', // used for links too
        '--error-color': '#A52A2A',
    },
    dark: {
        '--background-color': '#212121',
        '--hover-background-color': '#111111',
        '--accent-color': '#2F4F4F',
        '--text-color': '#ffffff',
        '--info-color': '#FFB74D',
        '--error-color': '#40E0D0',
    }
};
const themeKeyName = 'books-app-theme', bookmarksKeyName = 'books-app-bookmarks'
const updateColors = () => {
    const root = document.documentElement, theme = localStorage.getItem(themeKeyName) || 'light'
    for (const property in cssColors[theme]) {
        root.style.setProperty(property, cssColors[theme][property]);
    }
    if (window.Android && window.Android.setStatusBarColor) { // Update Android Status Bar
        window.Android.setStatusBarColor(cssColors[theme]['--background-color']);
    }
}

const bookmarks = JSON.parse(localStorage.getItem(bookmarksKeyName) || '{}')
const getBookmarkHref = (folder, ids) => `${folder}/${ids.join('-')}.html`
const toggleBookmark = (icon) => {
    const info = JSON.parse(icon.dataset.bookmark), key = getBookmarkHref(info.book.folder, info.ids)
    if (icon.classList.contains('active')) {
        icon.classList.remove('active')
        icon.textContent = 'star_outline'
        delete bookmarks[key]
        showToast('එම මාතෘකාවේ තරුව ඉවත් කළා.')
    } else {
        icon.classList.add('active')
        icon.textContent = 'star'
        bookmarks[key] = { ...info, time: Date.now() }
        showToast('එම මාතෘකාවට තරුවක් එකතු කළා.')
    }
    localStorage.setItem(bookmarksKeyName, JSON.stringify(bookmarks))
}
const updateBookmarks = () => {
    document.querySelectorAll('.star-icon').forEach(icon => {
        const info = JSON.parse(icon.dataset.bookmark), key = getBookmarkHref(info.book.folder, info.ids)
        if (bookmarks[key]) {
            icon.textContent = 'star'
            icon.classList.add('active')
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. කලින් සේව් කරපු තේමාව ලබා ගැනීම
  const savedTheme = localStorage.getItem(themeKeyName) || "light";

  // 2. අයිකනය සහ තේමාව සැකසීම
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  updateColors();
  updateBookmarks();

  const toggleButton = document.getElementById("dark-mode-toggle");

  if (toggleButton) {
    // පිටුව පූරණය වූ විට අයිකනය නිවැරදිව පෙන්වන්න
    toggleButton.textContent =
      savedTheme === "dark" ? "light_mode" : "dark_mode";

    // එකම Event Listener එක තුළ සියල්ල පාලනය කරන්න
    toggleButton.addEventListener("click", () => {
      // Body class එක මාරු කරන්න
      document.body.classList.toggle("dark-mode");

      // තේමාව මාරු කර localStorage හි සුරකින්න
      const currentTheme = localStorage.getItem(themeKeyName) || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem(themeKeyName, newTheme);

      // අයිකනය වෙනස් කරන්න
      toggleButton.textContent =
        newTheme === "dark" ? "light_mode" : "dark_mode";

      // වර්ණ යාවත්කාලීන කරන්න
      updateColors();
    });
  }

  document
    .querySelectorAll(".star-icon")
    .forEach((icon) =>
      icon.addEventListener("click", (event) => toggleBookmark(event.target)),
    );
});