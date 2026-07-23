
const $ = require("jquery");

/*
==================================================
BUILD COMPLETE BOOK TREE
==================================================
H1 → H2 → H3 ලෙස පොතේ ව්‍යුහය හදයි.
*/

function buildTree(bookDoc) {

  let rootHeaders = $("h1", bookDoc).get();

  if (rootHeaders.length === 0) {
    rootHeaders = $("h2", bookDoc).get();
  }

  if (rootHeaders.length === 0) {
    rootHeaders = $("h3", bookDoc).get();
  }

  if (rootHeaders.length === 0) {
    rootHeaders = $("h4", bookDoc).get();
  }

  if (rootHeaders.length === 0) {
    return [];
  }

  return createNodes(rootHeaders, 1, []);
}


/*
==================================================
CREATE TREE NODES
==================================================
*/

function createNodes(headers, level, parents) {

  const nodes = [];

  headers.forEach((element, index) => {

    const elem = $(element);

    const node = {

      // උදා: H1 = [1]
      // H2 = [1,1]
      // H3 = [1,1,1]

      ids: [...parents, index + 1],

      level: level,

      header: elem,

      headerText: elem.text().trim(),

      children: [],

      textElem: getContent(elem, level),

      // Navigation සඳහා පසුව භාවිතා කරයි
      prev: null,

      next: null,

      file: null

    };


    /*
    ==============================================
    FILE NAME
    ==============================================
    */

    node.file = getFileName(node);

    // හැම heading එකකටම file attribute එක දෙන්න
    // මෙය prev / next navigation සඳහා වැදගත්
    elem.attr("file", node.file);


    /*
    ==============================================
    FIND CHILDREN
    ==============================================
    */

    if (level < 3) {

      const childSelector =
        level === 1
          ? "h2"
          : "h3";

      const stopSelector =
        level === 1
          ? "h1"
          : "h1,h2";


      const children = elem
        .nextUntil(stopSelector)
        .filter(childSelector)
        .get();


      node.children = createNodes(
        children,
        level + 1,
        node.ids
      );

    }


    nodes.push(node);

  });


  return nodes;

}


/*
==================================================
FILE NAME GENERATOR
==================================================
*/

function getFileName(node) {

  return node.ids.join("-") + ".html";

}


/*
==================================================
GET CONTENT
==================================================
*/

function getContent(elem, level) {

  let stop;

  if (level === 1) {

    stop = "h1";

  } else if (level === 2) {

    stop = "h1,h2";

  } else {

    stop = "h1,h2,h3";

  }

  return elem.nextUntil(stop);

}


/*
==================================================
FLATTEN TREE
==================================================
H1 → H2 → H3 → H2 → H1 ...
==================================================
*/

function flattenTree(nodes) {

  const result = [];

  function walk(list) {

    list.forEach(node => {

      result.push(node);

      if (node.children && node.children.length) {

        walk(node.children);

      }

    });

  }

  walk(nodes);

  return result;

}


/*
==================================================
SET PREVIOUS / NEXT PAGE
==================================================
*/

function buildPageNavigation(nodeList) {

  const pages = flattenTree(nodeList);

  pages.forEach((node, index) => {

    node.prev =
      index > 0
        ? pages[index - 1]
        : null;


    node.next =
      index < pages.length - 1
        ? pages[index + 1]
        : null;

  });

  return pages;

}


module.exports = {

  buildTree,

  flattenTree,

  buildPageNavigation

};
