import React, { useState, Component  } from 'react'
import axios from 'axios'
import Board from './Board'

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.SetEmptyBoard(),
      totalShootCount: 0,
      gameOver: false
    };
  }

  initialiseGame(){
    this.setState = ({
      board: this.SetEmptyBoard(),
      totalShootCount: 0,
      gameOver: false
    });
  }

  SetEmptyBoard() {
    let emptyBoard = [];
    for (let x = 0; x < this.props.size; x++) {
      emptyBoard.push([]);
      for (let y = 0; y < this.props.size; y++) {
        emptyBoard[x].push({
          isSelected: false,
          isShip: false,
          coordinates: {
            x: x,
            y: y
          }
        });
      }
    }

    return emptyBoard;
  }

  handleCellClick(cell) {
    if (cell.isSelected) {
      return;
    }

    const formData = {
      x: cell.coordinates.x,
      y: cell.coordinates.y,
    }

    axios({
      method: 'post',
      url: '/api/shoot',
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then(function (response) {
        console.log(response.data)
    })
    .catch(function (response) {
      console.log(response)
    });

    
    let selectedItem = { ...cell };
    console.log("selectedItem " + selectedItem)
    selectedItem.isSelected = true;

    let board = [...this.state.board];
    board[cell.coordinates.x][cell.coordinates.y] = selectedItem;

    let totalShootCount = this.state.totalShootCount;
    totalShootCount += 1;

    let shipBlocksRevealed = this.state.shipBlocksRevealed;
    let ships = this.state.ships;
    
    if (selectedItem.isShip) {
      shipBlocksRevealed += 1;
      
      for(let ship of ships){
        let isBreak = false;
        for(let shipCell of ship.points){
          if(shipCell.x === cell.coordinates.x && shipCell.y === cell.coordinates.y){
            shipCell.isRevealed = true;
            isBreak = true;
            break;
          }
        }
        if(isBreak){
          break;
        }
      }
            
    }

    this.setState({
      board: board,
      totalShootCount: totalShootCount
    });

    if (shipBlocksRevealed === this.state.totalShipBlocks) {
      this.setState({
        gameOver: true
      });
    }
  }

  handlePlayAgain() {
    this.gameInitialize();
    
    this.setState(this.state);
  }

  render() {
    return (
      <div className="game">
        <div className="heading">
          <h1>Battleship</h1>
        </div>
        <div className="game-board">
          <Board
            board={this.state.board}
            onCellClick={(cell) =>
              this.handleCellClick(cell)
            }
          />
        </div>
      </div>
    );
  }
}

/*function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect(()=>{
    fetch("/api").then(
      response => response.json()
    ).then(
      data =>{setBackendData(data)}
    )
  }, [])

  return (
    <div>
    {(typeof backendData.users == 'undefined') ? (
      <p>Loading ...</p>
    ):(
      backendData.users.map((user, i) =>(
        <p key={i}>{user}</p>
      ))
    )}
      
    </div>
  )
}

export default App*/

