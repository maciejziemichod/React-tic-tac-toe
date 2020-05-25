import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  // 5. improvement: When someone wins, highlight the three squares that caused the win.
  let classes =
    props.highlighted.indexOf(props.index) >= 0
      ? "square highlighted"
      : "square";
  return (
    <button className={classes} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        index={i}
        highlighted={this.props.highlighted}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // 3. improvement: Rewrite Board to use two loops to make the squares instead of hardcoding them.
    const board = [];
    for (let x = 0; x < 3; x++) {
      const row = [];
      for (let y = 0; y < 3; y++) {
        row.push(this.renderSquare(x * 3 + y));
      }
      board.push(<div className="board-row">{row}</div>);
    }

    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      defaultOrder: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    // 1. improvement: Display the location for each move in the format (col, row) in the move history list.
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  // 4. improvement: Add a toggle button that lets you sort the moves in either ascending or descending order.
  toggleOrder() {
    this.setState({ defaultOrder: !this.state.defaultOrder });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // 1. improvement: Display the location for each move in the format (col, row) in the move history list.
    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move # ${move} (${convertLocation(step.location)})`
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {/* 2. improvement: Bold the currently selected item in the move list. */}
            {this.state.stepNumber === move ? <strong>{desc}</strong> : desc}
          </button>
        </li>
      );
    });

    // 4. improvement: Add a toggle button that lets you sort the moves in either ascending or descending order.
    const reversedMoves = [...moves].reverse();

    let status;
    // 5. improvement: When someone wins, highlight the three squares that caused the win.
    let highlighted = [];
    if (winner) {
      status = "Winner: " + winner[0];
      highlighted = winner[1];
    } else if (history.length === 10) {
      // 6. improvement: When no one wins, display a message about the result being a draw.
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            highlighted={highlighted}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>

          {/* 4. improvement: Add a toggle button that lets you sort the moves in either ascending or descending order. */}
          <ol>{this.state.defaultOrder ? moves : reversedMoves}</ol>
          <button onClick={() => this.toggleOrder()}>Change order</button>
        </div>
      </div>
    );
  }
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
      return [squares[a], lines[i]];
    }
  }
  return null;
}

// 1. improvement: Display the location for each move in the format (col, row) in the move history list.
function convertLocation(i) {
  let row;
  let col;

  switch (i) {
    case 0:
    case 3:
    case 6:
      col = "col 1";
      break;
    case 1:
    case 4:
    case 7:
      col = "col 2";
      break;
    case 2:
    case 5:
    case 8:
      col = "col 3";
      break;
    default:
      break;
  }

  switch (i) {
    case 0:
    case 1:
    case 2:
      row = "row 1";
      break;
    case 3:
    case 4:
    case 5:
      row = "row 2";
      break;
    case 6:
    case 7:
    case 8:
      row = "row 3";
      break;
    default:
      break;
  }
  return `${col} ${row}`;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
