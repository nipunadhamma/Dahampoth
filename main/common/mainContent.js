// mainContent.js
function changeFontSize(val) {
  let content = document.getElementById("mainContent");
  if (!content) return;

  // වත්මන් අකුරු ප්‍රමාණය ලබාගැනීම
  let style = window
    .getComputedStyle(content, null)
    .getPropertyValue("font-size");
  let currentSize = parseFloat(style);

  // අකුරු ප්‍රමාණය වෙනස් කිරීම (සීමාව: 12px සිට 40px දක්වා)
  let newSize = currentSize + val;
  if (newSize >= 12 && newSize <= 40) {
    content.style.fontSize = newSize + "px";
  }
}
