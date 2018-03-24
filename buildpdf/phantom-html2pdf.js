let childProcess = require("child_process");
let phantom = require("phantomjs-prebuilt");
let path = require('path');

function convert(options) {
  options = options || {};
  let paperSize = options.paperSize || {};
  let paperFormat = paperSize.format || "A4",
    paperOrientation = paperSize.orientation || "portrait",
    paperBorder = paperSize.border || "1cm",
    paperWidth = paperSize.width || "false",
    paperHeight = paperSize.height || "false";

  let childArgs = [path.join(__dirname, "phantom-script.js"), options.pageAddr, options.pdfPath, paperFormat, paperOrientation, paperBorder];
  return new Promise(function(resolve, reject) {
    childProcess.execFile(phantom.path, childArgs, function(err) {
      // let opPointer = new PDFResult(err, results[1]);

      return err ? reject(err) : resolve({success: true});
    });
  });
}

exports.convert = convert;
