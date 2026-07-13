const fs = require("fs");
const path = require("path");
const { baseURL } = require("../config/site");

const { bookList } = require("../config/bookList");

function buildSitemap() {
  const output = path.join(__dirname, "../../../books/sitemap.xml");

 const baseURL = "https://suththa.org";

  let urls = "";

  bookList.forEach((book) => {
    urls += `
<url>
    <loc>${baseURL}/${book.folder}/index.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
</url>
`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls}

</urlset>`;

  fs.writeFileSync(output, sitemap, "utf8");

  console.log("✅ sitemap.xml created");
}

module.exports = buildSitemap;
