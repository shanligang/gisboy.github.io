// var system = require("system"),
//     page = require("webpage").create(),
//     fs = require("fs");



// var dd = [
//     'F:\\01projects\\13web\\resume\\dist\\index.html',
//     'C:\\Users\\SHANLI~1\\AppData\\Local\\Temp\\tmp-30752E2SPgIYDcejp.pdf',
//     'F:\\01projects\\13web\\resume\\dist\\main.css',
//     'F:\\01projects\\13web\\resume\\dist\\main.js',
//     'nofile',
//     'A4',
//     'portrait',
//     '0cm',
//     'false',
//     'false',
//     500,
//     ''
// ]

// args = cmdArgs.reduce(function(args, name, i) {
//     args[name] = dd[i];
//     return args;
// }, {});

// // Fix for PhantomJS >= v2 requiring protocol specification
// var skeleton = page.libraryPath + "/skeleton.html";
// skeleton = phantom.version.major >= 2 ? "file://" + skeleton : skeleton;
// page.onConsoleMessage = function(msg) {
//     console.log(msg);
// }

// page.open(skeleton, function(status) {
//     if (status == "fail") {
//         page.close();
//         phantom.exit(1);
//         return;
//     }

//     /* Add CSS source to the page */
//     page.evaluate(function(cssPath) {
//         var head = document.querySelector("head");
//         var css = document.createElement("link");

//         css.rel = "stylesheet";
//         css.href = "file://" + cssPath;
//         head.appendChild(css);
//         // var css = document.createElement("style");
//         // css.innerHTML = cssPath;
//         // head.appendChild(css);
//     }, fs.read(args.cssPath));


//     /* Add JS source to the page */
//     page.evaluate(function(jsPath) {
//         var head = document.querySelector("head");
//         var script = document.createElement("script");
//         script.src = jsPath;

//         head.appendChild(script);
//     }, args.jsPath);

//     /* Add HTML source to the page */
//     page.evaluate(function(html) {
//         var body = document.querySelector("body")

//         body.innerHTML = html
//     }, fs.read(args.htmlPath));


//     page.evaluate(function() {
//       var head = document.querySelector("head").innerHTML
//     });

//     /* Alter pagesize according to specified header/footer data */
//     var defaultFormat = { format: args.paperFormat, orientation: args.paperOrientation, border: args.paperBorder };
//     if (args.paperWidth !== 'false') {
//         defaultFormat = { width: args.paperWidth, height: args.paperHeight, border: args.paperBorder };
//     }

//     page.paperSize = defaultFormat;

//     if (args.runningsPath !== "nofile") {
//         var runningsArgs = args.runningsArgs ? JSON.parse(args.runningsArgs) : undefined;
//         var runnings = runningsArgs ? require(args.runningsPath)(runningsArgs) : require(args.runningsPath);
//         page.paperSize = paperSize(runnings, defaultFormat);
//     }
//     // page.reload()
//     /* Render the page */
//     setTimeout(function() {
//         page.render(args.pdfPath);
//         page.close();
//         phantom.exit(0);
//     }, parseInt(args.renderDelay, 10));

// });

var system = require("system");
var webPage = require('webpage');
var page = webPage.create();

var cmdArgs = [
    "pageAddr",
    "pdfPath",
    "paperFormat",
    "paperOrientation",
    "paperBorder"
];

var args = cmdArgs.reduce(function(args, name, i) {
    args[name] = system.args[i + 1];
    return args;
}, {});
console.log(args)
var defaultFormat = { format: args.paperFormat, orientation: args.paperOrientation, border: args.paperBorder };
page.paperSize = defaultFormat;
page.open("http://" + args.pageAddr, function start(status) {
  page.render(args.pdfPath);
  page.close();
  phantom.exit();
});
