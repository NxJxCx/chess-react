const arraysEqual = require("./compare-arrays");
const genCount = require("./generator-count");
const Piece = require("./piece");
const Coords = require("./coords");

/**
   * Chess Server Game
   * @param {string} gid Game ID of the Chess Game
   * @param {string} p1 Player 1 ID [White]
   * @param {string} p2 Player 2 ID [Black]
   * @param {string} p1Name Player 1 display name [White Display Name]
   * @param {string} p2Name Player 2 display name [Black Display Name]
   * @summary Create a new Chess Server Game.
   * @tutorial To listen to game callbacks use on("event_name", (data) => {});
   * @example chessGame = new Chess("1", "pid1", "pid2", "Player 1", "Player 2");
   * chessGame.on(Chess.EVENTS.game_load, (gamedata) => {
   *   var gameData = JSON.stringify(gamedata);
   * });
   * 
   */
class Chess {
  static get chars() {
    return ["a","b","c","d","e","f","g","h"];
  } 
  static get PieceType() {
    return {
      PAWN: { WHITE: "w_pawn", BLACK: "b_pawn" },
      ROOK: { WHITE: "w_rook", BLACK: "b_rook" },
      KNIGHT: { WHITE: "w_knight", BLACK: "b_knight" },
      BISHOP: { WHITE: "w_bishop", BLACK: "b_bishop" },
      QUEEN: { WHITE: "w_queen", BLACK: "b_queen" },
      KING: { WHITE: "w_king", BLACK: "b_king" },
    };
  }
  /**
   * @field WHITE "w" - White Player Identifier
   * @field BLACK "b" - Black Player Identifier
   * @field STALEMATE "d" - Draw / Tie (for stalemate) Identifier
   * @field NONE null - No player Identifier
   */
  static get PlayerType() {
    return {
      WHITE: "w",
      BLACK: "b",
      STATEMATE: "d",
      NONE: null
    };
  }
  /**
   * Status in Chess Game
   * @field NORMAL - neither check nor checkmate nor stalemate
   * @field CHECK - check on king
   * @field CHECKMATE - checkmate. gameover.
   * @field STALEMATE - stalemate. gameover. no winner
   */
  static get ChessStatus() {
    return {
      NORMAL: "normal",
      CHECK: "check",
      CHECKMATE: "checkmate",
      STALEMATE: "stalemate"
    };
  }
  /**
   * Events in Chess Game
   * @field game_load - on game load
   * @field player_load - on player load
   * @field start - on game start
   * @field connection - on connection change
   * @field turn - on next turn
   * @field select_piece - on select piece [should be for the current turn]
   * @field promotion - on pawn promotion [should be for the current turn]
   * @field gameover - on gameover
   * @field post_gameover - on after gameover in 3 seconds
   */
  static get EVENTS() {
    return {
      game_load: "game_load",
      player_load: "player_load",
      start: "start",
      connection: "connection",
      turn: "turn",
      select_piece: "select_piece",
      promotion: "promotion",
      gameover: "gameover",
      post_gameover: "post_gameover"}
  }
  #_GameID = null;
  #_player_white = null;
  #_player_white_name = null;
  #_player_black = null;
  #_player_black_name = null;
  #_board = {};
  #_winner = null;
  #_turn = Chess.PlayerType.NONE;
  #_selected = null;
  #_white_pieces = [];
  #_black_pieces = [];
  #_loaded_percent = {};
  #_gameover = false;
  #_possibleMoves = [];
  #_callbacks = {};
  #_isWhiteConnected = true;
  #_isBlackConnected = true;
  constructor(gid, p1, p2, p1Name, p2Name) {
    this.#_GameID = gid;
    this.#_player_white = p1;
    this.#_player_black = p2;
    this.#_player_white_name = p1Name;
    this.#_player_black_name = p2Name;
    this.#_loaded_percent[p1] = 0;
    this.#_loaded_percent[p2] = 0;
    this.#_callbacks[Chess.EVENTS.game_load] = null;
    this.#_callbacks[Chess.EVENTS.player_load] = null;
    this.#_callbacks[Chess.EVENTS.start] = null;
    this.#_callbacks[Chess.EVENTS.turn] = null;
    this.#_callbacks[Chess.EVENTS.select_piece] = null;
    this.#_callbacks[Chess.EVENTS.promotion] = null;
    this.#_callbacks[Chess.EVENTS.gameover] = null;
    this.#_callbacks[Chess.EVENTS.post_gameover] = null;
    this.#init()
    .then((gdata) => {
      if (typeof this.#_callbacks[Chess.EVENTS.game_load]==="function") {
        this.start();
        this.#_callbacks[Chess.EVENTS.game_load].call(this, gdata);
      }
    })
    .catch(() => {});
  }
  get isWhiteConnected() {
    return this.#_isWhiteConnected;
  }
  set isWhiteConnected(value) {
    if (value!==null && typeof value==="boolean") {
      this.#_isWhiteConnected = value;
      if (typeof this.#_callbacks[Chess.EVENTS.connection] === "function") {
        let toSend = {gameId: this.GameID, playerWhite: {playerId: this.PlayerWhite, isConnected: value}, playerBlack: {playerId: this.PlayerBlack, isConnected: this.isBlackConnected}};
        this.#_callbacks[Chess.EVENTS.connection].call(this, toSend);
      }
      this.#nextTurn();
    }
  }
  get isBlackConnected() {
    return this.#_isBlackConnected;
  }
  set isBlackConnected(value) {
    if (value!==null && typeof value==="boolean") {
      this.#_isBlackConnected = value;
      if (typeof this.#_callbacks[Chess.EVENTS.connection] === "function") {
        this.#_callbacks[Chess.EVENTS.connection].call(this, this.GameID, this.isWhiteConnected, value);
      }
      this.#nextTurn();
    }
  }
  get GameID() {
    return this.#_GameID;
  }
  get PlayerWhite() {
    return this.#_player_white
  }
  get PlayerBlack() {
    return this.#_player_black
  }
  get PlayerWhiteName() {
    return this.#_player_white_name
  }
  get PlayerBlackName() {
    return this.#_player_black_name
  }
  get Board() {
    return this.#_board;
  }
  get Winner() {
    return this.#_winner;
  }
  get Turn() {
    return this.#_turn;
  }
  get Status() {
    if (this.hasStarted) {
      if (this.isCheck) {
        if (this.allPossibleMovesCount===0) {
          return Chess.ChessStatus.CHECKMATE;
        } else {
          return Chess.ChessStatus.CHECK;
        }
      } else {
        if (this.allPossibleMovesCount===0) {
          return Chess.ChessStatus.STALEMATE;
        }
      }
    }
    return Chess.ChessStatus.NORMAL;
  }
  get SelectedPiece() {
    return this.#_selected;
  }
  get hasSelectedPiece() {
    return this.SelectedPiece instanceof Piece;
  }
  get WhitePieces() {
    return this.#_white_pieces;
  }
  get BlackPieces() {
    return this.#_black_pieces;
  }
  get hasLoaded() {
    return (this.LoadPercent[0]>=100 &&
      this.LoadPercent[1]>=100);
  }
  get hasStarted() {
    return this.Turn!==null;
  }
  get isGameover() {
    return this.#_gameover;
  }
  get PossibleMoves() {
    return this.#_possibleMoves;
  }
  get isCheck() {
    return this.#isCheckValidation(this.Turn);
  }
  get LoadPercent() {
    return [this.#_loaded_percent[this.PlayerWhite], this.#_loaded_percent[this.PlayerBlack]];
  }
  get allPossibleMovesCount() {
    let count = 0;
    let pturn = this.Turn;
    if (pturn===Chess.PlayerType.WHITE) {
      let wp = this.WhitePieces;
      for (let wi in wp) {
        if (!wp[wi].captured) {
          count += genCount(this.#getPossibleMoves(this.PlayerWhite, wp[wi]));
        }
      }
    } else if (pturn===Chess.PlayerType.BLACK) {
      let bp = this.BlackPieces;
      for (let bi in bp) {
        if (!bp[bi].captured) {
          count += genCount(this.#getPossibleMoves(this.PlayerBlack, bp[bi]));
        }
      }
    }
    return count;
  }
  get GameData() {
    let gdata = this.#getGameData()
    return { gameID: gdata.next().value, whitePlayer: gdata.next().value, blackPlayer: gdata.next().value,
             turn: gdata.next().value, status: gdata.next().value, boardData: gdata.next().value,
             whiteCaptured: gdata.next().value, blackCaptured: gdata.next().value,
             isGameOver: gdata.next().value, winnerPlayer: gdata.next().value };
  }
  #getGameData = function*() {
    yield this.GameID;
    yield {id: this.PlayerWhite, name: this.PlayerWhiteName, isConnected: this.isWhiteConnected, loadPercent: this.LoadPercent[0], playerType: Chess.PlayerType.WHITE};
    yield {id: this.PlayerBlack, name: this.PlayerBlackName, isConnected: this.isBlackConnected, loadPercent: this.LoadPercent[1], playerType: Chess.PlayerType.BLACK};
    yield this.Turn;
    let stat = this.Status;
    yield stat;
    yield [...this.#getBoardData()];
    yield [...this.#getWhiteCaptured()];
    yield [...this.#getBlackCaptured()];
    if (this.isCheck) {
      if (stat===Chess.ChessStatus.CHECKMATE) {
        this.#_winner = this.Turn===Chess.PlayerType.WHITE?{id: this.PlayerBlack, name: this.PlayerBlackName, isConnected: this.isBlackConnected, loadPercent: this.LoadPercent[1], playerType: Chess.PlayerType.BLACK}:
      {id: this.PlayerWhite, name: this.PlayerWhiteName, isConnected: this.isWhiteConnected, loadPercent: this.LoadPercent[0], playerType: Chess.PlayerType.WHITE};
        this.#_gameover = true;
      } else {
        this.#_winner = null;
        this.#_gameover = false;
      }
    } else {
      if (stat===Chess.ChessStatus.STALEMATE) {
        this.#_winner = {id: null, name: null, isConnected: false, loadPercent: 0, playerType: Chess.PlayerType.STATEMATE};
        this.#_gameover = true;
      } else {
        this.#_winner = null;
        this.#_gameover = false;
      }
    }
    if (!this.isWhiteConnected || !this.isBlackConnected) {
      this.#_gameover = true;
      this.#_winner = !this.isWhiteConnected?
      {id: this.PlayerBlack, name: this.PlayerBlackName, isConnected: this.isBlackConnected, loadPercent: this.LoadPercent[1], playerType: Chess.PlayerType.BLACK}:
      {id: this.PlayerWhite, name: this.PlayerWhiteName, isConnected: this.isWhiteConnected, loadPercent: this.LoadPercent[0], playerType: Chess.PlayerType.WHITE};
    }
    yield this.isGameover;
    yield this.Winner;
  };
  #getBoardData = function*() {
    let count = 0;
    for (let pos in this.Board) {
      count++;
      yield {position: pos, piece: this.Board[pos].type, index: this.Board[pos].pieceIndex, promotedType: this.Board[pos].promotedType};
    }
    return count;
  };
  #getWhiteCaptured = function*() {
    let count = 0;
    for (let i in this.WhitePieces) {
      let pc = this.WhitePieces[i];
      if (pc.captured) {
        count++;
        yield pc.type;
      }
    }
    return count;
  };
  #getBlackCaptured = function*() {
    let count = 0;
    for (let i in this.BlackPieces) {
      let pc = this.BlackPieces[i];
      if (pc.captured) {
        count++;
        yield pc.type;
      }
    }
    return count;
  };
  #getPossibleMoves = function*(pid, piece) {
    let count = 0;
    if (piece===null) {
      return count;
    }
    let ppptype = piece.promotedType==null?piece.type:piece.promotedType;
    if ((this.PlayerWhite===pid && ppptype.charAt(0)===this.Turn && this.Turn===Chess.PlayerType.WHITE) ||
        (this.PlayerBlack===pid && ppptype.charAt(0)===this.Turn && this.Turn===Chess.PlayerType.BLACK)) {
      const x = piece.x;
      const y = piece.y;
      const xysg = function*() { yield* [[x,y+1], [x,y-1], [x+1,y], [x-1,y],
                [x+1,y+1], [x+1,y-1], [x-1,y+1], [x-1,y-1]]; }
      let xys;
      let kxy;
      let pc = null;
      let a = 0;
      let b = 0;
      switch (ppptype) {
        case Chess.PieceType.PAWN.WHITE:
          // spaces
          pc = this.#getPieceFromBoard(x,y+1);
          if (pc!==null && pc instanceof Coords) {
            if (!this.#isCheckMove(piece, pc)) {
              count++; yield(Chess.chars[x-1]+(y+1));
            }
          }
          if (y===2 && pc!==null && pc instanceof Coords && this.#getPieceFromBoard(x, y+2)!==null &&
              this.#getPieceFromBoard(x, y+2) instanceof Coords) {
						pc = this.#getPieceFromBoard(x, y+2);
						if (!this.#isCheckMove(piece, pc)) {
              count++; yield(Chess.chars[x-1]+(y+2));
            }
					}
          // attack
          pc = this.#getPieceFromBoard(x+1, y+1);
					if (pc!==null && pc instanceof Piece && pc.type.charAt(0)!==this.Turn) {
						if (!this.#isCheckMove(piece, pc)) {
              count++; yield(Chess.chars[x]+(y+1));
            }
					}
					pc = this.#getPieceFromBoard(x-1, y+1);
					if (pc!==null && pc instanceof Piece && pc.type.charAt(0)!==this.Turn) {
						if (!this.#isCheckMove(piece, pc)) {
              count++; yield(Chess.chars[x-2]+(y+1));
            }
					}
          break;
        case Chess.PieceType.PAWN.BLACK:
          // spaces
          pc = this.#getPieceFromBoard(x,y-1);
          if (pc!==null && pc instanceof Coords) {
            if (!this.#isCheckMove(piece, pc)) {
              count++; yield(Chess.chars[x-1]+(y-1));
            }
          }
          if (y===7 && pc!==null && pc instanceof Coords && this.#getPieceFromBoard(x, y-2)!==null &&
              this.#getPieceFromBoard(x, y-2) instanceof Coords) {
						pc = this.#getPieceFromBoard(x, y-2);
						if (!this.#isCheckMove(piece, pc)) {
              count++; yield(Chess.chars[x-1]+(y-2));
            }
					}
          // attack
          pc = this.#getPieceFromBoard(x+1, y-1);
					if (pc!==null && pc instanceof Piece && pc.type.charAt(0)!==this.Turn) {
						if (!this.#isCheckMove(piece, pc)) {
              count++; yield(Chess.chars[x]+(y-1));
            }
					}
					pc = this.#getPieceFromBoard(x-1, y-1);
					if (pc!==null && pc instanceof Piece && pc.type.charAt(0)!==this.Turn) {
						if (!this.#isCheckMove(piece, pc)) {
              count++; yield(Chess.chars[x-2]+(y-1));
            }
					}
          break;
        case Chess.PieceType.ROOK.WHITE:
          // vertical up
					v_up: for (let up = y+1; up < 9; up++) {
						pc = this.#getPieceFromBoard(x, up);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break v_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-1]+up); }
						if (pc instanceof Piece) { break v_up; }
					}
					// vertical down
					v_down: for (let down = y-1; down > 0; down--) {
						pc = this.#getPieceFromBoard(x, down);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break v_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-1]+down); }
						if (pc instanceof Piece) { break v_down; }
					}
					// horizontal left
					h_left: for (let left = x-1; left > 0; left--) {
						pc = this.#getPieceFromBoard(left, y);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break h_left; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[left-1]+y); }
						if (pc instanceof Piece) { break h_left; }
					}
					// horizontal right
					h_right: for (let right = x+1; right < 9; right++) {
						pc = this.#getPieceFromBoard(right, y);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break h_right; }
							if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[right-1]+y); }
							if (pc instanceof Piece) { break h_right; }
					}
          break;
        case Chess.PieceType.ROOK.BLACK:
          // vertical up
					v_up: for (let up = y+1; up < 9; up++) {
						pc = this.#getPieceFromBoard(x, up);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break v_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-1]+up); }
						if (pc instanceof Piece) { break v_up; }
					}
					// vertical down
					v_down: for (let down = y-1; down > 0; down--) {
						pc = this.#getPieceFromBoard(x, down);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break v_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-1]+down); }
						if (pc instanceof Piece) { break v_down; }
					}
					// horizontal left
					h_left: for (let left = x-1; left > 0; left--) {
						pc = this.#getPieceFromBoard(left, y);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break h_left; }
						if (!this.#isCheckMove(piece, pc)) { count++;yield(Chess.chars[left-1]+y); }
						if (pc instanceof Piece) { break h_left; }
					}
					// horizontal right
					h_right: for (let right = x+1; right < 9; right++) {
						pc = this.#getPieceFromBoard(right, y);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break h_right; }
							if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[right-1]+y); }
							if (pc instanceof Piece) { break h_right; }
					}
          break;
        case Chess.PieceType.KNIGHT.WHITE:
          // up-left
					pc = this.#getPieceFromBoard(x-1,y+2);
					if ((pc!==null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-2]+(y+2)); }
					}
					// up-right
					pc = this.#getPieceFromBoard(x+1,y+2);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x]+(y+2)); }
					}
					// down-left
					pc = this.#getPieceFromBoard(x-1,y-2);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-2]+(y-2)); }
					}
					// down-right
					pc = this.#getPieceFromBoard(x+1,y-2);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++;  yield(Chess.chars[x]+(y-2)); }
					}
					// left-up
					pc = this.#getPieceFromBoard(x-2,y+1);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-3]+(y+1)); }
					}
					// left-down
					pc = this.#getPieceFromBoard(x-2,y-1);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-3]+(y-1)); }
					}
					// right-up
					pc = this.#getPieceFromBoard(x+2,y+1);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x+1]+(y+1)); }
					}
					// right-down
					pc = this.#getPieceFromBoard(x+2,y-1);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x+1]+(y-1)); }
					}
          break;
        case Chess.PieceType.KNIGHT.BLACK:
          // up-left
					pc = this.#getPieceFromBoard(x-1,y+2);
					if ((pc!==null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-2]+(y+2)); }
					}
					// up-right
					pc = this.#getPieceFromBoard(x+1,y+2);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x]+(y+2)); }
					}
					// down-left
					pc = this.#getPieceFromBoard(x-1,y-2);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-2]+(y-2)); }
					}
					// down-right
					pc = this.#getPieceFromBoard(x+1,y-2);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x]+(y-2)); }
					}
					// left-up
					pc = this.#getPieceFromBoard(x-2,y+1);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-3]+(y+1)); }
					}
					// left-down
					pc = this.#getPieceFromBoard(x-2,y-1);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-3]+(y-1)); }
					}
					// right-up
					pc = this.#getPieceFromBoard(x+2,y+1);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x+1]+(y+1)); }
					}
					// right-down
					pc = this.#getPieceFromBoard(x+2,y-1);
					if ((pc!=null) &&
						((pc instanceof Coords) ||
						 (pc instanceof Piece &&
						  pc.type.charAt(0)!==this.Turn))) {
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x+1]+(y-1)); }
					}
          break;
        case Chess.PieceType.BISHOP.WHITE:
          // right-up
					a = x+1; b = y+1;
					pc = this.#getPieceFromBoard(a++,b++);
					r_up: while (pc!==null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break r_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break r_up; }
						pc = this.#getPieceFromBoard(a++, b++);
					}
					// right-down
					a = x+1; b = y-1;
					pc = this.#getPieceFromBoard(a++,b--);
					r_down: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break r_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break r_down; }
						pc = this.#getPieceFromBoard(a++, b--);
					}
					// left-up
					a = x-1; b = y+1;
					pc = this.#getPieceFromBoard(a--,b++);
					l_up: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break l_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break l_up; }
						pc = this.#getPieceFromBoard(a--, b++);
					}
					// left-down
					a = x-1; b = y-1;
					pc = this.#getPieceFromBoard(a--,b--);
					l_down: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break l_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break l_down; }
						pc = this.#getPieceFromBoard(a--, b--);
					}
          break;
        case Chess.PieceType.BISHOP.BLACK:
          // right-up
					a = x+1; b = y+1;
					pc = this.#getPieceFromBoard(a++,b++);
					r_up: while (pc!==null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break r_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break r_up; }
						pc = this.#getPieceFromBoard(a++, b++);
					}
					// right-down
					a = x+1; b = y-1;
					pc = this.#getPieceFromBoard(a++,b--);
					r_down: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break r_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break r_down; }
						pc = this.#getPieceFromBoard(a++, b--);
					}
					// left-up
					a = x-1; b = y+1;
					pc = this.#getPieceFromBoard(a--,b++);
					l_up: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break l_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break l_up; }
						pc = this.#getPieceFromBoard(a--, b++);
					}
					// left-down
					a = x-1; b = y-1;
					pc = this.#getPieceFromBoard(a--,b--);
					l_down: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break l_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break l_down; }
						pc = this.#getPieceFromBoard(a--, b--);
					}
          break;
        case Chess.PieceType.QUEEN.WHITE:
          // vertical up
					v_up: for (let up = y+1; up < 9; up++) {
						pc = this.#getPieceFromBoard(x, up);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break v_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-1]+up); }
						if (pc instanceof Piece) { break v_up; }
					}
					// vertical down
					v_down: for (let down = y-1; down > 0; down--) {
						pc = this.#getPieceFromBoard(x, down);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break v_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-1]+down); }
						if (pc instanceof Piece) { break v_down; }
					}
					// horizontal left
					h_left: for (let left = x-1; left > 0; left--) {
						pc = this.#getPieceFromBoard(left, y);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break h_left; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[left-1]+y); }
						if (pc instanceof Piece) { break h_left; }
					}
					// horizontal right
					h_right: for (let right = x+1; right < 9; right++) {
						pc = this.#getPieceFromBoard(right, y);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break h_right; }
							if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[right-1]+y); }
							if (pc instanceof Piece) { break h_right; }
					}
          // right-up
					a = x+1; b = y+1;
					pc = this.#getPieceFromBoard(a++,b++);
					r_up: while (pc!==null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break r_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break r_up; }
						pc = this.#getPieceFromBoard(a++, b++);
					}
					// right-down
					a = x+1; b = y-1;
					pc = this.#getPieceFromBoard(a++,b--);
					r_down: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break r_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break r_down; }
						pc = this.#getPieceFromBoard(a++, b--);
					}
					// left-up
					a = x-1; b = y+1;
					pc = this.#getPieceFromBoard(a--,b++);
					l_up: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break l_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break l_up; }
						pc = this.#getPieceFromBoard(a--, b++);
					}
					// left-down
					a = x-1; b = y-1;
					pc = this.#getPieceFromBoard(a--,b--);
					l_down: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break l_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break l_down; }
						pc = this.#getPieceFromBoard(a--, b--);
					}
          break;
        case Chess.PieceType.QUEEN.BLACK:
          // vertical up
					v_up: for (let up = y+1; up < 9; up++) {
						pc = this.#getPieceFromBoard(x, up);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break v_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-1]+up); }
						if (pc instanceof Piece) { break v_up; }
					}
					// vertical down
					v_down: for (let down = y-1; down > 0; down--) {
						pc = this.#getPieceFromBoard(x, down);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break v_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[x-1]+down); }
						if (pc instanceof Piece) { break v_down; }
					}
					// horizontal left
					h_left: for (let left = x-1; left > 0; left--) {
						pc = this.#getPieceFromBoard(left, y);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break h_left; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[left-1]+y); }
						if (pc instanceof Piece) { break h_left; }
					}
					// horizontal right
					h_right: for (let right = x+1; right < 9; right++) {
						pc = this.#getPieceFromBoard(right, y);
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break h_right; }
							if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[right-1]+y); }
							if (pc instanceof Piece) { break h_right; }
					}
          // right-up
					a = x+1; b = y+1;
					pc = this.#getPieceFromBoard(a++,b++);
					r_up: while (pc!==null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break r_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break r_up; }
						pc = this.#getPieceFromBoard(a++, b++);
					}
					// right-down
					a = x+1; b = y-1;
					pc = this.#getPieceFromBoard(a++,b--);
					r_down: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break r_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break r_down; }
						pc = this.#getPieceFromBoard(a++, b--);
					}
					// left-up
					a = x-1; b = y+1;
					pc = this.#getPieceFromBoard(a--,b++);
					l_up: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break l_up; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break l_up; }
						pc = this.#getPieceFromBoard(a--, b++);
					}
					// left-down
					a = x-1; b = y-1;
					pc = this.#getPieceFromBoard(a--,b--);
					l_down: while (pc!=null) {
						if (pc instanceof Piece && pc.type.charAt(0)===this.Turn) { break l_down; }
						if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
						if (pc instanceof Piece) { break l_down; }
						pc = this.#getPieceFromBoard(a--, b--);
					}
          break;
        case Chess.PieceType.KING.WHITE:
          let cpmsw = this.#getCastlingPossibleMoves(piece);
          let cpmw;
          do {
            cpmw = cpmsw.next().value;
            if (typeof cpmw==="string") {
              count++; yield(cpmw);
            }
          } while (cpmw);
          for (let ci in cpmsw) {
						count++; yield(cpmsw[ci]);
					}
					xys = xysg();
          do {
            kxy = xys.next().value;
            if (kxy instanceof Array) {
              pc = this.#getPieceFromBoard(kxy[0], kxy[1]);
              if (pc!==null && (pc instanceof Coords || (pc instanceof Piece &&
                  pc.type.charAt(0)!==this.Turn))) {
                if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
              }
            }
          } while (kxy);
          break;
        case Chess.PieceType.KING.BLACK:
          let cpmsb = this.#getCastlingPossibleMoves(piece);
          let cpmb;
          do {
            cpmb = cpmsb.next().value;
            if (typeof cpmb==="string") {
              count++; yield(cpmb);
            }
          } while (cpmb);
					xys = xysg();
          do {
            kxy = xys.next().value;
            if (kxy instanceof Array) {
              pc = this.#getPieceFromBoard(kxy[0], kxy[1]);
              if (pc!==null && (pc instanceof Coords || (pc instanceof Piece &&
                  pc.type.charAt(0)!==this.Turn))) {
                if (!this.#isCheckMove(piece, pc)) { count++; yield(Chess.chars[pc.x-1]+(pc.y)); }
              }
            }
          } while (kxy);
          break;
      }
    }
    return count;
  };
  #getCastlingPossibleMoves = function*(pking) {
    let count = 0;
    if (pking instanceof Piece &&
      (pking.equals(Chess.PieceType.KING.WHITE) || pking.equals(Chess.PieceType.KING.BLACK))) {
      let x = pking.x;
      let y = pking.y;
      let check = this.is_check;
      let hasmoved = pking.moved;
      let pktype = pking.promotedType==null?pking.type:pking.promotedType;
      if (!check && !hasmoved) {
        switch (pktype.charAt(0)) {
          case Chess.PlayerType.WHITE:
            // left-side
            left: for (let i = x-1; i > 0; i--) {
              let temp = this.#getPieceFromBoard(i, y);
              if (temp instanceof Piece) {
                if (temp.type===Chess.PieceType.ROOK.WHITE) {
                  if (temp.moved) { break left; }
                  let castle1 = [x-1, y];
                  let castle2 = [x-2, y];
                  if (!this.#isCheckMove(pking, new Coords(castle1[0], castle1[1])) &&
                      !this.#isCheckMove(pking, new Coords(castle2[0], castle2[1]))) {
                    count++; yield(Chess.chars[castle2[0]-1]+castle2[1]);
                  }
                } else { break left; }
              }
            }
            // right-side
            right: for (let i = x+1; i < 9; i++) {
              let temp = this.#getPieceFromBoard(i, y);
              if (temp instanceof Piece) {
                if (temp.type===Chess.PieceType.ROOK.WHITE) {
                  if (temp.moved) { break right; }
                  let castle1 = [x+1, y];
                  let castle2 = [x+2, y];
                  if (!this.#isCheckMove(pking, new Coords(castle1[0], castle1[1])) &&
                      !this.#isCheckMove(pking, new Coords(castle2[0], castle2[1]))) {
                    count++; yield(Chess.chars[castle2[0]-1]+castle2[1]);
                  }
                } else { break right; }
              }
            }
            break;
          case Chess.PlayerType.BLACK:
            // left-side
            left: for (let i = x-1; i > 0; i--) {
              let temp = this.#getPieceFromBoard(i, y);
              if (temp instanceof Piece) {
                if (temp.type===Chess.PieceType.ROOK.BLACK) {
                  if (temp.moved) { break left; }
                  let castle1 = [x-1, y];
                  let castle2 = [x-2, y];
                  if (!this.#isCheckMove(pking, new Coords(castle1[0], castle1[1])) &&
                      !this.#isCheckMove(pking, new Coords(castle2[0], castle2[1]))) {
                    count++; yield(Chess.chars[castle2[0]-1]+castle2[1]);
                  }
                } else { break left; }
              }
            }
            // right-side
            right: for (let i = x+1; i < 9; i++) {
              let temp = this.#getPieceFromBoard(i, y);
              if (temp instanceof Piece) {
                if (temp.type===Chess.PieceType.ROOK.BLACK) {
                  if (temp.moved) { break right; }
                  let castle1 = [x+1, y];
                  let castle2 = [x+2, y];
                  if (!this.#isCheckMove(pking, new Coords(castle1[0], castle1[1])) &&
                      !this.#isCheckMove(pking, new Coords(castle2[0], castle2[1]))) {
                    count++; yield(Chess.chars[castle2[0]-1]+castle2[1]);
                  }
                } else { break right; }
              }
            }
            break;
        }
      }
    }
    return count;
  };
  #init = () => {
    return new Promise((resolve, reject) => {
      try {
        for (let row = 1; row<9; row++) {
          for (let col = 1; col<9; col++) {
            switch (row) {
              case 1:
                if (col<2 || col>7) {
                  this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.ROOK.WHITE, col<2?1:2, col, row);
                  this.WhitePieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                }
                if (col===2 || col===7) {
                  this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.KNIGHT.WHITE, col==2?1:2, col, row);
                  this.WhitePieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                }
                if (col===3 || col===6) {
                  this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.BISHOP.WHITE, col==3?1:2, col, row);
                  this.WhitePieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                }
                if (col===4) {
                  this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.QUEEN.WHITE, 1, col, row);
                  this.WhitePieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                }
                if (col===5) {
                  this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.KING.WHITE, 1, col, row);
                  this.WhitePieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                }
                break;
              case 2:
                this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.PAWN.WHITE, col,  col, row);
                this.WhitePieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                break;
              case 7:
                this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.PAWN.BLACK, col, col, row);
                this.BlackPieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                break;
              case 8:
                if (col<2 || col>7) {
                  this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.ROOK.BLACK, col<2?1:2, col, row);
                  this.BlackPieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                }
                if (col===2 || col===7) {
                  this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.KNIGHT.BLACK, col==2?1:2, col, row);
                  this.BlackPieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                }
                if (col===3 || col===6) {
                  this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.BISHOP.BLACK, col==3?1:2, col, row);
                  this.BlackPieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                }
                if (col===4) {
                  this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.QUEEN.BLACK, 1, col, row);
                  this.BlackPieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                }
                if (col===5) {
                  this.Board[Chess.chars[col-1]+row.toString()] = new Piece(Chess.PieceType.KING.BLACK, 1, col, row);
                  this.BlackPieces.push(this.Board[Chess.chars[col-1]+row.toString()]);
                }
                break;
              default:
                this.Board[Chess.chars[col-1]+row.toString()] = new Coords(col, row);
            }
          }
        }
        resolve(this.GameData);
      } catch (err) {
        reject(err);
      }
    })
    
  };
  #sleep = () => new Promise(resolve => setTimeout(resolve, 1));
  #startnow = () => {
    return new Promise(async (resolve, reject) => {
      try {
        while (!this.hasLoaded) {
          await this.#sleep();
        }
        this.#_turn = Chess.PlayerType.WHITE;
        resolve(this.GameData);
      } catch (err) {
        reject(err);
      }
    });
  };
  #nextTurn = () => {
    this.#setSelectedPiece(null);
    this.#_turn = this.Turn===Chess.PlayerType.WHITE?Chess.PlayerType.BLACK:Chess.PlayerType.WHITE;
    let gdata = this.GameData;
    if (this.isGameover) {
      if (typeof this.#_callbacks[Chess.EVENTS.gameover]==="function") {
        this.#_callbacks[Chess.EVENTS.gameover].call(this, gdata);
      }
      let game = this;
      setTimeout(function(){ 
        if (typeof game.#_callbacks[Chess.EVENTS.post_gameover]==="function") {
          game.#_callbacks[Chess.EVENTS.post_gameover].call(this, this.GameID);
        }
      }, 5000);
    } else {
      if (typeof this.#_callbacks[Chess.EVENTS.turn]==="function") {
        this.#_callbacks[Chess.EVENTS.turn].call(this, gdata);
      }
    }
    
  };
  #getPieceByPosition = (position) => {
    return position in this.Board?this.Board[position]:null;
  };
  #getPieceFromBoard = (x,y) => {
    let pos = x-1 in Chess.chars?Chess.chars[x-1]+y.toString():null;
    return pos in this.Board?this.Board[pos]:null;
  };
  #getKingPiece = (player) => {
    let ptype = null;
    if (player===Chess.PlayerType.WHITE) {
      ptype = Chess.PieceType.KING.WHITE;
    } else if (player===Chess.PlayerType.BLACK) {
      ptype = Chess.PieceType.KING.BLACK;
    }
    for (let i in this.Board) {
      if (this.Board[i] instanceof Piece && this.Board[i].type===ptype) {
        return this.Board[i];
      }
    }
    return null;
  };
  #setSelectedPiece = (value) => {
    if (value!==null && !(value instanceof Piece) && !this.hasPiece(value)) {
      return;
    }
    this.#_selected = value;
    if (this.Turn===Chess.PlayerType.WHITE) {
      this.#setPossibleMoves([...this.#getPossibleMoves(this.PlayerWhite, value)]);
      if (typeof this.#_callbacks[Chess.EVENTS.select_piece]==="function") {
        let toSend = {gameId: this.GameID, playerId: this.PlayerWhite,
          piece: value instanceof Piece?value.type:null,
          position: value instanceof Piece?value.position:null,
          pIndex: value instanceof Piece?value.pieceIndex:null,
          possibleMoves: this.PossibleMoves};
        this.#_callbacks[Chess.EVENTS.select_piece].call(this, this.Turn, toSend)
      }
    } else if (this.Turn===Chess.PlayerType.BLACK) {
      this.#setPossibleMoves([...this.#getPossibleMoves(this.PlayerBlack, value)]);
      if (typeof this.#_callbacks[Chess.EVENTS.select_piece]==="function") {
        let toSend = {gameId: this.GameID, playerId: this.PlayerBlack,
          piece: value instanceof Piece?value.type:null,
          position: value instanceof Piece?value.position:null,
          pIndex: value instanceof Piece?value.pieceIndex:null,
          possibleMoves: this.PossibleMoves};
        this.#_callbacks[Chess.EVENTS.select_piece].call(this, this.Turn, toSend)
      }
    }
  };
  #deselectPiece = (gid, pid, position, piece) => {
    if (gid===this.GameID) {
      if (this.isValidToSelect(gid, pid, position)) {
        if (piece instanceof Piece) {
          if (piece.equals(this.SelectedPiece)) {
            this.#setSelectedPiece(null);
          }
        }
      }
    }
  };
  #setPossibleMoves = (value) => {
    if (!arraysEqual(this.PossibleMoves, value)) {
      this.#_possibleMoves.length = 0;
      this.#_possibleMoves = value;
    }
  };
  #isCheckValidation = (player) => {
    if (player!==Chess.PlayerType.WHITE && player!==Chess.PlayerType.BLACK) {
      return false;
    }
    const king = this.#getKingPiece(player);
    const ktype = king.promotedType==null?king.type:king.promotedType;
    const x = king.x;
    const y = king.y;
    const kchecksg = function* () { yield* [[x+1,y+2], [x-1,y+2], [x+1,y-2], [x-1,y-2],
      [x+2,y+1], [x-2,y+1], [x+2,y-1], [x-2,y-1]]; }
    let kchecks;
    let kc;
    let a = 0;
    let b = 0;
    let bsq = null;
    // right-up
		a = x+1; b = y+1;
		bsq = this.#getPieceFromBoard(a++,b++);
		ru : while (bsq!==null) {
			if (bsq instanceof Piece && ktype.charAt(0)===(bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)) { break ru; }
			if (bsq instanceof Piece) {
        let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
				switch (bppt) {
          case Chess.PieceType.PAWN.BLACK:
            if (ktype===Chess.PieceType.KING.WHITE &&
                bsq.x-x===1 && bsq.y-y===1) {
              return true;
            }	
            break ru;
          case Chess.PieceType.BISHOP.WHITE:
            return true;
          case Chess.PieceType.BISHOP.BLACK:
            return true;
          case Chess.PieceType.QUEEN.WHITE:
            return true;
          case Chess.PieceType.QUEEN.BLACK:
            return true;
          default:
            break ru;
				}
			}
			bsq = this.#getPieceFromBoard(a++, b++);
		}
    // right-down
    a = x+1; b = y-1;
    bsq = this.#getPieceFromBoard(a++,b--);
    rd : while (bsq!==null) {
      if (bsq instanceof Piece && ktype.charAt(0)===(bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)) { break rd; }
      if (bsq instanceof Piece) {
        let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
        switch (bppt) {
          case Chess.PieceType.PAWN.WHITE:
            if (ktype===Chess.PieceType.KING.BLACK &&
                bsq.x-x===1 && bsq.y-y===-1) {
              return true;
            }
            break rd;
          case Chess.PieceType.BISHOP.WHITE:
            return true;
          case Chess.PieceType.BISHOP.BLACK:
            return true;
          case Chess.PieceType.QUEEN.WHITE:
            return true;
          case Chess.PieceType.QUEEN.BLACK:
            return true;
          default:
            break rd;
        }
      }
      bsq = this.#getPieceFromBoard(a++, b--);
    }
    // left-up
    a = x-1; b = y+1;
    bsq = this.#getPieceFromBoard(a--,b++);
    lu : while (bsq!==null) {
      if (bsq instanceof Piece && ktype.charAt(0)===(bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)) { break lu; }
      if (bsq instanceof Piece) {
        let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
        switch (bppt) {
          case Chess.PieceType.PAWN.BLACK:
            if (ktype===Chess.PieceType.KING.WHITE &&
                bsq.x-x===-1 && bsq.y-y===1) {
              return true;
            }
            break lu;
          case Chess.PieceType.BISHOP.WHITE:
            return true;
          case Chess.PieceType.BISHOP.BLACK:
            return true;
          case Chess.PieceType.QUEEN.WHITE:
            return true;
          case Chess.PieceType.QUEEN.BLACK:
            return true;
          default:
            break lu;
        }
      }
      bsq = this.#getPieceFromBoard(a--, b++);
    }
    // left-down
    a = x-1; b = y-1;
    bsq = this.#getPieceFromBoard(a--,b--);
    ld : while (bsq!==null) {
      if (bsq instanceof Piece && ktype.charAt(0)===(bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)) { break ld; }
      if (bsq instanceof Piece) {
        let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
        switch (bppt) {
          case Chess.PieceType.PAWN.WHITE:
            if (ktype===Chess.PieceType.KING.BLACK &&
                bsq.x-x===-1 && bsq.y-y===-1) {
              return true;
            }
            break ld;
          case Chess.PieceType.BISHOP.WHITE:
            return true;
          case Chess.PieceType.BISHOP.BLACK:
            return true;
          case Chess.PieceType.QUEEN.WHITE:
            return true;
          case Chess.PieceType.QUEEN.BLACK:
            return true;
          default:
            break ld;
        }
      }
      bsq = this.#getPieceFromBoard(a--, b--);
    }
    // vertical up
		vu : for (let up = y+1; up <= 8; up++) {
			bsq = this.#getPieceFromBoard(x, up);
			if (bsq instanceof Piece && ktype.charAt(0)===(bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)) { break vu; }
			if (bsq instanceof Piece) {
        let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
				switch (bppt) {
          case Chess.PieceType.ROOK.WHITE:
            return true;
          case Chess.PieceType.ROOK.BLACK:
            return true;
          case Chess.PieceType.QUEEN.WHITE:
            return true;
          case Chess.PieceType.QUEEN.BLACK:
            return true;
          default:
            break vu;
				}
			}
		}
		// vertical down
		vd : for (let down = y-1; down >= 1; down--) {
			bsq = this.#getPieceFromBoard(x, down);
			if (bsq instanceof Piece && ktype.charAt(0)===(bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)) { break vd; }
			if (bsq instanceof Piece) {
        let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
				switch (bppt) {
          case Chess.PieceType.ROOK.WHITE:
            return true;
          case Chess.PieceType.ROOK.BLACK:
            return true;
          case Chess.PieceType.QUEEN.WHITE:
            return true;
          case Chess.PieceType.QUEEN.BLACK:
            return true;
          default:
            break vd;
				}
			}
		}
		// horizontal left
		hl : for (let left = x-1; left >= 1; left--) {
			bsq = this.#getPieceFromBoard(left, y);
			if (bsq instanceof Piece && ktype.charAt(0)===(bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)) { break hl; }
			if (bsq instanceof Piece) {
        let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
				switch (bppt) {
          case Chess.PieceType.ROOK.WHITE:
            return true;
          case Chess.PieceType.ROOK.BLACK:
            return true;
          case Chess.PieceType.QUEEN.WHITE:
            return true;
          case Chess.PieceType.QUEEN.BLACK:
            return true;
          default:
            break hl;
			  }
		  }
    }
		// horizontal right
		hr : for (let right = x+1; right <= 8; right++) {
			bsq = this.#getPieceFromBoard(right, y);
			if (bsq instanceof Piece && ktype.charAt(0)===(bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)) { break hr; }
			if (bsq instanceof Piece) {
        let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
				switch (bppt) {
          case Chess.PieceType.ROOK.WHITE:
            return true;
          case Chess.PieceType.ROOK.BLACK:
            return true;
          case Chess.PieceType.QUEEN.WHITE:
            return true;
          case Chess.PieceType.QUEEN.BLACK:
            return true;
          default:
            break hr;
			  }
		  }
    }
    // knight checks
    kchecks = kchecksg();
    do {
      kc = kchecks.next().value;
      if (kc instanceof Array) {
        let kl = this.#getPieceFromBoard(kc[0], kc[1]);
        if (kl!==null && (((kl.promotedType==null?kl.type:kl.promotedType)===Chess.PieceType.KNIGHT.WHITE && player===Chess.PlayerType.BLACK) ||
            ((kl.promotedType==null?kl.type:kl.promotedType)===Chess.PieceType.KNIGHT.BLACK && player===Chess.PlayerType.WHITE))) {
          return true;
        }
      }
    } while(kc);
    // therefore not check
    return false;
  }
  #isCheckMove = (base, nextmove) => {
    const ignore = base;
    const pppt = ignore.promotedType==null?ignore.type:ignore.promotedType;
    const player = ignore instanceof Piece? pppt.charAt(0): this.Turn;
    const toEat = nextmove!==null && nextmove instanceof Piece ? nextmove : null;
    const isking = (pppt===Chess.PieceType.KING.WHITE || pppt===Chess.PieceType.KING.BLACK);
    const king = isking ? this.#getPieceFromBoard(nextmove.x, nextmove.y): this.#getKingPiece(player);
    const check = this.is_check;
    const kchecksg = function* () { yield* [[x+1,y+2], [x-1,y+2], [x+1,y-2], [x-1,y-2],
                                    [x+2,y+1], [x-2,y+1], [x+2,y-1], [x-2,y-1]]; }
    let kchecks;
    let kc;
    const x = king.x; const y = king.y;
    let a = 0; var b = 0;
    var bsq = null;
    // right-up
    a = x+1; b = y+1;
		bsq = this.#getPieceFromBoard(a++,b++);
    right_up: while (bsq!==null) {
			if (isking) {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) {
						if (bppt!==Chess.PieceType.KING.WHITE && bppt!==Chess.PieceType.KING.BLACK) {
                break right_up;
              }
					} else {
						switch (bppt) {
              case Chess.PieceType.PAWN.BLACK:
                if (player===Chess.PlayerType.WHITE &&
                    bsq.x-nextmove.x==1 && bsq.y-nextmove.y==1) { return true; }
                break right_up;
              case Chess.PieceType.BISHOP.WHITE:
                if (check && nextmove.equals(bsq)) { break right_up; }
                return true;
              case Chess.PieceType.BISHOP.BLACK:
                if (check && nextmove.equals(bsq)) { break right_up; }
                return true;
              case Chess.PieceType.QUEEN.WHITE:
                if (check && nextmove.equals(bsq)) { break right_up; }
                return true;
              case Chess.PieceType.QUEEN.BLACK:
                if (check && nextmove.equals(bsq)) { break right_up; }
                return true;
              case Chess.PieceType.KING.WHITE:
                if (Math.abs(nextmove.x-bsq.x)==1 && Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break right_up;
              case Chess.PieceType.KING.BLACK:
                if (Math.abs(nextmove.x-bsq.x)==1 && Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break right_up;
              default:
                break right_up;
						}
					}
				}
			} else {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) { 
						if(!bsq.equals(ignore)) { break right_up; }
					} else {
						switch (bppt) {
              case Chess.PieceType.PAWN.BLACK:
                if (player===Chess.PlayerType.WHITE &&
                    bsq.x-x==1 && bsq.y-y==1 &&
                    (toEat!==null && !toEat.equals(bsq))) { return true; }
                break right_up;
              case Chess.PieceType.BISHOP.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break right_up;
              case Chess.PieceType.BISHOP.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break right_up;
              case Chess.PieceType.QUEEN.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break right_up;
              case Chess.PieceType.QUEEN.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break right_up;
              default:
                break right_up;
						}
					}
				} else {
					if (nextmove.equals(bsq)) { break right_up; }
				}
			}
			bsq = this.#getPieceFromBoard(a++, b++);
		}
    // right-down
    a = x+1; b = y-1;
		bsq = this.#getPieceFromBoard(a++,b--);
    right_down: while (bsq!==null) {
			if (isking) {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) {
						if (bppt!==Chess.PieceType.KING.WHITE && bppt!==Chess.PieceType.KING.BLACK) {
                break right_down;
              }
					} else {
						switch (bppt) {
              case Chess.PieceType.PAWN.WHITE:
                if (player===Chess.PlayerType.BLACK &&
                    bsq.x-nextmove.x==1 && bsq.y-nextmove.y==-1) { return true; }
                break right_down;
              case Chess.PieceType.BISHOP.WHITE:
                if (check && nextmove.equals(bsq)) { break right_down; }
                return true;
              case Chess.PieceType.BISHOP.BLACK:
                if (check && nextmove.equals(bsq)) { break right_down; }
                return true;
              case Chess.PieceType.QUEEN.WHITE:
                if (check && nextmove.equals(bsq)) { break right_down; }
                return true;
              case Chess.PieceType.QUEEN.BLACK:
                if (check && nextmove.equals(bsq)) { break right_down; }
                return true;
              case Chess.PieceType.KING.WHITE:
                if (Math.abs(nextmove.x-bsq.x)==1 && Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break right_down;
              case Chess.PieceType.KING.BLACK:
                if (Math.abs(nextmove.x-bsq.x)==1 && Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break right_down;
              default:
                break right_down;
						}
					}
				}
			} else {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) { 
						if(!bsq.equals(ignore)) { break right_down; }
					} else {
						switch (bppt) {
              case Chess.PieceType.PAWN.WHITE:
                if (player===Chess.PlayerType.BLACK &&
                    bsq.x-x==1 && bsq.y-y==-1 &&
                    (toEat!==null && !toEat.equals(bsq))) { return true; }
                break right_down;
              case Chess.PieceType.BISHOP.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break right_down;
              case Chess.PieceType.BISHOP.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break right_down;
              case Chess.PieceType.QUEEN.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break right_down;
              case Chess.PieceType.QUEEN.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break right_down;
              default:
                break right_down;
						}
					}
				} else {
					if (nextmove.equals(bsq)) { break right_down; }
				}
			}
			bsq = this.#getPieceFromBoard(a++, b--);
		}
    // left-up
    a = x-1; b = y+1;
		bsq = this.#getPieceFromBoard(a--,b++);
    left_up: while (bsq!==null) {
			if (isking) {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) {
						if (bppt!==Chess.PieceType.KING.WHITE && bppt!==Chess.PieceType.KING.BLACK) {
                break left_up;
              }
					} else {
						switch (bppt) {
              case Chess.PieceType.PAWN.BLACK:
                if (player===Chess.PlayerType.WHITE &&
                    bsq.x-nextmove.x==-1 && bsq.y-nextmove.y==1) { return true; }
                break left_up;
              case Chess.PieceType.BISHOP.WHITE:
                if (check && nextmove.equals(bsq)) { break left_up; }
                return true;
              case Chess.PieceType.BISHOP.BLACK:
                if (check && nextmove.equals(bsq)) { break left_up; }
                return true;
              case Chess.PieceType.QUEEN.WHITE:
                if (check && nextmove.equals(bsq)) { break left_up; }
                return true;
              case Chess.PieceType.QUEEN.BLACK:
                if (check && nextmove.equals(bsq)) { break left_up; }
                return true;
              case Chess.PieceType.KING.WHITE:
                if (Math.abs(nextmove.x-bsq.x)==1 && Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break left_up;
              case Chess.PieceType.KING.BLACK:
                if (Math.abs(nextmove.x-bsq.x)==1 && Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break left_up;
              default:
                break left_up;
						}
					}
				}
			} else {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) { 
						if(!bsq.equals(ignore)) { break left_up; }
					} else {
						switch (bppt) {
              case Chess.PieceType.PAWN.BLACK:
                if (player===Chess.PlayerType.WHITE &&
                    bsq.x-x==-1 && bsq.y-y==1 &&
                    (toEat!==null && !toEat.equals(bsq))) { return true; }
                break left_up;
              case Chess.PieceType.BISHOP.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break left_up;
              case Chess.PieceType.BISHOP.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break left_up;
              case Chess.PieceType.QUEEN.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break left_up;
              case Chess.PieceType.QUEEN.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break left_up;
              default:
                break left_up;
						}
					}
				} else {
					if (nextmove.equals(bsq)) { break left_up; }
				}
			}
			bsq = this.#getPieceFromBoard(a--, b++);
		}
    // left-down
    a = x-1; b = y-1;
		bsq = this.#getPieceFromBoard(a--,b--);
    left_down: while (bsq!==null) {
			if (isking) {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) {
						if (bppt!==Chess.PieceType.KING.WHITE && bppt!==Chess.PieceType.KING.BLACK) {
                break left_down;
              }
					} else {
						switch (bppt) {
              case Chess.PieceType.PAWN.WHITE:
                if (player===Chess.PlayerType.BLACK &&
                    bsq.x-nextmove.x==-1 && bsq.y-nextmove.y==-1) { return true; }
                break left_down;
              case Chess.PieceType.BISHOP.WHITE:
                if (check && nextmove.equals(bsq)) { break left_down; }
                return true;
              case Chess.PieceType.BISHOP.BLACK:
                if (check && nextmove.equals(bsq)) { break left_down; }
                return true;
              case Chess.PieceType.QUEEN.WHITE:
                if (check && nextmove.equals(bsq)) { break left_down; }
                return true;
              case Chess.PieceType.QUEEN.BLACK:
                if (check && nextmove.equals(bsq)) { break left_down; }
                return true;
              case Chess.PieceType.KING.WHITE:
                if (Math.abs(nextmove.x-bsq.x)==1 && Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break left_down;
              case Chess.PieceType.KING.BLACK:
                if (Math.abs(nextmove.x-bsq.x)==1 && Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break left_down;
              default:
                break left_down;
						}
					}
				}
			} else {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) { 
						if(!bsq.equals(ignore)) { break left_down; }
					} else {
						switch (bppt) {
              case Chess.PieceType.PAWN.WHITE:
                if (player===Chess.PlayerType.BLACK &&
                    bsq.x-x==-1 && bsq.y-y==-1 &&
                    (toEat!==null && !toEat.equals(bsq))) { return true; }
                break left_down;
              case Chess.PieceType.BISHOP.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break left_down;
              case Chess.PieceType.BISHOP.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break left_down;
              case Chess.PieceType.QUEEN.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break left_down;
              case Chess.PieceType.QUEEN.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break left_down;
              default:
                break left_down;
						}
					}
				} else {
					if (nextmove.equals(bsq)) { break left_down; }
				}
			}
			bsq = this.#getPieceFromBoard(a--, b--);
		}
    // vertical up
		v_up: for (let up = y+1; up < 9; up++) {
			bsq = this.#getPieceFromBoard(x, up);
			if (isking) {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) {
						if (bppt!==Chess.PieceType.KING.WHITE && bppt!==Chess.PieceType.KING.BLACK) {
                break v_up;
              }
					} else {
						switch (bppt) {
              case Chess.PieceType.ROOK.WHITE:
                if (check && nextmove.equals(bsq)) { break v_up; }
                return true;
              case Chess.PieceType.ROOK.BLACK:
                if (check && nextmove.equals(bsq)) { break v_up; }
                return true;
              case Chess.PieceType.QUEEN.WHITE:
                if (check && nextmove.equals(bsq)) { break v_up; }
                return true;
              case Chess.PieceType.QUEEN.BLACK:
                if (check && nextmove.equals(bsq)) { break v_up; }
                return true;
              case Chess.PieceType.KING.WHITE:
                if (Math.abs(nextmove.x-bsq.x)==1 || Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break v_up;
              case Chess.PieceType.KING.BLACK:
                if (Math.abs(nextmove.x-bsq.x)==1 || Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break v_up;
              default:
                break v_up;
						}
					}
				}
			} else {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) { 
						if (!bsq.equals(ignore)) { break v_up; }
					} else {
						switch (bppt) {
              case Chess.PieceType.ROOK.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break v_up;
              case Chess.PieceType.ROOK.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break v_up;
              case Chess.PieceType.QUEEN.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break v_up;
              case Chess.PieceType.QUEEN.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break v_up;
              default:
                break v_up;
						}
					}
				} else {
					if (nextmove.equals(bsq)) break v_up;
				}
			}
		}
    // vertical down
		v_down: for (let down = y-1; down > 0; down--) {
			bsq = this.#getPieceFromBoard(x, down);
			if (isking) {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) {
						if (bppt!==Chess.PieceType.KING.WHITE && bppt!==Chess.PieceType.KING.BLACK) {
                break v_down;
              }
					} else {
						switch (bppt) {
              case Chess.PieceType.ROOK.WHITE:
                if (check && nextmove.equals(bsq)) { break v_down; }
                return true;
              case Chess.PieceType.ROOK.BLACK:
                if (check && nextmove.equals(bsq)) { break v_down; }
                return true;
              case Chess.PieceType.QUEEN.WHITE:
                if (check && nextmove.equals(bsq)) { break v_down; }
                return true;
              case Chess.PieceType.QUEEN.BLACK:
                if (check && nextmove.equals(bsq)) { break v_down; }
                return true;
              case Chess.PieceType.KING.WHITE:
                if (Math.abs(nextmove.x-bsq.x)==1 || Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break v_down;
              case Chess.PieceType.KING.BLACK:
                if (Math.abs(nextmove.x-bsq.x)==1 || Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break v_down;
              default:
                break v_down;
						}
					}
				}
			} else {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) {
						if (!bsq.equals(ignore)) { break v_down; }
					} else {
						switch (bppt) {
              case Chess.PieceType.ROOK.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break v_down;
              case Chess.PieceType.ROOK.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break v_down;
              case Chess.PieceType.QUEEN.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break v_down;
              case Chess.PieceType.QUEEN.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break v_down;
              default:
                break v_down;
						}
					}
				} else {
					if (nextmove.equals(bsq)) { break v_down; }
				}
			}
		}
    // horizontal left
		h_left: for (let left = x-1; left > 0; left--) {
			bsq = this.#getPieceFromBoard(left, y);
			if (isking) {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) {
						if (bppt!==Chess.PieceType.KING.WHITE && bppt!==Chess.PieceType.KING.BLACK) {
                break h_left;
              }
					} else {
						switch (bppt) {
              case Chess.PieceType.ROOK.WHITE:
                if (check && nextmove.equals(bsq)) { break h_left; }
                return true;
              case Chess.PieceType.ROOK.BLACK:
                if (check && nextmove.equals(bsq)) { break h_left; }
                return true;
              case Chess.PieceType.QUEEN.WHITE:
                if (check && nextmove.equals(bsq)) { break h_left; }
                return true;
              case Chess.PieceType.QUEEN.BLACK:
                if (check && nextmove.equals(bsq)) { break h_left; }
                return true;
              case Chess.PieceType.KING.WHITE:
                if (Math.abs(nextmove.x-bsq.x)==1 || Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break h_left;
              case Chess.PieceType.KING.BLACK:
                if (Math.abs(nextmove.x-bsq.x)==1 || Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break h_left;
              default:
                break h_left;
						}
					}
				}
			} else {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) { 
						if (!bsq.equals(ignore)) { break h_left; }
					} else {
						switch (bppt) {
              case Chess.PieceType.ROOK.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break h_left;
              case Chess.PieceType.ROOK.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break h_left;
              case Chess.PieceType.QUEEN.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break h_left;
              case Chess.PieceType.QUEEN.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break h_left;
              default:
                break h_left;
						}
					}
				} else {
					if (nextmove.equals(bsq)) break h_left;
				}
			}
		}
    // horizontal right
		h_right: for (let right = x+1; right < 9; right++) {
			bsq = this.#getPieceFromBoard(right, y);
			if (isking) {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) {
						if (bppt!==Chess.PieceType.KING.WHITE && bppt!==Chess.PieceType.KING.BLACK) {
                break h_right;
              }
					} else {
						switch (bppt) {
              case Chess.PieceType.ROOK.WHITE:
                if (check && nextmove.equals(bsq)) { break h_right; }
                return true;
              case Chess.PieceType.ROOK.BLACK:
                if (check && nextmove.equals(bsq)) { break h_right; }
                return true;
              case Chess.PieceType.QUEEN.WHITE:
                if (check && nextmove.equals(bsq)) { break h_right; }
                return true;
              case Chess.PieceType.QUEEN.BLACK:
                if (check && nextmove.equals(bsq)) { break h_right; }
                return true;
              case Chess.PieceType.KING.WHITE:
                if (Math.abs(nextmove.x-bsq.x)==1 || Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break h_right;
              case Chess.PieceType.KING.BLACK:
                if (Math.abs(nextmove.x-bsq.x)==1 || Math.abs(nextmove.y-bsq.y)==1) { return true; }
                break h_right;
              default:
                break h_right;
						}
					}
				}
			} else {
				if (bsq instanceof Piece) {
          let bppt = bsq.promotedType==null?bsq.type:bsq.promotedType;
					if ((bsq.promotedType==null?bsq.type:bsq.promotedType).charAt(0)===player) { 
						if (!bsq.equals(ignore)) { break h_right; }
					} else {
						switch (bppt) {
              case Chess.PieceType.ROOK.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break h_right;
              case Chess.PieceType.ROOK.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break h_right;
              case Chess.PieceType.QUEEN.WHITE:
                if (!bsq.equals(toEat)) { return true; }
                break h_right;
              case Chess.PieceType.QUEEN.BLACK:
                if (!bsq.equals(toEat)) { return true; }
                break h_right;
              default:
                break h_right;
						}
					}
				} else {
					if (nextmove.equals(bsq)) break h_right;
				}
			}
		}
    // knight checks
		// up-left
    let checkknight = null;
    let ckcount = 0;
    kchecks = kchecksg();
    do {
      kc = kchecks.next().value;
      if (kc instanceof Array) {
        let kl = this.#getPieceFromBoard(kc[0], kc[1]);
        if (kl!==null && (((kl.promotedType==null?kl.type:kl.promotedType)===Chess.PieceType.KNIGHT.WHITE && player===Chess.PlayerType.BLACK) ||
            ((kl.promotedType==null?kl.type:kl.promotedType)===Chess.PieceType.KNIGHT.BLACK && player===Chess.PlayerType.WHITE))) {
          if (checkknight===null) {
            checkknight = kl;
          }
          ckcount++;
        }
      }
    } while (kc);
    if (ckcount===1) {
			if (!nextmove.equals(checkknight)) { return true; }
		} else if (ckcount>1) {
      kchecks = kchecksg();
      do {
        kc = kchecks.next().value;
        if (kc instanceof Array) {
          bsq = this.#getPieceFromBoard(kc[0], kc[1]);
          if (isking) {
            if (bsq!==null && (((bsq.promotedType==null?bsq.type:bsq.promotedType)===Chess.PieceType.KNIGHT.WHITE && player===Chess.PlayerType.BLACK) ||
                ((bsq.promotedType==null?bsq.type:bsq.promotedType)===Chess.PieceType.KNIGHT.BLACK && player===Chess.PlayerType.WHITE))) {
              return true;
            }
          } else {
            if (check){
              return true;
            }
          }
        }
      } while (kc);
    }
    return false;
  }
  setLoadPercent(gid, pid, value) {
    if (pid in this.#_loaded_percent && gid===this.GameID) {
      if (value>100) { value = 100; }
      if (value!=this.#_loaded_percent[pid]) {
        this.#_loaded_percent[pid] = value;
        if (typeof this.#_callbacks[Chess.EVENTS.player_load]==="function") {
          let toSend = {
            gameId: this.GameID,
            playerWhite: {playerId: this.PlayerWhite, loadPercent: this.LoadPercent[0]},
            playerBlack: {playerId: this.PlayerBlack, loadPercent: this.LoadPercent[1]}
          };
          this.#_callbacks[Chess.EVENTS.player_load].call(this, toSend);
        }
      }
    }
  }
  start() {
    this.#startnow()
    .then((gdata) => {
      if (typeof this.#_callbacks[Chess.EVENTS.start]==="function") {
        this.#_callbacks[Chess.EVENTS.start].call(this, gdata);
      }
    })
    .catch(()=>{});
  }
  isValidTurn(gid, pid) {
    if (gid === this.GameID) {
      if (this.Turn===Chess.PlayerType.WHITE && this.PlayerWhite===pid) {
        return true;
      }
      if (this.Turn===Chess.PlayerType.BLACK &&this.PlayerBlack===pid) {
        return true;
      }
    }
    return false;
  }
  hasPiece(piece) {
    for (let pi in this.WhitePieces) {
      if (this.WhitePieces[pi].equals(piece)) {
        return true;
      }
    }
    for (let pbi in this.BlackPieces) {
      if (this.BlackPieces[pbi].equals(piece)) {
        return true;
      }
    }
    return false;
  }
  isValidToSelect = (gid, pid, position) => {
    if (this.isValidTurn(gid, pid) && (typeof position === "string")) {
      let piece = this.#getPieceByPosition(position);
      if (this.PlayerWhite===pid) {
        for (let wp in this.WhitePieces) {
          if (this.WhitePieces[wp].equals(piece) && this.Board[Chess.chars[piece.x-1]+piece.y.toString()] instanceof Piece &&
              this.Board[Chess.chars[piece.x-1]+piece.y.toString()].equals(piece)) {
            return true;
          }
        }
      }
      if (this.PlayerBlack===pid) {
        for (let bp in this.BlackPieces) {
          if (this.BlackPieces[bp].equals(piece) && this.Board[Chess.chars[piece.x-1]+piece.y.toString()] instanceof Piece &&
              this.Board[Chess.chars[piece.x-1]+piece.y.toString()].equals(piece)) {
            return true;
          }
        }
      }
      return this.PossibleMoves.includes(position)
    }
    return false;
  }
  selectPiece(gid, pid, position) {
    if (!this.isGameover && this.hasStarted) {
      if (gid===this.GameID) {
        if (this.isValidToSelect(gid, pid, position)) {
          let piece = this.#getPieceByPosition(position);
          if (piece instanceof Piece) {
            if (this.SelectedPiece===null) {
              this.#setSelectedPiece(piece);
            } else {
              if (this.SelectedPiece.position===position) {
                this.#deselectPiece(gid, pid, position, piece);
              } else {
                if (this.#_possibleMoves.includes(position)) {
                  this.#makeMove(gid, pid, position);
                }
              }
            }
          } else {
            if (this.SelectedPiece!==null && this.#_possibleMoves.includes(position)) {
              this.#makeMove(gid, pid, position);
            }
          }
        }
      }
    }
  }
  #makeMove = (gid, pid, nextpos) => {
    if (!this.isGameover && this.hasStarted && this.isValidTurn(gid, pid) && this.hasSelectedPiece) {
      let pm = this.PossibleMoves;
      for (let i in pm) {
        if (pm[i]===nextpos) {
          let promoted = this.SelectedPiece.moveTo(this.Board, this.SelectedPiece.position, nextpos);
          if (promoted) {
            if (typeof this.#_callbacks[Chess.EVENTS.promotion]==="function") {
              let toSend = {gameId: this.GameID, playerId: this.Turn===Chess.PlayerType.WHITE?this.PlayerWhite:this.PlayerBlack, position: nextpos};
              this.#_callbacks[Chess.EVENTS.promotion].call(this, this.Turn, toSend);
            }
            return false;
          } else {
            this.#nextTurn();
          }
          return true;
        }
      } 
    }
    return false;
  }
  promote_piece(gid, pid, piecetype, position) {
    if (!this.isGameover && this.hasStarted && this.isValidTurn(gid, pid) && this.hasSelectedPiece) {
      if (this.SelectedPiece.position===position) {
        if ((this.Turn===Chess.PlayerType.WHITE && this.SelectedPiece.y===8) ||
            (this.Turn===Chess.PlayerType.BLACK && this.SelectedPiece.y===1)) {
          let success = this.SelectedPiece.promote(piecetype);
          if (success) {
            this.#nextTurn();
            return true;
          }
        }
      }
    }
    return false;
  }
  /**
   * Chess Event listener
   * @param {*} event Event of Chess Game
   * @param {*} callback Callback function for listening events
   * @returns {boolean} true if successfully register callback. false otherwise
   * @throws TypeError
   * @example chessGame.on(Chess.EVENTS.start, (gameData) => {
   *   var data = JSON.stringify(gameData);
   *   socket.emit("game_start", data)
   * });
   */
  on(event, callback) {
    if (typeof callback !== "function") { throw new TypeError("Chess.on(event, callback) argument callback "+callback+" should be typeof 'function' not '"+typeof callback+"'."); }
    if (event in Chess.EVENTS) {
      this.#_callbacks[event] = callback;
      return true;
    }
    return false;
  }
  /**
   * Proxy callback to use `this` as Chess instance in the callback.
   * @param {*} callback proxy function callback
   * @param  {...any} Args arguments
   * @example
   * var game = new Chess("1", "p1", "p2", "P1", "P2");
   * game.proxy_callback(proxy, player1Process, player2Process);
   * 
   * function proxy(arg1, arg2) {
   *   var chessGame = this;
   *   chessGame.on("game_load", (data) => {
   *     arg1.processData(data);
   *   });
   * }
   */
  proxy_callback(callback, ...Args) {
    if (typeof callback !== "function") { throw new TypeError("Chess.on(event, callback) argument callback "+callback+" should be typeof 'function' not '"+typeof callback+"'."); }
    var args = arguments.length>1?Args:[];
    callback.call(this, ...args);
  }
}


module.exports = (gameId, whiteId, blackId, whiteName, blackName) => new Chess(gameId, whiteId, blackId, whiteName, blackName);
exports.Chess = Chess;
