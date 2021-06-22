var Artboard = require('sketch/dom').Artboard
var Shape = require('sketch/dom').Shape
// var ShapePath = require('sketch/dom').ShapePath
// var Style = require('sketch/dom').Style

// Extends the Array class
Array.fromNSArray = function(nsArray) {
  let array = [];
  for (var i = 0; i < nsArray.count(); i++) { array.push(nsArray[i]) }
  return array
}

// Creates new artboard beside currently selected artboard
function createNewArtboardBelow(page, layer, w, h, padding) {
  var xpos = layer.frame().x()
  var ypos = layer.frame().y() + layer.frame().height() + padding

  let myArtboard = new Artboard({ 
    parent: page,
    frame: { x: xpos, y: ypos, width: w, height: h }
  })

  return myArtboard
}

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

module.exports = { createNewArtboardBelow, createRect};
