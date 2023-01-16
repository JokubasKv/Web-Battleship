import React, { useEffect, Component  } from 'react'
import axios from 'axios'
import Board from './Board'

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: this.SetEmptyBoard(),
      totalShootCount: 0,
      totalShipBlocks: 69,
      boardNumber: 0,
      gameOver: false
    };
    
    //this.initialiseGame()
  }

  componentDidMount() {
    // call api or anything
    this.initialiseGame();
    console.log("Component has been rendered");
  }
  componentDidUpdate(){
    console.log(this.state+ "component did update")
  }


  initialiseGame(){
    const self = this;
    axios({
      method: 'get',
      url: '/api/start',
      config: { headers: {'Content-Type': 'application/json' }}
    })
    .then( (response) => {
        console.log(response.data)
        const boardNumber = response.data.boardNumber
        const totalShipBlocks = response.data.totalShipBlocks

        this.setState ({
          board: this.SetEmptyBoard(),
          totalShootCount: 0,
          totalShipBlocks: totalShipBlocks,
          boardNumber: boardNumber,
          gameOver: false
        });

        console.log(this.state)
    })
    .catch(function (response) {
      alert("No connection to server. Check if server is runnning" + response)
    });
    console.log(this.state)
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
      boardNumber: this.state.boardNumber,
      x: cell.coordinates.x,
      y: cell.coordinates.y,
    }

    axios({
      method: 'post',
      url: '/api/shoot',
      data: formData,
      config: { headers: {'Content-Type': 'application/json' }}
    })
    .then((response) => {
        console.log(response.data)
        
        let selectedItem = { ...cell };
        selectedItem.isSelected = true;
        selectedItem.isShip = response.data.isShip;
    
        let board = [...this.state.board];
        board[cell.coordinates.x][cell.coordinates.y] = selectedItem;
    
        let totalShootCount = this.state.totalShootCount;
        let totalShipBlocks = this.state.totalShipBlocks;

        if(selectedItem.isShip){
          totalShipBlocks -=1;
        }
        else{
          totalShootCount += 1;
        }
    
        this.setState({
          board: board,
          totalShootCount: totalShootCount,
          totalShipBlocks: totalShipBlocks
        });


        if (0 === this.state.totalShipBlocks || 25 === totalShootCount) {
          this.setState({
            gameOver: true
          });
        }

    })
    .catch(function (response) {
      console.log(response)
    });
  }

  showBoard(){
    
    for (let i = 0; i < this.props.size; i++){
      for(let j = 0; j < this.props.size; j++){
        let cell= this.state.board[i][j]

    console.log(cell)
    const formData = {
      boardNumber: this.state.boardNumber,
      x: cell.coordinates.x,
      y: cell.coordinates.y,
    }

    axios({
      method: 'post',
      url: '/api/shoot',
      data: formData,
      config: { headers: {'Content-Type': 'application/json' }}
    })
    .then((response) => {
        console.log(response.data)
        
        let selectedItem = { ...cell };
        selectedItem.isSelected = true;
        selectedItem.isShip = response.data.isShip;
    
        let board = [...this.state.board];
        board[cell.coordinates.x][cell.coordinates.y] = selectedItem;
    
        this.setState({
          board: board
        });

    })
    .catch(function (response) {
      console.log(response)
    });
    }
  }
}
  

  render() {
    return (
      <div className="game">
        <div className="heading">
          <h1>Battleship</h1>
        </div>

        <div id="block_container">
        <GameInfo totalShootCount={this.state.totalShootCount}  totalShipBlocks={this.state.totalShipBlocks}/>

        <div className="game-board" id="bloc1">
          <Board
            board={this.state.board}
            onCellClick={(cell) =>
              this.handleCellClick(cell)
            }
          />

        </div>
        </div>
        {this.state.gameOver && (
          <GameOver
            game={this.state}
            onPlayAgain={() => this.initialiseGame()}
          />
        )}
        <button onClick={() => this.showBoard()}> Show Board </button>
        <button onClick={() => this.initialiseGame()}> Reset </button>
      </div>
    );
  }
}

function GameInfo(props) {
  return (
    <div className="game-info" id="bloc1">
      <p>Shots left : {25 - props.totalShootCount}</p>
      <p>Ships Left : {props.totalShipBlocks}</p>
    </div>
  );
}

function GameOver(props) {
  let game = props.game;

  const isWin = game.totalShipBlocks === 0 ? true : false;

  return (
    <div className="modal">
      <div className="modal-content">

      {isWin  
        ?<h1>You win</h1>
        :<h1>Game Over</h1>
        
        }

        <button onClick={props.onPlayAgain}> Play Again </button>
      </div>
    </div>
  );
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

