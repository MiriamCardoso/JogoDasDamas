import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './Board'

class Game extends React.Component {
	constructor(props) {
		super(props);
		let squares = [];
		squares.push(["b",null,"b",null,"b",null,"b",null]);
		squares.push([null,"b",null,"b",null,"b",null,"b"]);
		squares.push(["b",null,"b",null,"b",null,"b",null]);

		squares.push([null, null, null, null, null, null, null, null]);
		squares.push([null, null, null, null, null, null, null, null]);
		
		squares.push([null,"r",null,"r",null,"r",null,"r"]);
		squares.push(["r",null,"r",null,"r",null,"r",null]);
		squares.push([null,"r",null,"r",null,"r",null,"r"]);

		this.state= {
			squares: squares,
			stepNumber: 0,
			player: 'Rr',
			moveFrom: [-1,-1],
			winner: null
		};
	}
	getInitialState() {
		let squares = [];
		squares.push(["b",null,"b",null,"b",null,"b",null]);
		squares.push([null,"b",null,"b",null,"b",null,"b"]);
		squares.push(["b",null,"b",null,"b",null,"b",null]);

		squares.push([null, null, null, null, null, null, null, null]);
		squares.push([null, null, null, null, null, null, null, null]);
		
		squares.push([null,"r",null,"r",null,"r",null,"r"]);
		squares.push(["r",null,"r",null,"r",null,"r",null]);
		squares.push([null,"r",null,"r",null,"r",null,"r"]);

		return {
			squares: squares,
			stepNumber: 0,
			player: 'Rr',
			moveFrom: [-1,-1],
			winner: null
		};
	}

	handleClick(src) {
		if(this.state.winner) {
			return
		}
		const moveFrom = this.state.moveFrom.slice();
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		if(JSON.stringify(moveFrom) === JSON.stringify([-1,-1])) {
			if(!this.state.player.includes(squares[src[0]][src[1]]))
				return; //todo: add error message
			console.log("selected correct player");
			this.setState((state) => {
				return {moveFrom: src.slice()}
			},function(){ return this.showValidMoves(src); });
		}
		else {
			if(JSON.stringify(moveFrom) === JSON.stringify(src)) {
				this.setState((state) => {
					return {moveFrom: [-1,-1]}
				});
				this.clearHighlights();
				return;
			}
			if(squares[src[0]][src[1]] !== 'h') {
				//todo: add error message, invalid move
				return;
			}
			else {
				this.executeMove(moveFrom, src);
			}
		}
		return;
	}
	clearHighlights() {
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		console.log("clearing highlights");
		for(var row of squares) {
			for(var index = 0; index < 8; index++) {
				if(row[index] === 'h') {
					row[index] = null;
				}
			}
		}
		this.setState((state) => {
			return {squares: squares}
		});
	}
	showValidMoves(src) {
		console.log(src);
		let validMoves = [];
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		const dir = this.state.player === 'Rr' ? -1:1;
		//Forward - Right check
		if(src[0] + dir >= 0 && src[0] + dir < 8 && src[1] + 1 >= 0 && src[1] + 1 < 8) 
			if(!squares[src[0] + dir][src[1] + 1] ) {
				validMoves.push([src[0] + dir, src[1] + 1]);
			}
		//Forward - Left check
		if(src[0] + dir >= 0 && src[0] + dir < 8 && src[1] - 1 >= 0 && src[1] - 1 < 8) 
			if(!squares[src[0] + dir][src[1] - 1] ) {
				validMoves.push([src[0] + dir, src[1] - 1]);
			}
		//Backwards Checks
		if("RB".includes(squares[src[0]][src[1]])) {
			//Backward - Right check
			if(src[0] - dir >= 0 && src[0] - dir < 8 && src[1] + 1 >= 0 && src[1] + 1 < 8) {
				if(!squares[src[0] - dir][src[1] + 1] ) {
					validMoves.push([src[0] - dir, src[1] + 1]);
				}
			}
			//Backward - Left check
			if(src[0] - dir >= 0 && src[0] - dir < 8 && src[1] - 1 >= 0 && src[1] - 1 < 8) 
				if(!squares[src[0] - dir][src[1] - 1] ) {
					validMoves.push([src[0] - dir, src[1] - 1]);
				}
		}
		validMoves.push(...this.showValidJumps(src, squares));
		for(var move of validMoves) {
			squares[move[0]][move[1]] = 'h';
		}
		this.setState((state) => {
			return {squares: squares}
		});
	}
	showValidJumps(src, squaresRef) {
		console.log("show valid moves, src: ");
		console.log(src);
		console.log(squaresRef);
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(squaresRef[index].slice());
		}
		let validJumps = [];
		let dir = this.state.player === 'Rr' ? -1:1;
		const enemy = this.state.player === 'Rr' ? 'Bb':'Rr';
		if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] + dir][src[1] + 1])  && squares[src[0] + (2*dir)][src[1] + 2] === null) {	//check that square between the jump is an enemy piece, and dst in null
				console.log("right is valid");
				validJumps.push([src[0] + (2*dir), src[1] + 2]);
				squares[src[0] + dir][src[1] + 1] = null;
				validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] + 2], squares));
				}
		}
		if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that left jump is within the board
			if(enemy.includes(squares[src[0] + dir][src[1] - 1]) && squares[src[0] + (2*dir)][src[1] - 2] === null) {	//check that square between the jump is an enemy piece, and dst is null
				console.log("left is valid");
				validJumps.push([src[0] + (2*dir), src[1] - 2]);
				squares[src[0] + dir][src[1] - 1] = null;
				validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] - 2], squares));
				}
		}
		//backwards checks
		if("RB".includes(squares[this.state.moveFrom[0]][this.state.moveFrom[1]])) {
			console.log("checking king jumps");
			dir = dir * -1;
			if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
				if(enemy.includes(squares[src[0] + dir][src[1] + 1])  && squares[src[0] + (2*dir)][src[1] + 2] === null) {
					console.log("backwards right is valid");
					validJumps.push([src[0] + (2*dir), src[1] + 2]);
					squares[src[0] + dir][src[1] + 1] = null;
					validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] + 2], squares));
					}
			}
			if(src[0] + (2*dir) >= 0 && src[0] + (2*dir) < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that left jump is within the board
				console.log("looking backwards left");
				if(enemy.includes(squares[src[0] + dir][src[1] - 1]) && squares[src[0] + (2*dir)][src[1] - 2] === null) {	
					console.log("backwards left is valid");
					validJumps.push([src[0] + (2*dir), src[1] - 2]);
					squares[src[0] + dir][src[1] - 1] = null;
					validJumps.push(...this.showValidJumps([src[0] + (2*dir), src[1] - 2], squares));
					}
			}
		}

		return validJumps;		
	}
	executeMove(src, dst) {
		//this.clearHighlights();
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(this.state.squares[index].slice());
		}
		const enemy = this.state.player === 'Rr' ? 'Bb':'Rr';
		const player = this.state.player;
		const step = this.state.stepNumber + 1;
		if(Math.abs(src[0] - dst[0]) === 1 && Math.abs(src[1] - dst[1]) === 1) {
			squares[dst[0]][dst[1]] = squares[src[0]][src[1]];
			squares[src[0]][src[1]] = null;
		}
		else {
			let route = this.getRoute(src, dst, squares);
			console.log("route:");
			console.log(route);
			//iterate through path and remove the pieces in route
			for(let i = 0; i < route.length-1; i++) {
				squares[(route[i][0]+route[i+1][0])/2][(route[i][1]+route[i+1][1])/2] = null;
			}
			squares[dst[0]][dst[1]] = squares[src[0]][src[1]];
			squares[src[0]][src[1]] = null;
		}
		const kingRow = this.state.player === 'Rr' ? 0 : 7;
		if(dst[0] === kingRow) {
			squares[dst[0]][dst[1]] = squares[dst[0]][dst[1]].toUpperCase();
		}
		console.log("about to move piece");
		console.log(squares);
		this.calculateWinner(squares, player);
		this.setState((state) => {
			return {squares: squares,
				player: enemy,
				stepNumber: step,
				moveFrom: [-1, -1]
				}
		},this.clearHighlights);
	}
	getRoute(src, dst, squaresRef) {
		console.log("dst:");
		console.log(dst);
		let moveTree = new MoveTree(src);
		this.getRouteHelper(src, 0, squaresRef, moveTree);
		console.log(moveTree.moves);
		let route = [];
		for(let i = moveTree.moves.length-1; i > 0;) {
			console.log("i: " + i);
			console.log(moveTree.moves[i]);
			if(route.length > 0 || JSON.stringify(moveTree.moves[i]) === JSON.stringify(dst) ) {
				route.push(moveTree.moves[i]);
				i = Math.floor((i-1)/4);
			}
			else {
				i--;
			}
		}
		route.push(src);
		route = route.reverse();
		return route;
	}
	getRouteHelper(src, srcIndex, squaresRef, tree) {
		let squares = [];
		const enemy = this.state.player === 'Rr' ? 'Bb':'Rr';
		for(let index = 0; index < 8; index++) {
			squares.push(squaresRef[index].slice());
		}
		//look left forward
		if(src[0] + 2 >= 0 && src[0] + 2 < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] + 1][src[1] - 1])  && squares[src[0] + 2][src[1] - 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				tree.moves[srcIndex * 4 + 1] = [src[0] + 2, src[1] - 2];
				squares[src[0]+1][src[1]-1] = null;
				this.getRouteHelper([src[0]+2,src[1]-2], srcIndex*4+1,squares,tree);
			}
		}
		//look right forward
		if(src[0] + 2 >= 0 && src[0] + 2 < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] + 1][src[1] + 1])  && squares[src[0] + 2][src[1] + 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				tree.moves[srcIndex * 4 + 2] = [src[0] + 2, src[1] + 2];
				squares[src[0]+1][src[1]+1] = null;
				this.getRouteHelper([src[0]+2,src[1]+2], srcIndex*4+2,squares,tree);
			}
		}
		//look left back
		if(src[0] - 2 >= 0 && src[0] - 2 < 8 && src[1] - 2 >= 0 && src[1] - 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] - 1][src[1] - 1])  && squares[src[0] - 2][src[1] - 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				tree.moves[srcIndex * 4 + 3] = [src[0] - 2, src[1] - 2];
				squares[src[0]-1][src[1]-1] = null;
				this.getRouteHelper([src[0]-2,src[1]-2], srcIndex*4+3,squares,tree);
			}
		}
		//look right back
		if(src[0] - 2 >= 0 && src[0] - 2 < 8 && src[1] + 2 >= 0 && src[1] + 2 < 8) {	//check that the right jump is within the board
			if(enemy.includes(squares[src[0] - 1][src[1] + 1])  && squares[src[0] - 2][src[1] + 2] === 'h') {	//check that square between the jump is an enemy piece, and dst in null
				tree.moves[srcIndex * 4 + 4] = [src[0] - 2, src[1] + 2];
				squares[src[0]-1][src[1]+1] = null;
				this.getRouteHelper([src[0]-2,src[1]+2], srcIndex*4+4,squares,tree);
			}
		}
	}
	calculateWinner(squaresRef, player) {
		let squares = [];
		for(let index = 0; index < 8; index++) {
			squares.push(squaresRef[index].slice());
		}
		for(var row of squares) {
			for(var index = 0; index < 8; index++) {
				if(row[index] === 'h') {
					row[index] = null;
				}
			}
		}
		console.log("calculate winner");
		const enemy = player === "Rr" ? "Bb" : "Rr";
		const dir = this.state.player === 'Rr' ? 1:-1;
		console.log("dir: " + dir);
		console.log("player: " + player);
		let enemySquares = [];
		for(let i = 0; i < 8; i++) {
			for(let j = 0; j < 8; j++) {
				if(enemy.includes(squares[i][j])) {
					enemySquares.push([i,j]);
				}
			}
		}
		//if the enemy has no pieces left
		if(enemySquares.length === 0) {
			this.setState((state) => {
				return {winner: player}
			});
			return;
		}
		for(let i = 0; i < enemySquares.length; i++) {
			//Forward - Right check
			if(enemySquares[i][0] + dir >= 0 && enemySquares[i][0] + dir < 8 && enemySquares[i][1] + 1 >= 0 && enemySquares[i][1] + 1 < 8) {
				if(!squares[enemySquares[i][0] + dir][enemySquares[i][1] + 1] ) {
					return;
				}
			}
			//Forward - Left check
			if(enemySquares[i][0] + dir >= 0 && enemySquares[i][0] + dir < 8 && enemySquares[i][1] - 1 >= 0 && enemySquares[i][1] - 1 < 8) {
				if(!squares[enemySquares[i][0] + dir][enemySquares[i][1] - 1] ) {
					return;
				}
			}
			//Backwards Checks
			if("RB".includes(squares[enemySquares[i][0]][enemySquares[i][1]])) {
				//Backward - Right check
				if(enemySquares[i][0] - dir >= 0 && enemySquares[i][0] - dir < 8 && enemySquares[i][1] + 1 >= 0 && enemySquares[i][1] + 1 < 8) {
					if(!squares[enemySquares[i][0] - dir][enemySquares[i][1] + 1] ) {
						return;
					}
				}
				//Backward - Left check
				if(enemySquares[i][0] - dir >= 0 && enemySquares[i][0] - dir < 8 && enemySquares[i][1] - 1 >= 0 && enemySquares[i][1] - 1 < 8) {
					if(!squares[enemySquares[i][0] - dir][enemySquares[i][1] - 1] ) {
						return;
					}
				}
			}
		}
		for(let i = 0; i < enemySquares.length; i++) {
			let temp = new MoveTree(enemySquares[i]);
			this.getRouteHelper(enemySquares[i], 0, squares, temp);
			if(temp.moves.length > 1) {
				return;
			}
		}
		this.setState((state) => {
			return {winner: player}
		});

	}
	render() {
	const squares = this.state.squares.slice();
		return (
			<div className="game">
				<h2>Checkers</h2>
				<Board 
					squares={squares}
					onClick={(src) => this.handleClick(src)}
				/>
				<div className="stats">
					<p>Player: {this.state.player}</p>
					<p>MoveNumber: {this.state.stepNumber}</p>
				</div>
				<PlayAgainButton 
					winner={this.state.winner}
				/>

			</div>
		);
	}
}
function PlayAgainButton(props) {
	if(props.winner) {
		return (
			<button type="button">Play Again?</button>
		);
	}
	return null;
}



// ===================

ReactDOM.render(
	<Game />,
	document.getElementById("root")
);


function MoveTree(src) {
	this.moves = [];
	this.moves.push(src);
}


