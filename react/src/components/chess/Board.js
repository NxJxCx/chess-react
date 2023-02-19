import Square from './Square';

function App({board, onClick=()=>{}, pieces=[], pcolors=[], clickables=[], highlights=[] }) {
  return (
  <>
    { Array.from({length: 8*8}).fill(undefined)
        .map((_, i) =>
          <Square key={"square" + i}
                  board={board}
                  onClick={onClick}
                  piece={pieces[(i % 8)][Math.floor(i / 8)]}
                  pcolor={pcolors[(i % 8)][Math.floor(i / 8)]}
                  x={(i % 8) + 1}
                  y={Math.floor(i / 8) + 1}
                  disabled={!!!clickables[(i % 8)][Math.floor(i / 8)]}
                  highlighted={!!highlights[(i % 8)][Math.floor(i / 8)]}
          />
        )
      }
  </>
  );
}
export default App;