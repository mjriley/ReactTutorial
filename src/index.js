import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.isWinner ? "square winner" : "square"} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square key={i} value={this.props.squares[i]}
                isWinner={this.props.winningSquares && this.props.winningSquares.includes(i)}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let results = [];
        for (let x = 0; x < 3; x++) {
            let children = [];
            for (let y = 0; y < 3; y++) {
                children.push(this.renderSquare(x * 3 + y));
            }
            let ele = <div key={x} className="board-row">{children}</div>;
            results.push(ele);
        }
        return <div>{results}</div>;
    }
}


class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const winningSquares = getWinningSquares(current.squares);

        let moves = history.map((step, move) => {
            const desc = move ? 'Move #' + move + ": " + step.moveId : 'Game start';
            return (
                <li key={move} className={move === this.state.stepNumber ? 'selectedMove' : null}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });

        if (!this.state.asc) {
            moves = moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        winningSquares={winningSquares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <button onClick={() => this.toggleOrder()}>Toggle Order</button>
            </div>

        );
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const moveId = "(" + parseInt(i / 3 + 1, 10) + ", " + (i % 3 + 1) + ")";

        this.setState({
            history: history.concat([{
                squares: squares,
                moveId: moveId
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    toggleOrder() {
        this.setState({
            asc: !this.state.asc
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true
        });
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function getWinningSquares(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }

    return null;
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
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}