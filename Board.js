import React from 'react';
class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			squares: props.squares
		};
	}
	renderRow(i) {
		return (
			<div className="row"> 
				<Square
					value={this.props.squares[i][0]}
					onClick={() => this.props.onClick([i,0])}
				/>
				<Square
					value={this.props.squares[i][1]}
					onClick={() => this.props.onClick([i,1])}
				/>
				<Square
					value={this.props.squares[i][2]}
					onClick={() => this.props.onClick([i,2])}
				/>
				<Square
					value={this.props.squares[i][3]}
					onClick={() => this.props.onClick([i,3])}
				/>
				<Square
					value={this.props.squares[i][4]}
					onClick={() => this.props.onClick([i,4])}
				/>
				<Square
					value={this.props.squares[i][5]}
					onClick={() => this.props.onClick([i,5])}
				/>
				<Square
					value={this.props.squares[i][6]}
					onClick={() => this.props.onClick([i,6])}
				/>
				<Square
					value={this.props.squares[i][7]}
					onClick={() => this.props.onClick([i,7])}
				/>
			</div>
			);
				}

	render() {
		return (
			<div className="board">
				{this.renderRow(0)}
				{this.renderRow(1)}
				{this.renderRow(2)}
				{this.renderRow(3)}
				{this.renderRow(4)}
				{this.renderRow(5)}
				{this.renderRow(6)}
				{this.renderRow(7)}
			</div>
		);
	}
}

function Square(props) {
	switch(props.value) {
		case 'h':
			return (
				<div className="square">
					<div className="selectedSquare" onClick={props.onClick}>
					</div>
				</div>
			);
		case 'r':
			return (
				<div className="square">
				<div className="redSquare" onClick={props.onClick}>
				</div>
				</div>
			);
		case 'b':
			return (
				<div className="square">
				<div className="blackSquare" onClick={props.onClick}>
				</div>
				</div>
			);
		case 'R':
			return (
				<div className="square">
				<div className="redSquare" onClick={props.onClick}>
					<img src={process.env.PUBLIC_URL + "/img/crown.png"} alt="king" />
				</div>
				</div>
			);
		case 'B':
			return (
				<div className="square">
				<div className="blackSquare" onClick={props.onClick}>
					<img src={process.env.PUBLIC_URL + "/img/crown.png"} alt="king" />
				</div>
				</div>
			);
		default:
			return (
				<div className="square" onClick={props.onClick}>
				</div>
			);
			
	}

	return (
		<div className="square" onClick={props.onClick}>
			<p>{props.value}</p>
		</div>
	);
}

export default Board;