import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`${isWinningSquare ? 'winning-square' : 'square'}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    const row = Math.floor(i / 3);
    const col = i % 3;
    onPlay(nextSquares, { row, col });
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningSquares = winnerInfo ? winnerInfo.winningSquares : [];

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (!squares.includes(null)) {
    status = "It's a tie!";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array(3).fill(null).map((_, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {Array(3).fill(null).map((_, colIndex) => {
            const index = rowIndex * 3 + colIndex; 
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                isWinningSquare={winningSquares.includes(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [historyOrder, setHistoryOrder] = useState(false);

  function handlePlay(nextSquares, location) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    const { location } = step;
    const description = move === currentMove
      ? `You are at move #${move}`
      : move > 0
        ? `Go to move #${move} (${location ? `${location.row + 1}, ${location.col + 1}` : ''})`
        : 'Go to game start';
    
    return (
      <li key={move}>
        {move === currentMove ? (
          <h3>{description}</h3>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="container">
      <h1 className="title">Tic Tac Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <button onClick={() => setHistoryOrder(!historyOrder)}>Toggle Order</button>
          <ol>{historyOrder ? moves.slice().reverse() : moves}</ol>
        </div>
      </div>
      <footer className="footer">
        <p>
          This game is based on the tutorial from{' '}
          <a href="https://react.dev/learn/tutorial-tic-tac-toe" target="_blank" rel="noopener noreferrer">
            React's Tic-Tac-Toe tutorial
          </a>. View the code on{' '}
          <a href="https://github.com/RenanaTurgeman/Tic-Tac-Toe" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>.
        </p>
      </footer>
    </div>
  );
}

function calculateWinner(squares) {
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
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}