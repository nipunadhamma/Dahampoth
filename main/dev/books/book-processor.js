// 1. මුලින්ම JSDOM setup කරන්න (මේක තමයි පදනම)
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");

// 2. ග්ලෝබල් එකට window, document සහ navigator දාන්න
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// 3. දැන් jQuery ලෝඩ් කරන්න (දැන් වැඩ කරයි!)
const $ = require("jquery");

// 4. ඉන්පසුව අනෙක් සියලුම modules ලෝඩ් කරන්න
const { bookList, isNodeEmpty, getNodeFileName } = require("./config/bookList");
const buildBooksJSON = require("./builders/books-builder");
const buildSearchIndex = require("./builders/search-builder");
const buildSitemap = require("./builders/sitemap-builder");
const { buildTree } = require("./tree-builder");

const fs = require("fs");
const fsExtra = require("fs-extra");
const mammoth = require("mammoth");
const assert = require("assert");
const pretty = require("pretty");
const util = require("util");
const path = require("path");
const exec = util.promisify(require("child_process").exec);

// ඉතිරි කෝඩ් ටික මෙතනට පහළින්...

/**
 * 4. HELPER FUNCTIONS
 */
const JC = (name, cls = "") => $(`<${name}/>`).addClass(cls);
const MDI = (name, cls = "") =>
  `<i class="material-icons ${cls}">${name}</i>`.trim();

/**
 * 5. PATH SETTINGS & INITIALIZATION
 */
const outputFolder = path.join(__dirname, "../../books");

console.log("-----------------------------------------");
console.log("System Initialized");
console.log("Output folder:", outputFolder);
console.log("-----------------------------------------");

const mammothOpts = {
  styleMap: [
    "b => b",
    "i => i",
    "r[style-name='Title Char'] => ",
    "r[style-name='TitleChar'] => ",
    "r[style-name='Heading 1 Char'] => ",
    "r[style-name='Heading1Char'] => ",
    "r[style-name='Heading 2 Char'] => ",
    "r[style-name='Heading2Char'] => ",
    "r[style-name='Heading 3 Char'] => ",
    "r[style-name='Heading3Char'] => ",
    "r[style-name='suththa-pali Char'] => ",
    "r[style-name='suththa-paliChar'] => ",
    

    "p[style-name='Heading 3 char'] => div.sub-heading > p:fresh",
    "p[style-name='gatha'] => div.gatha > p:fresh",
    "p[style-name='gatha-source'] => div.gatha-source > p:fresh",
    "p[style-name='subhead'] => div.subhead > p:fresh",
    "p[style-name='largefont'] => div.largefont > p:fresh",
    "p[style-name='centered'] => div.centered > p:fresh",
    "p[style-name='Title'] => div.book-title:fresh",
    "p[style-name='suththa-path'] => div.suththa-path:fresh",
    "p[style-name='suththa-pali'] => div.sutta-pali > p:fresh",
    

    "p[style-name='suththa-path'] => div.sutta-path > p:fresh",

    "p[style-name='seo'] => div.seo-tags > p:fresh",
  ],
};

const reprocessAll = false; // process all books even without the 'gen' prop as 'web'

(async () => {
  for (const book of bookList) {
    console.log("\n======================");
    console.log("Processing:", book.name);
    console.log("======================");

    let htmlFile = `${__dirname}/input/${book.folder}.html`;

    /*
        =====================================
        STEP 1
        DOCX → HTML
        =====================================
        */

    if (book.source === "docx") {
      console.log("📄 Generating HTML from DOCX");

      const mRes = await mammoth.convertToHtml(
        {
          path: `${__dirname}/input/${book.folder}.docx`,
        },
        mammothOpts,
      );

      if (mRes.messages.length) {
        console.log(mRes.messages);
      }

      fs.writeFileSync(htmlFile, pretty(mRes.value), {
        encoding: "utf8",
      });

      console.log("✅ HTML created:", htmlFile);
    }

    /*
        =====================================
        STEP 2
        HTML → WEBSITE BOOK
        =====================================
        */

    if (book.output === "web") {
      console.log("🌐 Building web book");

      const bookDom = new JSDOM(
        fs.readFileSync(htmlFile, {
          encoding: "utf8",
        }),
      );

      const bookDoc = bookDom.window.document;

      generateWebpages(book, bookDoc);
    }

    /*
        =====================================
        STEP 3
        FILE/PDF GENERATION
        =====================================
        */

    if (book.output === "files") {
      const bookDom = new JSDOM(fs.readFileSync(htmlFile, "utf8"));

      generateFiles(book, bookDom.window.document);
    }
  }
})();
writeTopIndexFile();

async function generateFiles(book, bookDoc) {

    // H1 පමණක් වෙනම පිටු සඳහා
    const bookHeaders = $('h1', bookDoc).get();

    const toc = JC('ul', 'TOC-container');

    const filePath = `${__dirname}/files/${book.files[0]}`;

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }


    /*
        ============================
        H1 ONLY TOC
        ============================
    */

    bookHeaders.forEach((_elem, ind) => {

        const elem = $(_elem);

        const hrefId = `toc-ind-${ind}`;

        elem
            .attr('id', hrefId)
            .addClass('sinh-toc');


        const link = JC('a', 'TOC')
            .attr('href', '#' + hrefId)
            .text(elem.text());


        toc.append(
            JC('li', 'H1')
            .append(link)
        );

    });



    /*
        ============================
        H2 / H3 formatting
        ============================
    */


    $('h2', bookDoc).each(function(){

        $(this)
        .addClass('sub-heading');

    });


    $('h3', bookDoc).each(function(){

        $(this)
        .addClass('small-heading');

    });



    /*
        ============================
        TEMPLATE
        ============================
    */


    const placeholders = {

        title: book.name,

        desc: `${book.name} - ${book.author}`,

        author: book.author,

        folder: book.folder,


        toc: pretty(
            JC('div')
            .append(toc)
            .html()
        ),


        content: bookDoc.body.innerHTML,


        style: 'print-pdf.css'

    };



    let tmplStr = fs.readFileSync(
        `${__dirname}/pre-html-file.html`,
        'utf8'
    );


    for (const key in placeholders) {

        tmplStr = tmplStr.replace(
            new RegExp(
                (key + 'placeholder')
                .toUpperCase(),
                'g'
            ),
            placeholders[key]
        );

    }



    const fileBase =
        `${filePath}/${book.name}`;


    const author =
        book.group != 2 && book.author
        ? ` - ${book.author}`
        : '';



    const htmlFile =
        `${fileBase}${author}{${book.files[1]}}.html`;



    fs.writeFileSync(
        htmlFile,
        tmplStr,
        {
            encoding:'utf8'
        }
    );


    console.log(`wrote ${fileBase} for html`);



    /*
        ============================
        PDF
        ============================
    */


    if(book.files[2]) {

        await exec(
            `weasyprint "${htmlFile}" "${fileBase}${author}{${book.files[2]}}.pdf"`
        );


        console.log(`wrote ${fileBase} for pdf`);

    }

}

function generateWebpages(book, bookDoc) {
  const seoTags = $(".seo-tags").text().replace(/\s+/g, " ").trim();
  let bookH1 = $("h1", bookDoc).get();

  if (bookH1.length === 0) {
    bookH1 = $("h2", bookDoc).get();
  }

  if (bookH1.length === 0) {
    bookH1 = $("h3", bookDoc).get();
  }
  const footnotes = $("li[id^='footnote-']", bookDoc).get();
  const seoText = $(".seo-tags", bookDoc).text().trim();

  nodesAdded = 0;

  const allHeaders = $("h1,h2,h3,h4", bookDoc)
    .map((i, e) => `${e.tagName} -> ${$(e).text().trim()}`)
    .get();

  console.log("\nALL HEADERS:");
  console.log(allHeaders);

  const nodeList = buildTree(bookDoc);

  console.log("H1 pages =", nodeList.length);

  console.log("Tree created successfully");

  const bookPath = `${outputFolder}/${book.folder}`;
  if (!fs.existsSync(bookPath)) {
    fs.mkdirSync(bookPath);
  } else {
    // delete everything inside the directory
    fsExtra.emptyDirSync(bookPath);
  }
  writeIndexFile(book, nodeList, `${book.folder}/index.html`, seoText);

  writeBookFiles(
    book,
    nodeList,
    book.folder,
    fs.readFileSync(`${__dirname}/pre-book.html`, { encoding: "utf8" }),
    nodeList,
  );
  console.log(`Wrote files for ${book.name}; nodes added ${nodesAdded}`);
  console.log(
    "Headers found:",
    $("h1,h2,h3,h4", bookDoc)
      .map((i, e) => $(e).text().trim())
      .get(),
  );
}

/* function processTree(headers, level, parents, footnotes) {
    const nodes = [];
    headers.forEach((_elem, ind) => {
        const elem = $(_elem);
        const textElem = elem.nextUntil('h1,h2,h3,h4')
        const newNode = {ids: [...parents, ind + 1], level, header: elem, headerText: elem.text().trim(), children: [], textElem};
        elem.attr('file', getNodeFileName(newNode)); // used in finding prev/next nodes if (!isNodeEmpty(newNode))
        if (level + 1 <= 4) {
            const nextUntil = 'h1' + (level > 1 ? ',h2' : '') + (level > 2 ? ',h3' : ''); 
            const hChildren = elem.nextUntil(nextUntil, `h${level + 1}`).get();
            newNode.children = processTree(hChildren, level + 1, newNode.ids, footnotes);
        }
        processFootNotes(newNode, footnotes); // for header and textElem
        nodes.push(newNode);
        nodesAdded++;
    });
    return nodes;
} */

function processFootNotes(node, footnotes) {
  if (!footnotes.length) return;
  const newLi = node.textElem
    .find("a[id^='footnote-ref-']")
    .get()
    .map((footref, ind) => {
      // add node.header if header has footnotes
      const footId = Number($(footref).text().slice(1, -1));
      assert(
        footId >= 1 && footId <= footnotes.length,
        `footnote id ${footId} is out of range [1, ${footnotes.length}]`,
      );
      $(footref)
        .text(`[${ind + 1}]`)
        .addClass("footnote-ref");
      return footnotes[footId - 1];
    });
  if (newLi.length) {
    node.footnotes = JC("ol", "footnotes").append(newLi);
  }
}

function writeBookFiles(book, children, rootFolder, tmplStr, nodeList) {
  children.forEach((node) => {
    const contentDiv = JC("div", "content").append(
      getTopLinks(node, book, nodeList),
      JC("div", "heading-bar").append(
        JC(`h${node.level}`).text(node.headerText), // if the header can have footnotes will need to change to html
        getBookmarkIcon(node, { book, nodeList }),
        $(MDI("share", "share-icon")).attr("file-name", getNodeFileName(node)),
      ),
      node.textElem,
      node.children.length
        ? createSubHeadingsDiv(node, { book, nodeList })
        : "",
      node.footnotes,
      getBottomLinks(node),
    );
    //if (!isNodeEmpty(node)) // not write empty files
    genericWriteFile(
      `${rootFolder}/${getNodeFileName(node)}`,
      contentDiv,
      tmplStr,
      {
        title: `${node.headerText} - ${book.name}`,
        desc: `${book.name} - ${book.author}`,
        folder: book.folder,
      },
    );
    writeBookFiles(book, node.children, rootFolder, tmplStr, nodeList);
  });
}

function createSubHeadingsDiv(node) {
  return JC("div", "TOC-container subheadings").append(
    JC("div", "TOC-text").text("අනු මාතෘකා").attr("level", 2),

    JC("div", "TOC-children").append(
      node.children.map((child) => {
        const id = `section-${child.ids.join("-")}`;
        child.header.attr("id", id);

        return JC("div", "subheading-item").append(
          JC("a")
            .attr("href", "#" + id)
            .text(child.headerText),
        );
      }),
    ),
  );
}

function getTopLinks(node, book, nodeList) {
  let curNode = { children: nodeList };
  return JC("nav", "top").append(
    JC("a", "button").append(MDI("home")).attr("href", "../index.html"),
    MDI("navigate_next"),
    JC("a", "button")
      .append(MDI("toc"), book.name)
      .attr("href", `index.html#${node.ids.join("-")}`),
    MDI("navigate_next"),
    node.ids
      .slice(0, -1)
      .map((id) => {
        curNode = curNode.children[id - 1];
        return JC("a", "button")
          .attr("href", getNodeFileName(curNode))
          .text(curNode.headerText)
          .prop("outerHTML");
      })
      .join(MDI("navigate_next")),
  );
}

function getBottomLinks(node) {

    const headerElement = node.header;

    const prev = headerElement.prevAll("[file]:first");
    const next = headerElement.nextAll("[file]:first");

    const prevLink = prev.length
        ? JC("a", "button prev")
            .attr("href", prev.attr("file"))
            .html(`${MDI("arrow_back")} <span>${prev.text()}</span>`)
        : "";

    const nextLink = next.length
        ? JC("a", "button next")
            .attr("href", next.attr("file"))
            .html(`<span>${next.text()}</span> ${MDI("arrow_forward")}`)
        : "";

    return JC("nav", "bottom").append(prevLink, nextLink);
}

function getBookmarkIcon(node, { book, nodeList }, extraClass) {
  let curNode = { children: nodeList };
  const headings = node.ids.map((id) => {
    curNode = curNode.children[id - 1];
    return curNode.headerText;
  });
  return $(MDI("star_outline", "star-icon " + extraClass)).attr(
    "data-bookmark",
    JSON.stringify({
      ids: node.ids,
      headings,
      book: { name: book.name, folder: book.folder },
    }),
  );
}

function createIndexDiv(node, context) {
  const link = JC("a", "TOC")
    .attr("href", getNodeFileName(node))
    .attr("level", node.level)
    .text(node.headerText);
  const icon = node.children.length
    ? MDI("expand_less", "parent")
    : MDI("keyboard_arrow_right", "leaf hover-icon");
  const starIcon = getBookmarkIcon(node, context, "hover-icon");
  const shareIcon = $(MDI("share", "share-icon hover-icon")).attr(
    "file-name",
    getNodeFileName(node),
  );
  return JC("div", "TOC-container")
    .attr("id", node.ids.join("-"))
    .append(
      JC("div", "TOC-text")
        .append(icon, link, starIcon, shareIcon)
        .attr("level", node.level),
      JC("div", "TOC-children").append(
        node.children.map((c) => createIndexDiv(c, context)),
      ),
    );
}

function writeIndexFile(book, nodeList, fileName, seoTags = "") {
  const patunaDiv = $("<div/>").append(
    nodeList.map((node) =>
      createIndexDiv(node, {
        book,
        nodeList,
      }),
    ),
  );

  const nameAuthor = `${book.name} - ${book.author}`;

  genericWriteFile(
    fileName,
    patunaDiv,
    fs.readFileSync(`${__dirname}/pre-book-index.html`, {
      encoding: "utf8",
    }),
    {
      title: nameAuthor,

      desc: seoTags || nameAuthor,

      keywords: seoTags,

      folder: book.folder,

      titleBar: book.name,

      htmlId: book.files[1],

      pdfId: book.files[2] || book.files[3],
    },
  );
}
function genericWriteFile(fileName, contentDiv, tmplStr, placeholders) {
  const contentHtml = pretty(JC("div").append(contentDiv).html()); /// vkbeautify.xml() was replaced by pretty - vkb breaks strong tags while pretty keeps them inline
  for (key in placeholders) {
    tmplStr = tmplStr.replace(
      new RegExp((key + "placeholder").toUpperCase(), "g"),
      placeholders[key],
    );
  }
  tmplStr = tmplStr.replace(/CONTENTPLACEHOLDER/, contentHtml);
  fs.writeFileSync(`${outputFolder}/${fileName}`, tmplStr);
}

function writeTopIndexFile() {
  let tmplStr = fs.readFileSync(`${__dirname}/pre-index.html`, {
      encoding: "utf8",
    }),
    groups = [];
  bookList.forEach((book) => {
    if (groups[book.group - 1]) {
      groups[book.group - 1].push(book);
    } else {
      groups[book.group - 1] = [book];
    }
  });
  groups.forEach((group, ind) => {
    const gDiv = JC("div").append(
      group.map((book) => {
        return JC("div", "book")
          .attr("book-folder", book.folder)
          .append(
            MDI("keyboard_arrow_right", "hover-icon"),
            JC("a")
              .attr("href", book.folder + "/index.html")
              .text(book.name),
            $(MDI("share", "share-icon hover-icon")).attr(
              "file-name",
              `${book.folder}/index.html`,
            ),
          );
      }),
    );
    tmplStr = tmplStr.replace(
      new RegExp(`GROUPPLACEHOLDER${ind + 1}`),
      pretty(gDiv.html()),
    );
  });
  fs.writeFileSync(outputFolder + "/index.html", tmplStr);

  // ===============================
  // BUILD SEO FILES
  // ===============================

  buildBooksJSON();
  buildSearchIndex();
  buildSitemap();

  console.log("✅ All SEO files generated");
}
