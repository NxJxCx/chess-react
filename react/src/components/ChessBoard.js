
import './ChessBoard.css';
import React, { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import Board from './chess/Board';

function App() {
  const [chessboard, chessboardRef] = useState(undefined);
  const [isPlaying, setPlaying] = useState(false);
  const [game, setGame] = useState({
    gameData: {},
    turnTime: 0,
    myID: null,
    enemyID: null,
    get selectedPiece() {
      return this.isMyTurn ? this.gameData[this.myID].selectedPiece : null;
    },
    get highlighted() {
      return this.selectedPiece ? this.gameData[this.myID].possibleMoves : [];
    },
    get isMyTurn() {
      return (this.myID && this.gameData[this.myID] &&
              this.gameData.turn === this.myID);
    },
    get myTimeLeft() {
      return (this.gameData.hasStarted && this.isMyTurn() ?
              this.gameData[this.myID].timeLeft - (Date.now() - this.turnTime) :
              this.gameData[this.myID].timeLeft);
    },
    get enemyTurnLeft() {
      return (this.gameData.hasStarted && !this.isMyTurn() ?
              this.gameData[this.enemyID].timeLeft - (Date.now() - this.turnTime) :
              this.gameData[this.enemyID].timeLeft);
    }
  });
  const onSelectPiece = (piece, color, x, y) => {
    console.log("piece: ", piece);
    console.log("color: ", color);
    console.log("x: ", x);
    console.log("y: ", y);
  }
  return (
    <div className="d-flex justify-content-center">
      <div className="chessboard" ref={chessboardRef}>
      {chessboard ?
       <Board board={chessboard} onClick={onSelectPiece} pieces={[["rook", "pawn", null, null, null, null, "pawn", "rook"]]} pcolors={[["white", "white", null, null, null, null, "pawn", "rook"]]} clickables={[[true, true, false, false, false, true, false]]} /> : 
       <Spinner />}
      </div>
    </div>
  );
}

export default App;
