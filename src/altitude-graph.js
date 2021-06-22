import sketch from 'sketch'
var Artboard = require('sketch/dom').Artboard
var Shape = require('sketch/dom').Shape
var ShapePath = require('sketch/dom').ShapePath
var Style = require('sketch/dom').Style
const library = require("./helper-functions.js");
// documentation: https://developer.sketchapp.com/reference/api/

// Global variables
let artboardH = 150
let artboardW = 1280
let newArtboardPadding = 25
let dotDiameter = 4

export default function({ api, command, document, plugin, scriptPath, scriptURL, selection }) {
  // Current Page
  let page = document.currentPage()

  // Selected Layers
  let selectedLayers = Array.fromNSArray(selection)

  // Make sure only 1 artboard / layer is selected
  if (selection.count() != 1) {
    sketch.UI.message("Select 1 (and only 1) artboard or layer")
    stop
  } else {
    var inputString = sketch.UI.getStringFromUser(
      "Paste in a list of ids and altitude for the Altitude Graph", "58094	478.88\n\
58093	845.81")

    var idAltitudeList = processInput(inputString)
    var artboard = library.createNewArtboardBelow(page, selectedLayers[0], artboardW, artboardH, newArtboardPadding)
    
    createRectanglesWithIds(artboard, idAltitudeList)

    // ✅ Success!
    sketch.UI.message("✅ Altitude Graph created with " + idAltitudeList.length + " altitudes")
  }
}

// Process the inputed data - separating the picture_id from the altitude
function processInput(input) {
  let parsedArray = input.split('\n')
  let count = parsedArray.length
  // print("Total altitudes: " + count)
  var idAltitudeList = []

  var i
  for (i = 0; i < count; i++) { 
    let item = parsedArray[i].split('\t')
    // print(item[0] + " | " + item[1])
    idAltitudeList.push(item)
  }
  return idAltitudeList
}

// Iterate through all rectangle info
function createRectanglesWithIds(artboard, idAltList) {
  let count = idAltList.length
  let minAndMax = getMinAndMaxValues(idAltList)
  let min = minAndMax[0]
  let max = minAndMax[1]
  print("Min: " + minAndMax[0] + "|| Max: " + minAndMax[1])
  
  var step = artboardW/count
  var first_step = step/2 - dotDiameter/2

  for (var i = 0; i < count; i++) {
    var altVal = parseFloat(idAltList[i][1])

    var x = first_step + step*i
    var y = artboardH - dotDiameter - ((altVal - min)/(max-min))*(artboardH-dotDiameter)
    library.createRect("a_" + idAltList[i][0], artboard, "#000000", x, y, dotDiameter, dotDiameter)
  }
}

function getMinAndMaxValues(list) {
  var min = parseFloat(list[0][1])
  var max = parseFloat(list[0][1])

  for (let i = 0; i < list.length; i++) {
    var val = parseFloat(list[i][1])

    if (val < min) {
      min = val
    } else if (val > max) {
      max = val
    }
  }

  return [min, max]
}
