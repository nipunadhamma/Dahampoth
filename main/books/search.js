let searchData = [];

fetch("books/search-index.json")
  .then((res) => res.json())

  .then((data) => {
    searchData = data;

    console.log("Search loaded:", searchData.length);
  });

const input = document.getElementById("searchInput");

const results = document.getElementById("results");

input.addEventListener("input", function () {
  const keyword = this.value.trim().toLowerCase();

  if (keyword.length < 2) {
    results.innerHTML = "";

    return;
  }

  const found = searchData.filter((item) => {
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.headings.toLowerCase().includes(keyword) ||
      item.content.toLowerCase().includes(keyword) ||
      item.keywords.toLowerCase().includes(keyword)
    );
  });

  showResults(found, keyword);
});

function showResults(data, keyword) {
  if (data.length === 0) {
    results.innerHTML = `
<div class="result">

<h2>
ප්‍රතිඵල හමු නොවීය
</h2>

</div>
`;

    return;
  }

  results.innerHTML = "";

  data.slice(0, 30).forEach((item) => {
    const div = document.createElement("div");

    div.className = "result";

    div.innerHTML = `

<h2>

<a href="books/${item.url}">

${highlight(item.title, keyword)}

</a>

</h2>


<p>

${highlight(item.headings, keyword)}

</p>



<p>

${shortText(item.content, keyword)}

</p>


`;

    results.appendChild(div);
  });
}

function highlight(text, word) {
  if (!text) return "";

  const reg = new RegExp(`(${escapeReg(word)})`, "gi");

  return text.replace(reg, "<mark>$1</mark>");
}

function shortText(text, word) {
  let index = text.toLowerCase().indexOf(word.toLowerCase());

  if (index < 0) return text.substring(0, 200);

  let start = Math.max(0, index - 80);

  return "..." + text.substring(start, start + 300) + "...";
}

function escapeReg(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
