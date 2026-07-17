

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
    cover: "books-png/mangala-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2015, 2016],
    source: "docx",
    featured: true,
    order: 6,

    output: "web",
    force: false,
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
    force: false,
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
    force: false,
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
    force: false,
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
    force: false,
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
    force: false,
  },
  {
    name: "දහම් ගුණ",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "dhaham-guna-06",
    cover: "books-png/dhaham-guna-06.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2026, 2027],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "ලෝක සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "loka-suththa-07",
    cover: "books-png/loka-suththa-07.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2028, 2029],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "පසන්න චිත්ත සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "pasanna-chiththa suththa",
    cover: "books-png/pasanna-chiththa suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2030, 2031],
    source: "docx",
    featured: true,
    order: 5,

    output: "web",
    force: false,
  },
  {
    name: "පදුට්ඨ පුද්ගල සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "padutta-puggala-suththa",
    cover: "books-png/padutta-puggala-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2032, 2033],
    source: "docx",
    featured: true,
    order: 4,

    output: "web",
    force: false,
  },
  {
    name: "මිච්ඡාදිට්ඨි කම්ම සමාදාන සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "michhaditti-kamma-samadana-suththa-06",
    cover: "books-png/michhaditti-kamma-samadana-suththa-06.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2034, 2035],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "චතුචක්ක සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "chathchakka-suththa-09",
    cover: "books-png/chathchakka-suththa-09.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2036, 2037],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "නත්ථි පුත්ත  සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "naththi-puththa-suththa-10",
    cover: "books-png/naththi-puththa-suththa-10.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2038, 2039],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "නන්දති සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "nandathi-suththa-11",
    cover: "books-png/nandathi-suththa-11",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2039, 2040],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "ඵුසති සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "pusathi-suththa-08",
    cover: "books-png/pusathi-suththa-08.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2041, 2042],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "පුරුස පියරූප සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "purusa-piyarupa suththa12",
    cover: "books-png/purusa-piyarupa suththa12.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2043, 2044],
    source: "docx",

    output: "web",
    force: false,
  },

  {
    name: "උපසමානුස්සති භාවනාව",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "upasama-anussathiya",
    cover: "books-png/upasama-anussathiya.png",
    group: 4,
    files: ["දොලොස්වල උදිතධීර හිමි", 2046, 2047],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "පංච උපාදානස්කන්ධය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "pancha-upadanaskandaya",
    cover: "books-png/pancha-upadanaskandaya.png",
    group: 1,
    files: ["දොලොස්වල උදිතධීර හිමි", 2048, 2049],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "ඉරියාපත භාවනාව",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "iriyapatha-bhawanawa",
    cover: "books-png/iriyapatha-bhawanawa.png",
    group: 4,
    files: ["දොලොස්වල උදිතධීර හිමි", 2049, 2050],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "චිත්තානුපස්සනාව",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "chiththanupassana",
    cover: "books-png/chiththanupassana.png",
    group: 4,
    files: ["දොලොස්වල උදිතධීර හිමි", 2051, 2052],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "සතර අපාය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "atamaha-niraya",
    cover: "books-png/purusa-atamaha-niraya.png",
    group: 1,
    files: ["දොලොස්වල උදිතධීර හිමි", 2052, 2053],
    source: "docx",
    featured: true,
    order: 3,

    output: "web",
    force: true,
  },
  {
    name: "ආර්ය අෂ්ටාංගික මාර්ගය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "arya-astangika -magga",
    cover: "books-png/arya-astangika -magga.png",
    group: 1,
    files: ["දොලොස්වල උදිතධීර හිමි", 2054, 2055],
    source: "docx",

    output: "web",
    force: false,
  },
  {
    name: "ආනාපානසති භාවනාව",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "anapana-sathi-bhavana",
    cover: "books-png/anapana-sathi-bhavana.png",
    group: 4,
    files: ["දොලොස්වල උදිතධීර හිමි", 2055, 2056],
    source: "docx",
    featured: true,
    order: 1,

    output: "web",
    force: false,
  },
  {
    name: "මා දුටු භාවනා යෝගීහු",
    author: " ",
    folder: "madutu-bhawana-yogiyo",
    cover: "books-png/madutu-bhawana-yogiyo.png",
    group: 5,
    files: [" ", 2057, 2058],
    source: "docx",
    featured: true,
    order: 2,

    output: "web",
    force: false,
  },
  {
    name: "පඨම ආසව සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "asrawa-suththa",
    cover: "books-png/asrawa-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2058, 2059],
    source: "docx",

    output: "web",
    force: true,
  },
  {
    name: "අට්ඨි පුඤ්ජ සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "atti-punja-suththa",
    cover: "books-png/atti-punja-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2060, 2061],
    source: "docx",

    output: "web",
    force: true,
  },
  {
    name: "දාන සංවිභාග සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "dana-sanvibaga-suththa",
    cover: "books-png/dana-sanvibaga-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2062, 2063],
    source: "docx",

    output: "web",
    force: true,
  },

  {
    name: "දුතිය භික්ඛු සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "duthiya-bhikku-suththa",
    cover: "books-png/duthiya-bhikku-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2064, 2065],
    source: "docx",

    output: "web",
    force: true,
  },
  {
    name: "දුතිය සේඛ සූත්‍රය.",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "duthiya-bhikku-suththa",
    cover: "books-png/duthiya-bhikku-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2066, 2067],
    source: "docx",

    output: "web",
    force: true,
  },
  {
    name: "පඨම වේදනා සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "patama-vedana-suththa",
    cover: "books-png/patama-vedana-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2068, 2069],
    source: "docx",

    output: "web",
    force: true,
  },
  {
    name: "පුඤ්ඤාභායී සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "punyabai_suththa",
    cover: "books-png/punyabai_suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2069, 2070],
    source: "docx",

    output: "web",
    force: true,
  },
  {
    name: "සබ්බ පරිඤ්ඤා සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "sabba-parinna-suththa",
    cover: "books-png/sabba-parinna-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2071, 2072],
    source: "docx",

    output: "web",
    force: true,
  },
  {
    name: "සම්පජාන මුසාවාද සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "sampajana-musawada-suththa",
    cover: "books-png/sampajana-musawada-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2051, 2052],
    source: "docx",

    output: "web",
    force: true,
  },
  {
    name: "උභෝ අත්ථ සූත්‍රය",
    author: "දොලොස්වල උදිතධීර හිමි",
    folder: "ubho-aththa-suththa",
    cover: "books-png/ubho-aththa-suththa.png",
    group: 3,
    files: ["දොලොස්වල උදිතධීර හිමි", 2051, 2052],
    source: "docx",

    output: "web",
    force: true,
  },

];


module.exports = {
  bookList,
  isNodeEmpty,
  getNodeFileName,
};
