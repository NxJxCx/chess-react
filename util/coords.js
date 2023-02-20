
const { Chess } = require('./chess');

/**
 * Coordinates (x,y)
 * @param x x coordinate
 * @param y y coordinate
 */
class Coords {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
  get type() {
    return null;
  }
  get position() {
    return Chess.chars[this.x-1]+this.y;
  }
  get pieceIndex() {
    return 0;
  }
  get promotedType() {
    return null;
  }
  equals(element) {
    return (this.x===element.x && this.y===element.y);
  }
  setPosition(x,y) {
    this.x = x;
    this.y = y;
  }
}

module.exports = Coords;