import sketch from 'sketch'
var Artboard = require('sketch/dom').Artboard
var Shape = require('sketch/dom').Shape
var ShapePath = require('sketch/dom').ShapePath
var Style = require('sketch/dom').Style
const library = require("./helper-functions.js");
// documentation: https://developer.sketchapp.com/reference/api/

// Global variables
let newArtboardPadding = 25
let artboardH = 20
let artboardW = 1280
let barH = 5
let dotDiameter = 12

// The main() of the Sketch plugin
export default function({ api, command, document, plugin, scriptPath, scriptURL, selection }) {
  print("\n\n------------------Time Bar--------------------")

  // Current Page
  let page = document.currentPage()

  // Selected Layers
  let selectedLayers = Array.fromNSArray(selection)

  // Make sure only 1 artboard / layer is selected
  // print(selectedLayers[0])
  if (selection.count() != 1) {
    sketch.UI.message("Select 1 (and only 1) artboard 0.0")
    stop
  } else {
    var inputString = sketch.UI.getStringFromUser(
      "What is the percentage through?", ".784",
    )

    let inputPercent = parseFloat(inputString)

    // var artboard = createNewArtboardBeside(page, selectedLayers[0], artboardW, artboardH)
    let artboard = library.createNewArtboardBelow(page, selectedLayers[0], artboardW, artboardH, newArtboardPadding)
    let y = artboardH/2 - barH/2
    let ydot = artboardH/2 - dotDiameter/2
    library.createRect("timebar_full", artboard, "#8888884D", 0, y, artboardW, barH)
    library.createRect("timebar_partial", artboard, "#000000", 0, y, artboardW*inputPercent, barH)
    library.createRect("dot_" + inputPercent, artboard, "#0000004D", artboardW*inputPercent - dotDiameter/2, ydot, dotDiameter, dotDiameter)
    // library.createRect("timebar_partial", artboard, "#8888884D", )
    // library.createRect("dot_" + inputPercent, artboard, "#0000")

    // createRect("a_" + idAltList[i][0], artboard, "#000000", x, y, RADIUS, RADIUS)
    // createLongBar(artboard)
    // createTimeDot(artboard, inputPercent)

    // ✅ Success!
    sketch.UI.message("✅ Time Bar created with " + inputPercent + "%")
  }
}

// Process the inputed data - separating the picture_id from the colors
function processInput(input) {
  let parsedArray = input.split('\n')
  let count = parsedArray.length
  print("Total colors: " + count)

  var idColorList = []

  var i
  for (i = 0; i < count; i++) { 
    // print(colors[i])
    let item = parsedArray[i].split('\t')
    item[1] = rgbToHex(item[1])
    // print(item[0] + " | " + item[1])
    idColorList.push(item)
    // print(parsedArray[i])
    
                    // layer name,      x,   y,    w,   h
    // createRect(artboard, i, colors[i], width*i, 0, width, artboardH)
  }

  return idColorList


  // parsedArray.forEach(splitIdFromColor)
  // return parsedArray
}

function splitIdFromColor(str) {
  let array = str.split('\t')
  return array
}

// Process the inputted data and call the shape building functions
function processString(inputStr) {
  let rawColors = inputStr.split('\n')
  rawColors.forEach(rgbToHexArray)

  return rawColors
}

// Helpers for RGB to Hex
function rgbToHex(str) {
  var colors = str.split(',')
  var r = componentToHex(colors[0])
  var g = componentToHex(colors[1])
  var b = componentToHex(colors[2])

  return "#" + r + g + b
}

function rgbToHexArray(str, index, arr) {
  var colors = str.split(',')
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

// Extension to Array class
// Array.fromNSArray = function(nsArray) {
//   let array = [];
//   for (var i = 0; i < nsArray.count(); i++) { array.push(nsArray[i]) }
//   return array
// }

// Creates new artboard beside currently selected artboard
function createNewArtboardBeside(page, layer, w, h) {
  var padding = newArtboardPadding

  var xpos = layer.frame().x()
  var ypos = layer.frame().y() + layer.frame().height() + padding

  let myArtboard = new Artboard({ 
    parent: page,
    frame: { x: xpos, y: ypos, width: w, height: h }
  })

  return myArtboard
}

// Iterate through all rectangle info
function createRectanglesWithIds(artboard, idColorList) {
  let count = idColorList.length
  let width = artboardW / count
  
  var i
  for (i = 0; i < count; i++) { 
    // print(idColorList[i])
                    // layer name,      x,   y,    w,   h
    createRect("c_" + idColorList[i][0], artboard, idColorList[i][1], width*i, 0, width, artboardH)
  }

}

function createRectangles(artboard, colors) {
  let colorsCount = colors.length
  let width = artboardW / colorsCount
  print("Total colors: " + colorsCount)

  var i
  for (i = 0; i < colorsCount; i++) { 
    print(colors[i])
                    // layer name,      x,   y,    w,   h
    createRect("box" + i, artboard, colors[i], width*i, 0, width, artboardH)
  }
}

// Creates a single rectangle and places on given artboard
function createRect(name, artboard, color, posX, posY, width, height) {
  let myShape = new Shape({
    name: name,
    parent: artboard,
    frame: { x: posX, y: posY, width: width, height: height },
    style: {
      fills: [color],
      borders: []
    }
  })
}
