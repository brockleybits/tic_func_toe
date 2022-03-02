import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares, returnXO) {

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      if (returnXO) {
        return squares[a]
      }
      else {
        let winBoard = Array(9).fill(false);
        winBoard[a] = true;
        winBoard[b] = true;
        winBoard[c] = true;
        return winBoard;
      }
    }
  }
  return null;
}

const App = () => {
    function handleClick(i) {
      const boardHistory = history.slice(0, stepNumber + 1);
      const currentBoard = boardHistory[boardHistory.length - 1];
      const currentSquares = currentBoard.squares.slice();
      if (calculateWinner(currentSquares, false) || currentSquares[i]) {
        return
      }
      currentSquares[i] = xIsNext ? 'X' : 'O';
      setHistory(boardHistory.concat([
        {
            squares: currentSquares
        }
      ]));
      setStepNumber(boardHistory.length);
      setXIsNext(!xIsNext);
      return
    }

    function jumpTo(step) {
      setStepNumber(step);
      setXIsNext((step % 2) === 0);
      return
    }

    const [history, setHistory] = React.useState([
      {
        squares: Array(9).fill(null)
      }
    ]);
    const [stepNumber, setStepNumber] = React.useState(0);
    const [xIsNext, setXIsNext] = React.useState(true);
    const currentBoard = history[stepNumber];
    const winner = calculateWinner(currentBoard.squares, true);
    const winBoard = calculateWinner(currentBoard.squares, false)

    return (
        <div>
            <h1>Tic-Tac-Toe</h1>
            <Board squares={currentBoard.squares} onClick={(i) => handleClick(i)} winSquares={winBoard} />
            <Status winner={winner} stepNum={stepNumber} xNext={xIsNext}/>
            <h4>Movements:</h4>
            <ul>
                <Moves boardList={history} onClick={(m) => jumpTo(m)} />
            </ul>
        </div>
    );
}

const Board = ({squares, onClick, winSquares}) => {
  const squareCss = [
        "square sqtl",
        "square sqtc",
        "square sqtr",
        "square sqml",
        "square sqmc",
        "square sqmr",
        "square sqbl",
        "square sqbc",
        "square sqbr"
      ];
  const colorList = Array(9).fill(null);
  if (winSquares) {
    for (let x = 0; x < squares.length; x++) {
      winSquares[x] ? colorList[x] = "#cc6633" : colorList[x] = "#61dafb";
    }
  }
	const displaySquares = [];
  const displayBoard = [];
	for (const square of squares.keys()) {
    !winSquares ?
      displaySquares.push(
        <button className={squareCss[square]} onClick={() => onClick(square)}>
          {squares[square]}
        </button>
      )
    :
      displaySquares.push(   
        <button className={squareCss[square]} style={{color : colorList[square]}}>
          {squares[square]}
        </button>
      )
  }
  for (let i=1; i<=squares.length/3; i++) {
    displayBoard.push(
      <div className="board-row">
        {displaySquares.shift()}
        {displaySquares.shift()}
        {displaySquares.shift()}
      </div>
    );
  }
	return (
    <div className="board">
        {displayBoard}
    </div>
  );
}

const Moves = ({boardList, onClick}) => {
    return boardList.map((board, move) => 
        <li key={move}>
            <button
                className="moveButton"
                onClick = {() => onClick(move)}
            >
                {move ? move : 'Start'}
            </button>
        </li>
    );
}

const Status = ({winner, stepNum, xNext}) => {
    let gameStatus;
    if (winner) {
        gameStatus = winner + ' WINS!';
    }
    else if (stepNum + 1 === 10) {
        gameStatus = 'Tie. Refresh to play again!'
    }
    else {
        gameStatus = (xNext ? 'X' : 'O') + '\'s Turn';
    }
    return (
        <p className="status">{gameStatus}</p>
    );
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
