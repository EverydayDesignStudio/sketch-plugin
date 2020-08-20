import sketch from 'sketch'
var Artboard = require('sketch/dom').Artboard
var Shape = require('sketch/dom').Shape
var ShapePath = require('sketch/dom').ShapePath
var Style = require('sketch/dom').Style
// documentation: https://developer.sketchapp.com/reference/api/

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

function getSelectionAndOptions_forAngleInstances({ scriptPath }) {
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

// Creates new artboard beside currently selected artboard
function createNewArtboardBeside(page, layer) {
  var padding = 50
  print(padding)

  var xpos = layer.frame().x() + layer.frame().width() + padding
  print(xpos)
  var ypos = layer.frame().y()

  let myArtboard = new Artboard({ 
    parent: page,
    frame: { x: xpos, y: ypos, width: 300, height: 300 }
  })

  return myArtboard
}

function createRectangle(artboard, colors, percent) {
  let myShape = new Shape({
    name: 'my shape',
    parent: myArtboard,
    frame: { x: 53, y: 213, width: 122, height: 122 },
    style: { 
      fills: ['#35E6C9'],
      borders: []
    }
  })
}

function processString(inputStr) {
  let rawElements = inputStr.replace('\n', '').split('][')

  var colorsStr = rawElements[0].slice(2,-1)
  var colors = colorsStr.split("', '")
  colors.forEach(rgbToHex)
  print(colors)
  
  var percentsStr = rawElements[1].slice(0,-1)
  var percents = percentsStr.split(',')
  print(percents)
}

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

export default function({ api, command, document, plugin, scriptPath, scriptURL, selection }) {
  let page = document.currentPage()

  print("\n\n--------------------------------")
  // sketch.UI.message("It 🤮")
  // print(selection.count())
  
  // Artboards on Selected Layers
  let selectedLayers = Array.fromNSArray(selection)

  // Artboards on Selected Page
  let artboardsOnSelectPage = Array.fromNSArray(document.artboards())

  // Artboards on Other Pages
  let artboardsOnOtherPages = []
  let pages = Array.fromNSArray(document.pages())
  pages = pages.filter(page => page != document.currentPage())

  for (var i = 0; i < pages.length; i++) {
    var artboards = Array.fromNSArray(pages[i].artboards())
    artboardsOnOtherPages = artboardsOnOtherPages.concat(artboards)
  }


  // Make sure only 1 artboard is selected
  // print(selectedLayers[0])
  // if (selection.count() != 1) {
  //   sketch.UI.message("Select 1 (and only 1) artboard")
  //   stop
  // } else {
  //   var artboard = createNewArtboardBeside(page, selectedLayers[0])
  // }

  var inputString = sketch.UI.getStringFromUser(
    "Paste in dominant color output", "",
  )
  processString(inputString)




  // print(selectedLayers[0])
  // print(artboardsOnSelectPage)
  // print(artboardsOnOtherPages)

  // UI Modal Box
  // getSelectionAndOptions_forAngleInstances({ scriptPath: scriptPath })

  // For interacting with Artboards
  // createNewArtboard(page)

  sketch.UI.message("Dominant Color ran")
}
