
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
      // do some selected with highloghts 8*8 array of true / false
      return (!(this.gameData.isPlaying && this.gameData.turn === this.myID && this.selectedPiece) ?
        [] /* empty array because its not our turn */ :
        // else do some calculations on highlighting squares on selected piece
        Array.from({length: 8}).fill([])
        .map((_, i) =>
          Array.from({length: 8}).fill(false)
          .map((ity, j) => {
            const piece = this.selectedPiece.piece;
            const x = this.selectedPiece.x;
            const y = this.selectedPiece.y;
            switch (piece) {
              case "pawn": {
                /* selected pawn */
                if (x === i+1 && y === j+1)
                  return true;
                /* next move pawn */
                if (!this.gameData.board[i][j] && x === i+1 && y === j)
                  return true;
                /* next move 2 pawn */
                if (!this.gameData.board[i][j] && !this.gameData.board[i][j-1] && x === i+1 && y === j-1)
                  return true;
                /* eat pawn */
                if (!this.gameData.board[i][j] && (x === i || x === i+2) && y === j)
                  return true;
                break;
              }
              case "rook": {
                /* selected rook */
                if (x === i+1 && y === j+1)
                  return true;
                break;
              }
              case "knight": {
                break;
              }
              case "bishop": {
                break;
              }
              case "queen": {
                break;
              }
              case "king": {
                break;
              }
              default:
                // nothing
            }
            return ity;
          })
        )
      );
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
