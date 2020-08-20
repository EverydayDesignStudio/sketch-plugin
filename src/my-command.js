import sketch from 'sketch'
var Artboard = require('sketch/dom').Artboard
var Shape = require('sketch/dom').Shape
var ShapePath = require('sketch/dom').ShapePath
var Style = require('sketch/dom').Style
// documentation: https://developer.sketchapp.com/reference/api/

// GLOBAL VALUES
// space between artboards
let newArtboardPadding = 50
// width & height of artboards
let artboardWH = 400
// max width & height, that all the boxes are a percentage of
let maxWidthHeight = 300

// Creates new artboard beside currently selected artboard
function createNewArtboardBeside(page, layer, w, h) {
  var padding = newArtboardPadding

  var xpos = layer.frame().x() + layer.frame().width() + padding
  var ypos = layer.frame().y()

  let myArtboard = new Artboard({ 
    parent: page,
    frame: { x: xpos, y: ypos, width: w, height: h }
  })

  return myArtboard
}

// Creates a single rectangle and places on given artboard
function createRect(artboard, color, percent, posX, posY) {
  // maximum width & height, that all the boxes are a percentage of
  var max = maxWidthHeight

  let myShape = new Shape({
    name: 'color box',
    parent: artboard,
    frame: { x: posX, y: posY, width: max*percent, height: max*percent },
    style: {
      fills: [color],
      borders: []
    }
  })
}

// Iterate through all rectangle info
function createRectangles(artboard, colors, percents) {
  if (colors.length == 5 && percents.length == 5) {
    createRect(artboard, colors[0], percents[0], 133, 121)
    createRect(artboard, colors[1], percents[1], 170, 170)

    createRect(artboard, colors[2], percents[2], 130, 195)
    createRect(artboard, colors[3], percents[3], 150, 219)
    createRect(artboard, colors[4], percents[4], 170, 247)
  } else {
    for (var i = 0; i < colors.length; i++) {
      var posX = Math.floor((Math.random() * 100) + 125)
      var posY = Math.floor((Math.random() * 75) + 125)
      createRect(artboard, colors[i], percents[i], posX, posY)
    }
  }
}

// Process the inputted data and call the shape building functions
function processString(inputStr) {
  let rawElements = inputStr.replace('\n', '').split('][')

  var colorsStr = rawElements[0].slice(2,-1)
  var colors = colorsStr.split("', '")
  colors.forEach(rgbToHex)
  
  var percentsStr = rawElements[1].slice(0,-1)
  var percents = percentsStr.split(',')

  return [colors, percents]
}

// Helpers for RGB to Hex
function rgbToHex(str, index, arr) {
  var colors = str.split(', ')
  var r = componentToHex(colors[0])
  var g = componentToHex(colors[1])
  var b = componentToHex(colors[2])

  arr[index] = "#" + r + g + b
}

function componentToHex(c) {
  c = parseInt(c, 10);
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

// The main() of the Sketch plugin
export default function({ api, command, document, plugin, scriptPath, scriptURL, selection }) {
  print("\n\n--------------------------------------")

  // Current Page
  let page = document.currentPage()

  // Selected Layers
  let selectedLayers = Array.fromNSArray(selection)

  // Make sure only 1 artboard / layer is selected
  print(selectedLayers[0])
  if (selection.count() != 1) {
    sketch.UI.message("Select 1 (and only 1) artboard")
    stop
  } else {
    var inputString = sketch.UI.getStringFromUser(
      "Paste in dominant color output", "",
    )
    var results = processString(inputString)
    var colors = results[0]
    var percents = results[1]

    print(colors)
    print(percents)

    var artboard = createNewArtboardBeside(page, selectedLayers[0], artboardWH, artboardWH)
    createRectangles(artboard, colors, percents)

    // ✅ Success!
    sketch.UI.message("✅ Dominant Color finished")
  }
}

/* 
 *
 * Currently unused UI functions
 *
 */
Array.fromNSArray = function(nsArray) {
  let array = [];
  for (var i = 0; i < nsArray.count(); i++) { array.push(nsArray[i]) }
  return array
}

function loadLocalImage({ scriptPath, filePath }) {
  let basePath = scriptPath
    .stringByDeletingLastPathComponent()
    .stringByDeletingLastPathComponent()
    .stringByDeletingLastPathComponent()

  return NSImage.alloc().initWithContentsOfFile(basePath + "/" + filePath)
}

function showModalWithSelectionAndOptions({ scriptPath }) {
  let alert = NSAlert.alloc().init()
  alert.setMessageText("Apply Mockup")
  alert.setInformativeText("Choose an Artboard to apply into the selected shape")
  alert.addButtonWithTitle("Apply")
  alert.addButtonWithTitle("Cancel")

  alert.icon = loadLocalImage({
    scriptPath,
    filePath: "Contents/Resources/logo.png"
  })

  return alert.runModal()
}
