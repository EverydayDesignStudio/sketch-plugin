import sketch from 'sketch'
var Artboard = require('sketch/dom').Artboard
var Shape = require('sketch/dom').Shape
var ShapePath = require('sketch/dom').ShapePath
var Style = require('sketch/dom').Style
const library = require("./helper-functions.js");
// documentation: https://developer.sketchapp.com/reference/api/

// var input2 = sketch.UI.getSelectionFromUser("Howdy", ["hello", "24"], 1)

// Global variables
let artboardH = 150
let artboardW = 1280
let newArtboardPadding = 25
let RADIUS = 4
// var HEIGHEST

export default function({ api, command, document, plugin, scriptPath, scriptURL, selection }) {
  // Current Page
  let page = document.currentPage()

  // Selected Layers
  let selectedLayers = Array.fromNSArray(selection)

  // Make sure only 1 artboard / layer is selected
  if (selection.count() != 1) {
    sketch.UI.message("Select 1 (and only 1) artboard 8.0")
    stop
  } else {
    // HEIGHEST = sketch.UI.getStringFromUser(
    //   "What is the heighest altitude?", "1000.00"
    // )
    // print("Heighest Point: " + HEIGHEST)

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

/*
// Iterate through all rectangle info
function createRectanglesWithIds(artboard, idAltList) {
  let count = idAltList.length
  let heighest = idAltList[count - 1][1]
  // let heighest = getHeighestValue(idAltList)
  print('THE HEIGHEST IS: ' + heighest)
  // let width = artboardW / count
  // let distance = (1280-(128*4))/129
  let distance = (artboardW - (count*RADIUS))/(count + 1)
  print("THE DISTANCE IS: " + distance)
  
  var i
  // TODO - fix this
  for (i = 0; i < count; i++) { 
                    // layer name,     artboard,              x,                                  y,                                                    w,    h
    createRect("a_" + idAltList[i][0], artboard, "#000000", distance/2 + RADIUS*i + distance*i, artboardH - ((idAltList[i][1]/heighest) * artboardH), RADIUS, RADIUS)
  }
} */

// Iterate through all rectangle info
function createRectanglesWithIds(artboard, idAltList) {
  let count = idAltList.length
  let minAndMax = getMinAndMaxValues(idAltList)
  let min = minAndMax[0]
  let max = minAndMax[1]
  print("Min: " + minAndMax[0] + "|| Max: " + minAndMax[1])
  
  var step = artboardW/count
  var first_step = step/2 - RADIUS/2

  for (var i = 0; i < count; i++) {
    var altVal = parseFloat(idAltList[i][1])

    var x = first_step + step*i
    var y = artboardH - RADIUS - ((altVal - min)/(max-min))*(artboardH-RADIUS)
    // var y = artboardH - RADIUS - ((altVal - min)/(max-min))*artboardH
    createRect("a_" + idAltList[i][0], artboard, "#000000", x, y, RADIUS, RADIUS)
  }

  // print('THE HEIGHEST IS: ' + heighest)
  // let width = artboardW / count
  // let distance = (1280-(128*4))/129
  // let distance = (artboardW - (count*RADIUS))/(count + 1)
  // print("THE DISTANCE IS: " + distance)
  
  /*
  var i
  // TODO - fix this
  for (i = 0; i < count; i++) { 
                    // layer name,     artboard,              x,                                  y,                                                    w,    h
    createRect("a_" + idAltList[i][0], artboard, "#000000", distance/2 + RADIUS*i + distance*i, artboardH - ((idAltList[i][1]/heighest) * artboardH), RADIUS, RADIUS)
  } */
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
  // myShape.cornerRadiusFloat = RADIUS/2
}
