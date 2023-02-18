
import './ChessBoard.css';
import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import Board from './chess/Board';

function App() {
  const [chessboard, chessboardRef] = useState(undefined);
  
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
