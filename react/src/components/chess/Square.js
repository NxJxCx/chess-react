import Piece from './Piece';

function App({board, onClick=()=>{}, piece, pcolor="white", disabled=true, highlighted=false, x=1, y=1}) {
    return (  
      <div className={((x + y) % 2 === 0 ? "chess-square-black" : "chess-square-white") + (disabled ? " square-disabled" : "") + (highlighted ? " square-highlighted" : "")} style={{
        width: (board.offsetWidth / 8) + "px", height: (board.offsetWidth / 8) + "px", left: ((x-1) * (board.offsetWidth / 8))  + "px", bottom: ((y-1) * (board.offsetWidth / 8)) + "px"
      }} role="button" onClick={function(e) { if (!e.currentTarget.classList.contains('square-disabled')) onClick(piece, pcolor, x, y) }}>
        { piece ? <Piece piece={piece} color={pcolor || "white"} squareSize={board.offsetWidth / 8} /> : undefined }
      </div>
    );
  }

  export default App;