import sketch from 'sketch'
var Artboard = require('sketch/dom').Artboard
var Shape = require('sketch/dom').Shape
var ShapePath = require('sketch/dom').ShapePath
var Style = require('sketch/dom').Style
// documentation: https://developer.sketchapp.com/reference/api/

// Global variables
let newArtboardPadding = 25
let artboardH = 16
let artboardW = 1280

// The main() of the Sketch plugin
export default function({ api, command, document, plugin, scriptPath, scriptURL, selection }) {
  print("\n\n------------------Color Bar--------------------")

  // Current Page
  let page = document.currentPage()

  // Selected Layers
  let selectedLayers = Array.fromNSArray(selection)

  // Make sure only 1 artboard / layer is selected
  // print(selectedLayers[0])
  if (selection.count() != 1) {
    sketch.UI.message("Select 1 (and only 1) artboard or layer")
    stop
  } else {
    var inputString = sketch.UI.getStringFromUser(
      "Paste in a list of ids and colors for the Color Bar", "16584	133,141,113\n\
16588	54,56,38\n\
16594	81,81,69",
    )

    var idColorList = processInput(inputString)
    // print(idColorList[0])
    var artboard = createNewArtboardBeside(page, selectedLayers[0], artboardW, artboardH)
    createRectanglesWithIds(artboard, idColorList)

    // ✅ Success!
    sketch.UI.message("✅ Color Bar created with " + idColorList.length + " colors")
  }
}

// Process the inputed data - separating the picture_id from the colors
function processInput(input) {
  let parsedArray = input.split('\n')
  let count = parsedArray.length
  print("Total colors: " + count)

  var idColorList = []

  for (var i = 0; i < count; i++) { 
    let item = parsedArray[i].split('\t')
    item[1] = rgbToHex(item[1])
    idColorList.push(item)
  }

  return idColorList
}

// Unused helper functions
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
Array.fromNSArray = function(nsArray) {
  let array = [];
  for (var i = 0; i < nsArray.count(); i++) { array.push(nsArray[i]) }
  return array
}

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
