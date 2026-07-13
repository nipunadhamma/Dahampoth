const $ = require("jquery");

function buildTree(bookDoc) {
  const rootHeaders = $("h1", bookDoc).get();
  let headers = rootHeaders;

  if (headers.length === 0) headers = $("h2", bookDoc).get();
  if (headers.length === 0) headers = $("h3", bookDoc).get();
  if (headers.length === 0) headers = $("h4", bookDoc).get();
  if (headers.length === 0) return [];
  
  return createNodes(headers, 1, []);
}

function createNodes(headers, level, parents) {
  const nodes = [];

  headers.forEach((element, index) => {
    const elem = $(element);

    const node = {
      ids: [...parents, index + 1],
      level: level,
      header: elem,
      headerText: elem.text().trim(),
      children: [],
      textElem: getContent(elem, level),
    };

    if (level === 1) {
      elem.attr("file", `${node.ids[0]}.html`);
    }

    // දරුවන් (Children) සොයා ගැනීම
    if (level < 3) {
      let childSelector = level === 1 ? "h2" : "h3";
      const children = elem.nextUntil(level === 1 ? "h1" : "h2").filter(childSelector).get();
      node.children = createNodes(children, level + 1, node.ids);
    }

    nodes.push(node);
  });

  return nodes;
}

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

module.exports = {
  buildTree,
};