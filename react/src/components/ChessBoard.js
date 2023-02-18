
import './ChessBoard.css';
import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import Board from './Board';

function App() {
  const [chessboard, chessboardRef] = useState(undefined);
  useEffect(() => {
    if (chessboard)  {
      window.onresize = function() {
        chessboard.current.style.height = chessboard.current.offsetWidth;
      }
    }
  }, [chessboard]);

  return (
    <div className="d-flex justify-content-center">
      <div className="chessboard" ref={chessboardRef}>
      {chessboard ?
       <Board boardWidth={chessboard.offsetWidth} pieces={["pawn", "rook", "queen"]} pcolors={["white", "black", "white"]} clickables={[false, true, true]} /> : 
       <Spinner />}
      </div>
    </div>
  );
}

export default App;
