
import './ChessBoard.css';
import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';


function Piece(props) {
  const [piece] = useState(props.piece || "pawn");
  const [color] = useState(props.color || "white");
  const [position] = useState(props.position instanceof Array && props.position.length === 2 && typeof(props.position[0]) === "number" && typeof(props.position[0]) === "number" ? props.position.map(it => Math.floor(it)) : [1,1]);
  const [square, squareRef] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const sqSize = props.board.offsetWidth / 8;
    if (square) {
      square.style.left = ((position[0] - 1) * sqSize) + "px";
      square.style.bottom = ((position[1] - 1) * sqSize) + "px";
    }
    window.onresize = function() {
      const sqSize = props.board.offsetWidth / 8;
      if (square) {
        square.style.left = ((position[0] - 1) * sqSize) + "px";
        square.style.bottom = ((position[1] - 1) * sqSize) + "px";
      }
    };
  }, [props.board, square]);

  return (
    <>
    {isLoaded ? (
      <div className={[...position].reduce((ps, a) => ps + a, 0) % 2 === 0 ? "chess-square-black" : "chess-square-black"} ref={squareRef} >
        <div className={`clickable ${color}`}>
          <i className={`fas fa-chess-${piece}`}></i>
        </div>
      </div>
    ) : <Spinner />}
    </>
  );
}

const PawnWhite = function(props) {
  return (
    <Piece piece="pawn" color="white" position={props.position || [1,2]} board={props.board} />
  );
}

const PawnBlack = function(props) {
  return (
    <Piece piece="pawn" color="black" position={props.position || [1,7]} board={props.board} />
  );
}

const RookWhite = function(props) {
  return (
    <Piece piece="rook" color="white" position={props.position || [1,1]} board={props.board} />
  );
}

const RookBlack = function(props) {
  return (
    <Piece piece="rook" color="black" position={props.position || [1,8]} board={props.board} />
  );
}

const KnightWhite = function(props) {
  return (
    <Piece piece="knight" color="white" position={props.position || [2,1]} board={props.board} />
  );
}

const KnightBlack = function(props) {
  return (
    <Piece piece="knight" color="black" position={props.position || [2,8]} board={props.board} />
  );
}

const BishopWhite = function(props) {
  return (
    <Piece piece="bishop" color="white" position={props.position || [3,1]} board={props.board} />
  );
}

const BishopBlack = function(props) {
  return (
    <Piece piece="bishop" color="black" position={props.position || [3,8]} board={props.board} />
  );
}

const QueenWhite = function(props) {
  return (
    <Piece piece="queen" color="white" position={props.position || [4,1]} board={props.board} />
  );
}

const QueenBlack = function(props) {
  return (
    <Piece piece="queen" color="black" position={props.position || [4,8]} board={props.board} />
  );
}

const KingWhite = function(props) {
  return (
    <Piece piece="king" color="white" position={props.position || [5,1]} board={props.board} />
  );
}

const KingBlack = function(props) {
  return (
    <Piece piece="king" color="black" position={props.position || [5,8]} board={props.board} />
  );
}

function App() {
  const [chessBoard, chessboardRef] = useState(null);
  useEffect(() => {
    if (chessBoard) {
      window.onresize = function() {
        chessBoard.style.height = chessBoard.offsetWidth;
      }
    }
  }, [chessBoard]);

  const Content = function(props) {
    return (
    <>
      {/* White */}
      <PawnWhite board={props.board} position={[1,2]}/>
      <PawnWhite board={props.board} position={[2,2]}/>
      <PawnWhite board={props.board} position={[3,2]}/>
      <PawnWhite board={props.board} position={[4,2]}/>
      <PawnWhite board={props.board} position={[5,2]}/>
      <PawnWhite board={props.board} position={[6,2]}/>
      <PawnWhite board={props.board} position={[7,2]}/>
      <PawnWhite board={props.board} position={[8,2]}/>
      <RookWhite board={props.board} position={[1,1]}/>
      <KnightWhite board={props.board} position={[2,1]}/>
      <BishopWhite board={props.board} position={[3,1]}/>
      <RookWhite board={props.board} position={[8,1]}/>
      <KnightWhite board={props.board} position={[7,1]}/>
      <BishopWhite board={props.board} position={[6,1]}/>
      <QueenWhite board={props.board} position={[4,1]}/>
      <KingWhite board={props.board} position={[5,1]}/>
      {/* Black */}
      <PawnBlack board={props.board} position={[1,7]}/>
      <PawnBlack board={props.board} position={[2,7]}/>
      <PawnBlack board={props.board} position={[3,7]}/>
      <PawnBlack board={props.board} position={[4,7]}/>
      <PawnBlack board={props.board} position={[5,7]}/>
      <PawnBlack board={props.board} position={[6,7]}/>
      <PawnBlack board={props.board} position={[7,7]}/>
      <PawnBlack board={props.board} position={[8,7]}/>
      <RookBlack board={props.board} position={[1,8]}/>
      <KnightBlack board={props.board} position={[2,8]}/>
      <BishopBlack board={props.board} position={[3,8]}/>
      <RookBlack board={props.board} position={[8,8]}/>
      <KnightBlack board={props.board} position={[7,8]}/>
      <BishopBlack board={props.board} position={[6,8]}/>
      <QueenBlack board={props.board} position={[4,8]}/>
      <KingBlack board={props.board} position={[5,8]}/>
    </>
    );
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="chessboard" ref={chessboardRef}>
      {chessBoard ?
       <Content board={chessBoard} /> :
       <Spinner />}
      </div>
    </div>
  );
}

export default App;
