fetch("main/books/books.json")
  .then((response) => response.json())
  .then((books) => {
    const container = document.getElementById("latestBooks");

    if (!container) return;

   books.slice(0, 6).forEach((book) => {

    const card = document.createElement("a");

    card.className = "book-card";

    card.href = book.url;


    const img = document.createElement("img");

    img.src = book.cover || "main/common/images/book-placeholder.png";

    img.alt = book.title;

    card.appendChild(img);


    const title = document.createElement("h3");

    title.textContent = book.title;

    card.appendChild(title);


    if (book.author) {

        const author = document.createElement("p");

        author.textContent = book.author;

        card.appendChild(author);

    }


    container.appendChild(card);
  });
});
