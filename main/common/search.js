let searchIndex = [];

const input = document.getElementById("searchInput");

const results = document.getElementById("results");

const info = document.getElementById("searchInfo");

fetch("books/search-index.json")
  .then((response) => response.json())

  .then((data) => {
    searchIndex = data;

    console.log("Search index loaded:", searchIndex.length);
  })

  .catch((error) => {
    console.error("Search loading error:", error);
  });

input.addEventListener("input", () => {
  const word = input.value.trim();

  if (word.length < 2) {
    results.innerHTML = "";

    info.innerHTML = "";

    return;
  }

  const keyword = word.toLowerCase();

  const found = searchIndex.filter((item) => {
    const text = (
      item.title +
      " " +
      item.headings +
      " " +
      item.content +
      " " +
      item.keywords
    ).toLowerCase();

    return text.includes(keyword);
  });

  showResults(found, word);
});

function showResults(items, keyword) {
  info.innerHTML = `
<p>
ප්‍රතිඵල ${items.length} ක් හමු විය
</p>
`;

  results.innerHTML = "";

  if (items.length === 0) {
    results.innerHTML = `

<div class="result-card">

<h2>
ප්‍රතිඵල හමු නොවීය
</h2>


</div>

`;

    return;
  }

  items
    .slice(0, 50)

    .forEach((item) => {
      const card = document.createElement("article");

      card.className = "result-card";

      card.innerHTML = `

<h2>

<a href="books/${item.url}">

${highlight(item.title, keyword)}

</a>

</h2>


<p class="heading">

${highlight(item.headings, keyword)}

</p>



<p>

${makePreview(item.content, keyword)}

</p>


`;

      results.appendChild(card);
    });
}

function highlight(text, word) {
  if (!text) return "";

  const reg = new RegExp(escapeRegex(word), "gi");

  return text.replace(reg, (match) => `<mark>${match}</mark>`);
}

function makePreview(text, word) {
  if (!text) return "";

  let index = text.toLowerCase().indexOf(word.toLowerCase());

  if (index < 0) return text.substring(0, 250);

  let start = Math.max(0, index - 100);

  return "..." + text.substring(start, start + 350) + "...";
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
