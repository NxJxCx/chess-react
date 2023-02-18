
import './ChessBoard.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  return (
    <div className="chessboard">
      <Container>
        <Row>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="top left">
            <div className="draggable">
              <i className="fas fa-chess-rook"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="top bg-dark">
            <div className="draggable">
              <i className="fas fa-chess-knight"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="top">
            <div className="draggable">
              <i className="fas fa-chess-bishop"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="top bg-dark">
            <div className="draggable">
              <i className="fas fa-chess-queen"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="top">
            <div className="draggable">
              <i className="fas fa-chess-king"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="top bg-dark">
            <div className="draggable">
              <i className="fas fa-chess-bishop"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="top">
            <div className="draggable">
              <i className="fas fa-chess-knight"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="top bg-dark">
            <div className="draggable">
              <i className="fas fa-chess-rook"></i>
            </div>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark left">
            <div className="draggable">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
            <div className="draggable">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
            <div className="draggable">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
            <div className="draggable">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="left">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark left">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="left">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark left">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="left">
            <div className="draggable white">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
            <div className="draggable white">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable white">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
            <div className="draggable white">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable white">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
            <div className="draggable white">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable white">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
            <div className="draggable white">
              <i className="fas fa-chess-pawn"></i>
            </div>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark left">
            <div className="draggable white">
              <i className="fas fa-chess-rook"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable white">
              <i className="fas fa-chess-knight"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
            <div className="draggable white">
              <i className="fas fa-chess-bishop"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable white">
              <i className="fas fa-chess-queen"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
            <div className="draggable white">
              <i className="fas fa-chess-king"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable white">
              <i className="fas fa-chess-bishop"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="bg-dark">
            <div className="draggable white">
              <i className="fas fa-chess-knight"></i>
            </div>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            <div className="draggable white">
              <i className="fas fa-chess-rook"></i>
            </div>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;