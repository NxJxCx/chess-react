
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
    selectedPiece: null,
    get highlighted() {
      // do some selected with highloghts 8*8 array
      // true / false
      if (!(this.gameData.isPlaying && this.gameData.turn === this.myID && this.selectedPiece))
        return [] // empty array because its not our turn
      // else do some calculations on highlighting squares on selected piece
      let result = Array.
      return
    }
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
       <Board board={chessboard} onClick={onSelectPiece} pieces={["pawn", "rook", "queen"]} pcolors={["white", "black", "white"]} clickables={[false, true, true]} /> : 
       <Spinner />}
      </div>
    </div>
  );
}

export default App;
