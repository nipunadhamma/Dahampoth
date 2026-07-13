const fs = require("fs");
const path = require("path");
const { siteUrl } = require("../config/site");
const { bookList } = require("../config/bookList");

function buildBooksJSON() {
  const output = path.join(__dirname, "../../../books/books.json");
  const pngFolder = path.join(__dirname, "../../../books/books-png");

  const books = bookList.map((book) => {
    const pngFile = `${book.folder}.png`;
    const jpgFile = `${book.folder}.jpg`;
    const jpegFile = `${book.folder}.jpeg`;

    let cover = null;

    if (fs.existsSync(path.join(pngFolder, pngFile))) {
      cover = `main/books/books-png/${pngFile}`;
    } else if (fs.existsSync(path.join(pngFolder, jpgFile))) {
      cover = `main/books/books-png/${jpgFile}`;
    } else if (fs.existsSync(path.join(pngFolder, jpegFile))) {
      cover = `main/books/books-png/${jpegFile}`;
    }

    console.log("Book:", book.folder);
    console.log("Cover:", cover);

    return {
      title: book.name.trim(),

      author: book.author,

      folder: book.folder,

      cover: cover || "",

      // FIXED BOOK URL
      url: `${siteUrl}/main/books/${book.folder}/index.html`,

      category: book.group,
    };
  });

  fs.writeFileSync(output, JSON.stringify(books, null, 2), "utf8");

  console.log("✅ books.json created");
}

module.exports = buildBooksJSON;
