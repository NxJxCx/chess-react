import Square from './Square';

function App({board, onClick=()=>{}, pieces=[], pcolors=[], clickables=[], highlights=[] }) {
  return (
  <>
    { Array.from({length: 8*8}).fill(undefined)
        .map((_, i) =>
          <Square key={"square" + i}
                  board={board}
                  onClick={onClick}
                  piece={pieces.length > (i % 8) &&
                         pieces[i % 8].length > Math.floor(i / 8) ?
                         pieces[i % 8][Math.floor(i / 8)] :
                         undefined}
                  pcolor={pcolors.length > (i % 8) &&
                         pcolors[i % 8].length > Math.floor(i / 8) ?
                         pcolors[i % 8][Math.floor(i / 8)] :
                         undefined}
                  x={(i % 8) + 1}
                  y={Math.floor(i / 8) + 1}
                  disabled={clickables.length > (i % 8) &&
                            clickables[i % 8].length > Math.floor(i / 8) ?
                            !!!clickables[(i % 8)][Math.floor(i / 8)] :
                            true}
                  highlighted={highlights.length > (i % 8) &&
                               highlights[i % 8].length > Math.floor(i / 8) ?
                               !!highlights[(i % 8)][Math.floor(i / 8)] :
                               false}
          />
        )
      }
  </>
  );
}
export default App;
