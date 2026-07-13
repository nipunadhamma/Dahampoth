

/**
 * splits the mammoth output file to multiple html files
 * run as "node dev/books/book-processor.js"
 * output is written to the new/books folder
 * 
 * use mammoth as below from the input directory
 * npx mammoth book-name.docx book-name.html --style-map=mammoth-styles.txt
 * 
 * DANGER - unless you absolutely have to do not reprocess existing docx files
 * since local corrections have been made to html files which would be overwritten
 * 
 */ 




// config/bookList.js

const isNodeEmpty = (node) => node.textElem.length == 0;

const getNodeFileName = (node) => `${node.ids.join("-")}.html`;

const bookList = [
  {
    name: "මහා මංගල සූත්‍රය ",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "mangala-suththa",
    cover: "books-png/mangala-suththa.jpeg",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2015, 2016],
    source: "docx",

    output: "web",
  },
  {
    name: "විතක්ක සූත්‍රය ",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "vithakka-suththa-01",
    cover: "books-png/vithakka-suththa-01.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2017, 2018],
    source: "docx",

    output: "web",
  },
  {
    name: "වුට්ඨි සූත්‍රය ",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "wutti-suththa-02",
    cover: "books-png/wutti-suththa-02.jpg",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2019, 2020],
    source: "docx",

    output: "web",
  },
  {
    name: "අද්ධා සූත්‍රය ",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "adda-suththa-03",
    cover: "books-png/adda-suththa-03.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2021, 2022],
    source: "docx",

    output: "web",
  },
  {
    name: "නිස්සරණිය සූත්‍රය ",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "nissaraniya-suththa-04",
    cover: "books-png/nissaraniya-suththa-04.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2023, 2024],
    source: "docx",

    output: "web",
  },
  {
    name: "සන්ති සූත්‍රය ",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "santhi-suththa-05",
    cover: "books-png/santhi-suththa-05.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2025, 2026],
    source: "docx",

    output: "web",
  },
  {
    name: "දහම් සූත්‍රය ",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "dhaham-guna-06",
    cover: "books-png/dhaham-guna-06.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2026, 2027],
    source: "docx",

    output: "web",
  },
  {
    name: "ලෝක සූත්‍රය ",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "loka-suththa-07",
    cover: "books-png/loka-suththa-07.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2028, 2029],
    source: "docx",

    output: "web",
  },
];


module.exports = {
  bookList,
  isNodeEmpty,
  getNodeFileName,
};
