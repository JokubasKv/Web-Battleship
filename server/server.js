const express = require('express')
const app = express()



let boardAmount=0;
let boards=[];

app.use(express.json())
/*const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));*/


app.get("/api",(req,res) =>{
    console.log("base api get")
})

app.post("/api/shoot",(req,res) =>{
    
  //console.log(req.body)

    let board = boards[req.body.boardNumber]

    const cell = board[req.body.x][req.body.y]

    formData={
      isShip: cell.isShip
    }

    //console.log(req.body +" Isship: "+ cell.isShip);

    res.send(formData);
})

app.get("/api/start",(req,res) =>{
    const gameUtil = new GameUtil(10);
    boards[boardAmount] = gameUtil.GenerateBoard();
    //console.log(boards[boardAmount])

    const formData ={
        boardNumber : boardAmount,
        totalShipBlocks: gameUtil.totalShipBlocks
    }

    res.send(formData);
    boardAmount++;
})

var server = app.listen(3600,() => {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Server app listening at http://%s:%s", host, port)
})

class GameUtil {
    constructor(size) {
      this.size = size;
      console.clear();
    }
  
    board = null;
    ships= [5,4,3,3,2,2,2,1,1,1]
    totalShipBlocks = 0;
    invalidAttempts = 0;
  
    GenerateBoard() {
      this.SetEmptyBoard();
      this.SetAllShips();
      console.log(this.ships, "ships");
      console.log(this.invalidAttempts, "InvalidAttempts");
      console.log(this.totalShipBlocks, "TotalShipBlocks");
      return this.board;
    }
  
    SetEmptyBoard() {
  
      let emptyBoard = [];
      
      for (let x = 0; x < this.size; x++) {
        emptyBoard.push([]);
        for (let y = 0; y < this.size; y++) {
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
  
      this.board = emptyBoard;
    }
  
    SetAllShips() {
      for (let i = 0; i < this.ships.length; i++) {
        this.BuildShip(this.ships[i]);
        this.totalShipBlocks += this.ships[i]
      }
    }
  
    BuildShip(ship) {
      let boardCopy = GameUtil.CopyArrayOfObjects(this.board);
      let direction = this.GetDirection();
  
      let shipCoordinates = [];
  
      let startPoint = {
        x: this.GetRandomNumber(0, this.size - 1),
        y: this.GetRandomNumber(0, this.size - 1),
        isRevealed: false
      };

      
      let currentPoint;
      let potentialship=[];
      for (let i = 1; i <= ship; i++) {
        
        let nextPoint =
          i === 1 ? startPoint : this.getNextPoint(currentPoint, direction);
  
        if (!this.IsValidPoint(boardCopy, nextPoint, direction)) {
          this.invalidAttempts += 1;
          this.BuildShip(ship);
          return;
        }
        potentialship.push(nextPoint);
        currentPoint = nextPoint;
      }

      //console.log(potentialship);
      for(let i = 0; i < potentialship.length; i++){
        this.SetIsShip(boardCopy, potentialship[i]);
      }
      this.board = boardCopy;
    }
  
    static CopyArrayOfObjects(arrayObj) {
      return JSON.parse(JSON.stringify(arrayObj));
    }
  
    IsValidPoint(board, point,direction) {
      //inside the board
      if (!board[point.x] || !board[point.x][point.y]) {
        return false;
      }

      //Check surrounding area for boats
      for (let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
          let pointX = point.x +i;
          let pointy = point.y +j;
          //Ignore If outside the board
          if (!board[pointX] || !board[pointX][pointy]) {
            continue
          }
          //If boat found stop
          if (board[pointX][pointy].isShip ) {
            return false;
          }
        }
      }

      return true;
    }
  
    getNextPoint(currentPoint, direction) {
      let nextPoint = {};
      switch (direction) {
        case "left":
          nextPoint.x = currentPoint.x;
          nextPoint.y = currentPoint.y - 1;
          break;
        case "right":
          nextPoint.x = currentPoint.x;
          nextPoint.y = currentPoint.y + 1;
          break;
        case "up":
          nextPoint.x = currentPoint.x - 1;
          nextPoint.y = currentPoint.y;
          break;
        case "down":
          nextPoint.x = currentPoint.x + 1;
          nextPoint.y = currentPoint.y;
          break;
        default:
          throw "invalid position";
      }
      
      nextPoint.isRevealed = false;
      return nextPoint;
    }
  
    SetIsShip(board, point) {
      let selectedSquare = Object.assign({}, board[point.x][point.y]);
      selectedSquare.isShip = true;
      board[point.x][point.y] = selectedSquare;
    }
  
    GetDirection() {
      let direction = ["left", "right", "up", "down"];
      let directionIndex = this.GetRandomNumber(0, 3);
      return direction[directionIndex];
    }
  
    GetRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }