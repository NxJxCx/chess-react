

/*

Array.from({length: 8}).fill([])
        .map((_, i) =>
          Array.from({length: 8}).fill(false)
          .map((ity, j) => {
            const piece = this.selectedPiece.piece;
            const x = this.selectedPiece.x;
            const y = this.selectedPiece.y;
            switch (piece) {
              case "pawn": {
                // selected pawn
                if (x === i+1 && y === j+1)
                  return true;
                // possible move pawn
                if (!this.gameData.board[i][j] && x === i+1 && y === j)
                  return true;
                // possible move 2 pawn
                if (!this.gameData.board[i][j] && !this.gameData.board[i][j-1] && x === i+1 && y === j-1)
                  return true;
                // pawn attack 
                if (!this.gameData.board[i][j] && (x === i || x === i+2) && y === j)
                  return true;
                break;
              }
              case "rook": {
                // selected rook
                if (x === i+1 && y === j+1)
                  return true;
                // possible moves x axis rookk
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

*/

