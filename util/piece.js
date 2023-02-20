const { Chess } = require('./chess');
const Coords = require('./coords');

/**
 * Chess Piece
 * @summary Chess Piece class. This class also uses Chess class
 * @param piecetype type of piece e.g "w_pawn"
 * @param myindex index of piece e.g 1 - for the first pawn in the row
 * @param column initiate column number of the piece e.g 1 - for column A
 * @param row initiate row number of the piece e.g 1 - for row 1
 */
class Piece {
  #promotedType = null;
  constructor(piecetype, myindex, column, row) {
    this.type = piecetype;
    this.pieceIndex = myindex;
    this.x = column;
    this.y = row;
    this.captured = false;
    this.moved = false;
  }
  get position() {
    return Chess.chars[this.x-1]+this.y;
  }
  get promotedType() {
    return this.#promotedType;
  }
  promote(piecetype) {
    if ((this.type===Chess.PieceType.PAWN.WHITE && this.y===8 &&
        (piecetype===Chess.PieceType.ROOK.WHITE || piecetype===Chess.PieceType.KNIGHT.WHITE ||
        piecetype===Chess.PieceType.BISHOP.WHITE || piecetype===Chess.PieceType.QUEEN.WHITE)) ||
        (this.type===Chess.PieceType.PAWN.BLACK && this.y===1 &&
        (piecetype===Chess.PieceType.ROOK.BLACK || piecetype===Chess.PieceType.KNIGHT.BLACK ||
          piecetype===Chess.PieceType.BISHOP.BLACK || piecetype===Chess.PieceType.QUEEN.BLACK)) && this.promotedType==null) {
      this.#promotedType = piecetype;
      return true;
    }
    return false;
  }
  moveTo(board, frompos, nextpos) {
    let replace = new Coords(this.x, this.y);
    let piece = board[nextpos];
    let b4x = this.x;
    this.x = piece.x;
    this.y = piece.y;
    board[nextpos] = this;
    board[frompos] = replace;
    let pt = this.promotedType==null?this.type:this.promotedType;
    if (piece instanceof Piece) {
      piece.captured = true;
      piece.moved = true;
    } else {
      if (pt===Chess.PieceType.KING.WHITE) {
        if (!this.moved && b4x-piece.x===2) {
          let rookp = board["a1"];
          if (!rookp.moved) {
            rookp.moveTo(board, "a1", "d1");
          }
        }
        if (!this.moved && b4x-piece.x===-2) {
          let rookp = board["h1"];
          if (!rookp.moved) {
            rookp.moveTo(board, "h1", "f1");
          }
        }
      }
      if (pt===Chess.PieceType.KING.BLACK) {
        if (!this.moved && b4x-piece.x===2) {
          let rookp = board["a8"];
          if (!rookp.moved) {
            rookp.moveTo(board, "a8", "d8");
          }
        }
        if (!this.moved && b4x-piece.x===-2) {
          let rookp = board["h8"];
          if (!rookp.moved) {
            rookp.moveTo(board, "h8", "f8");
          }
        }
      }
    }
    this.moved = true;
    if (pt===Chess.PieceType.PAWN.WHITE && this.y===8) {
      return true;
    } else if (pt===Chess.PieceType.PAWN.BLACK && this.y===1) {
      return true;
    }
    return false;
  }
  equals(type) {
    if (type instanceof Piece) {
      return (((this.promotedType!=null &&
        ((type.promotedType==null && this.promotedType==type.type) || (type.promotedType!=null && this.promotedType==type.promotedType))) ||
        (type.promotedType!=null && ((this.promotedType!=null && this.promotedType==type.promotedType) || (this.promotedtype==null && type.promotedType==this.type))) ||
        (this.promotedType==null && ((type.promotedType==null && this.type===type.type) || (type.promotedType!=null && this.type==type.promotedType))) ||
        (type.promotedType==null && ((this.promotedType==null && type.type===this.type) || (this.promotedType!=null && type.type==this.promotedType)))) &&
        this.x===type.x && this.y===type.y && this.captured===type.captured &&
        this.moved===type.moved);
    }
    if (type instanceof Coords) {
      return type.equals(this);
    }
    if (type==null) {return false;}
    return ((this.promotedType==null)?(this.type===((type.promotedType==null)?type.type:type.promotedType)):(this.promotedType==((type.promotedType==null)?type.type:type.promotedType)));
  }
}

module.exports = Piece;