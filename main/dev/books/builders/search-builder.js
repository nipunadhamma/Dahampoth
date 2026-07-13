const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const booksFolder = path.join(__dirname, "../../../books");

const output = path.join(booksFolder, "search-index.json");

function getHtmlFiles(dir) {
  let files = [];

  if (!fs.existsSync(dir)) return files;

  fs.readdirSync(dir).forEach((file) => {
    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      files = files.concat(getHtmlFiles(full));
    } else if (file.endsWith(".html")) {
      files.push(full);
    }
  });

  return files;
}

function buildSearchIndex() {
  const htmlFiles = getHtmlFiles(booksFolder);

  const index = [];

  htmlFiles.forEach((file) => {
    // common skip

    if (file.includes("\\common\\")) return;

    const html = fs.readFileSync(file, "utf8");

    const dom = new JSDOM(html);

    const doc = dom.window.document;

    const title = doc.querySelector("title")?.textContent || "";

    /*
            Book headings
            H1 H2 H3 H4
        */

    const headings = [...doc.querySelectorAll("h1,h2,h3,h4")]
      .map((h) => h.textContent)
      .join(" ");

    /*
            Main content
        */

    const content =
      doc.querySelector(".reader")?.textContent || doc.body.textContent;

    /*
            SEO tags
        */

    const seo = doc.querySelector(".seo-tags")?.textContent || "";

    const relative = path.relative(booksFolder, file).replaceAll("\\", "/");

    index.push({
      title: title.trim(),

      url: relative,

      headings: headings.replace(/\s+/g, " ").trim(),

      content: content.replace(/\s+/g, " ").trim(),

      keywords: seo.replace(/\s+/g, " ").trim(),
    });
  });

  fs.writeFileSync(
    output,

    JSON.stringify(index, null, 2),

    "utf8",
  );

  console.log("✅ search-index.json created");
}

module.exports = buildSearchIndex;
