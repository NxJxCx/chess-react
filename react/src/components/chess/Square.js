import Piece from './Piece';

function App(props) {
    return (  
      <div className={((props.x + props.y) % 2 === 0 ? "chess-square-black" : "chess-square-white") + (props.disabled ? " square-disabled" : "") + (props.highlighted ? " square-highlighted" : "")} style={{
        width: (props.boardWidth / 8) + "px", height: (props.boardWidth / 8) + "px", left: ((props.x-1) * (props.boardWidth / 8) - 1)  + "px", bottom: ((props.y-1) * (props.boardWidth / 8) - 1) + "px"
      }} role="button" onClick={function(e) { if (!e.currentTarget.classList.contains('square-disabled')) props.onClick(props.piece, props.pcolor, props.x, props.y) }}>
        { props.piece ? <Piece piece={props.piece} color={props.pcolor} squareSize={props.boardWidth / 8} /> : undefined }
      </div>
    );
  }

  export default App;