import Piece from './pieces/Piece';

function App(props) {
    return (  
      <div className={((props.x + props.y) % 2 === 0 ? "chess-square-black" : "chess-square-white") + (props.disabled ? " square-disabled" : "") + (props.highlighted ? " square-highlighted" : "")} style={{
        width: (props.boardWidth / 8) + "px", height: (props.boardWidth / 8) + "px", left: ((props.x-1) * (props.boardWidth / 8) - 1)  + "px", bottom: ((props.y) * (props.boardWidth / 8) - 1) + "px"
      }} role="button">
        { props.piece ? <Piece piece={props.piece} color={props.pcolor} squareSize={props.boardWidth / 8} /> : undefined }
      </div>
    );
  }

  export default App;