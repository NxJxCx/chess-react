import Square from './Square';

function App({boardWidth, onClick=()=>{}, pieces=[], pcolors=[], clickables=[], highlights=[] }) {
  return (
  <>
    { Array.from({length: 8*8}).fill(undefined).map((_, i) => <Square key={"square" + i} boardWidth={boardWidth} onClick={onClick} piece={pieces[i]} pcolor={pcolors[i] || "white"} x={(i % 8) + 1} y={Math.floor(i / 8) + 1}  disabled={!!!clickables[i]} highlighted={!!highlights[i]} />) }
  </>
  );
}
export default App;