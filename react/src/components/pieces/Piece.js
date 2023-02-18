
import React from 'react';

function App({squareSize, piece = "pawn", color = "white"}) {
  return (
    <div className={`piece-${color}`}>
      <i className={`fas fa-chess-${piece} mt-3`} style={{width: squareSize * 0.5, height: squareSize * 0.5}} ></i>
    </div>
  );
}

export default App;